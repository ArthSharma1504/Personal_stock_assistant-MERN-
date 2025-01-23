import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

const Strategy1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the backend
  const fetchData = async () => {
    setLoading(true); // Show loading state while fetching
    try {
      const response = await fetch('http://localhost:5000/data');
      const result = await response.json();
      
      if (response.ok) {
        setData(result); // Set data from the backend
      } else {
        console.error('Error fetching data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle the 'Buy' action
  const handleBuy = async (row) => {
    try {
      const response = await fetch('http://localhost:5000/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockCode: row.stockCode,
          sector: row.sector,
          cmp: row.cmp,
        }),
      });

      if (response.ok) {
        alert('Buy action completed successfully.');
      } else {
        alert('Failed to complete the buy action.');
      }
    } catch (error) {
      console.error('Error during buy action:', error);
      alert('An error occurred during the buy action.');
    }
  };

  // Handle the 'Delete' action (from Google Sheets)
  const handleDelete = async (stockCode) => {
    if (!window.confirm(`Are you sure you want to delete the stock with code: ${stockCode}?`)) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      const response = await fetch(`http://localhost:5000/delete/${stockCode}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        // If the deletion is successful, show a success message
        alert('Stock deleted successfully.');

        // Re-fetch the data from the backend to update the frontend table
        fetchData();
      } else {
        // Handle backend errors
        console.error('Error from server:', result.error);
        alert(result.error || 'Failed to delete the stock. Please try again.');
      }
    } catch (error) {
      // Handle unexpected errors like network issues
      console.error('Error during delete action:', error);
      alert('An error occurred while attempting to delete the stock. Please try again later.');
    }
  };

  // Handle the 'Update' action
  const handleUpdate = (row) => {
    console.log('Updating:', row);
    alert(`Updating row with stock code: ${row.stockCode}`);
  };

  // Loading state check
  if (loading) {
    return <Typography variant="h6">Loading data...</Typography>;
  }

  return (
    <Paper sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Strategy 1: CMP Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ETF Code</TableCell>
            <TableCell>Sector</TableCell>
            <TableCell>CMP</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.stockCode}</TableCell>
              <TableCell>{row.sector}</TableCell>
              <TableCell>{row.cmp}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuy(row)}
                  sx={{ marginRight: '10px' }}
                >
                  Buy
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(row.stockCode)}
                  sx={{ marginRight: '10px' }}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => handleUpdate(row)}
                >
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Strategy1;
