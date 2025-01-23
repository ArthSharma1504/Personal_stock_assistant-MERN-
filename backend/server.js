const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// Create an Express app
const app = express();
const port = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Setup Google Sheets API
const sheets = google.sheets('v4');

// Authenticate with Google Sheets using service account
const auth = new GoogleAuth({
  keyFile: '../service.json', // Or load from environment
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const apiKey = process.env.GOOGLE_API_KEY; // Google API Key from environment variables
const spreadsheetId = process.env.SPREADSHEET_ID; // Spreadsheet ID from environment variables

// Endpoint to fetch data from Google Sheets
app.get('/data', async (req, res) => {
  const topTenRange = 'stock!G4:I13';
  const cmpRange = 'stock!A2:C68';

  try {
    // Fetch top ten stock codes
    const topTenResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${topTenRange}?key=${apiKey}`
    );
    const topTenResult = topTenResponse.data;

    // Fetch CMP data
    const cmpResponse = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${cmpRange}?key=${apiKey}`
    );
    const cmpResult = cmpResponse.data;

    if (topTenResult.values && cmpResult.values) {
      const topTenStockCodes = topTenResult.values.map(row => row[2]);

      const cmpData = cmpResult.values.map(row => ({
        stockCode: row[0],
        sector: row[1],
        cmp: row[2],
      }));

      const filteredAndOrderedData = topTenStockCodes.map(stockCode => {
        const matchingStock = cmpData.find(item => item.stockCode === stockCode);
        return matchingStock || { stockCode, sector: 'N/A', cmp: 'N/A' };
      });

      res.json(filteredAndOrderedData); // Send the data to the frontend
    } else {
      res.status(500).json({ error: 'Unable to fetch valid data' });
    }
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// API route to handle "Buy" action
app.post('/buy', async (req, res) => {
  const { stockCode, sector, cmp } = req.body;
  const buySheetRange = 'buy!A1:C1'; // Adjust to your Google Sheets range

  try {
    // Get the authenticated client
    const client = await auth.getClient();

    // Make a request to Google Sheets API to append data
    const response = await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: buySheetRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[stockCode, sector, cmp]],
      },
    });

    res.status(200).send({ message: 'Buy action successful!' });
  } catch (error) {
    console.error('Error during buy action:', error);
    res.status(500).send({ message: 'Failed to complete buy action.' });
  }
});

app.delete('/delete/:stockCode', async (req, res) => {
  const stockCode = req.params.stockCode; // e.g., NSE:EVINDIA

  try {
    // Authenticate with Google Sheets
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const range = 'buy!A:A'; // Assuming stock codes are in column A of the "buy" sheet

    // Fetch all stock codes from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const stockCodes = response.data.values;

    // Find the index of the stock code to delete
    const indexToDelete = stockCodes.findIndex(row => row[0] === stockCode);

    if (indexToDelete === -1) {
      // Stock code not found
      return res.status(404).json({ error: 'No matching stock code found to delete.' });
    }

    // Delete the row by its index (rows are 1-indexed in Sheets)
    const deleteRequest = {
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Default sheet ID; change if necessary
                dimension: 'ROWS',
                startIndex: indexToDelete,
                endIndex: indexToDelete + 1,
              },
            },
          },
        ],
      },
    };

    await sheets.spreadsheets.batchUpdate(deleteRequest);

    res.json({ message: 'Stock code deleted successfully.' });
  } catch (error) {
    console.error('Error during delete operation:', error);
    res.status(500).json({ error: 'An error occurred while deleting the stock.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
