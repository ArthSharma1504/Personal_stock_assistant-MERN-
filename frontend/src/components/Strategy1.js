import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

const Strategy1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Node.js backend
        const response = await fetch('http://localhost:5000/data');
        const result = await response.json();

        if (response.ok) {
          setData(result); // Set the data from the backend
          setLoading(false);
        } else {
          console.error('Error fetching data:', result.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleDelete = async (stockCode) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${stockCode}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // If the deletion is successful, remove the stock from the frontend state
        setData(prevData => prevData.filter(item => item.stockCode !== stockCode));
        alert('Deleted successfully.');
      } else {
        // If no matching data is found
        alert(result.error || 'Failed to delete.');
      }
    } catch (error) {
      console.error('Error during delete action:', error);
      alert('An error occurred during the delete action.');
    }
  };
  

  const handleUpdate = (row) => {
    // For simplicity, we are just logging the row to the console.
    // You can open an update form or modal to edit the row data.
    console.log('Updating:', row);
    alert(`Updating row with stock code: ${row.stockCode}`);
  };

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
