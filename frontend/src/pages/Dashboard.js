// src/pages/Dashboard.js

import React, { useState } from 'react';
import { Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Menu, MenuItem, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook for redirection

const Dashboard = () => {
  const [anchorElStrategies, setAnchorElStrategies] = useState(null);
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  const openStrategiesMenu = Boolean(anchorElStrategies);
  const openAccountMenu = Boolean(anchorElAccount);

  const handleClickStrategies = (event) => {
    setAnchorElStrategies(event.currentTarget);
  };

  const handleClickAccount = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleCloseStrategies = () => {
    setAnchorElStrategies(null);
  };

  const handleCloseAccount = () => {
    setAnchorElAccount(null);
  };

  const handleLogout = () => {
    // Clear any authentication data (e.g., tokens, user info, etc.)
    localStorage.removeItem('googleAuthToken'); // Assuming you're storing the token in localStorage

    // Redirect the user to the login page
    navigate('/'); // This assumes you have a route for the login page
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Side Panel (Drawer) */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem>
            <Typography variant="h6">Dashboard</Typography>
          </ListItem>
          <Divider />

          {/* My Strategies Dropdown */}
          <ListItemButton onClick={handleClickStrategies}>
            <ListItemText primary="My Strategies" />
            <ExpandMore />
          </ListItemButton>
          <Menu
            anchorEl={anchorElStrategies}
            open={openStrategiesMenu}
            onClose={handleCloseStrategies}
          >
            <MenuItem component={Link} to="/strategy1" onClick={handleCloseStrategies}>
              Strategy 1
            </MenuItem>
            {/* Add more strategies here when ready */}
          </Menu>

          {/* My Account Dropdown */}
          <ListItemButton onClick={handleClickAccount}>
            <ListItemText primary="My Account" />
            <ExpandMore />
          </ListItemButton>
          <Menu
            anchorEl={anchorElAccount}
            open={openAccountMenu}
            onClose={handleCloseAccount}
          >
            <MenuItem onClick={handleCloseAccount}>Profile</MenuItem>
            <MenuItem onClick={handleCloseAccount}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem> {/* Log Out Menu Item */}
          </Menu>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f5f5f5',
          padding: 3,
        }}
      >
        {/* Total Investment Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          Total Investment
        </Button>

        <Typography variant="h4" gutterBottom>
          Welcome to the Dashboard
        </Typography>
        <Typography variant="body1">
          Select your strategy or manage your account from the side panel.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
