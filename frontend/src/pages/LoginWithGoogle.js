import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Paper } from '@mui/material';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
 // Replace with your Google Client ID

const LoginWithGoogle = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle success response
  const handleSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);

    // Extract the token from the response
    const token = credentialResponse.credential;

    // Store the token in localStorage or sessionStorage
    localStorage.setItem('googleAuthToken', token);

    // Optionally, you can send the token to your backend for validation or authentication
    // Example: You might want to send the token to your backend API to verify it.

    alert('Login successful!');
    navigate('/dashboard'); // Redirect to dashboard after successful login
  };

  // Handle error response
  const handleError = () => {
    console.log('Login Failed');
    alert('Failed to log in.');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: '100vh',  // Full viewport height
          display: 'flex',
          justifyContent: 'center',  // Center horizontally
          alignItems: 'center',  // Center vertically
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',  // Ensure it uses available width
            maxWidth: '400px',  // Limit the max width
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login with Google
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              render={(renderProps) => (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  sx={{ marginBottom: 2 }}
                >
                  Login with Google
                </Button>
              )}
            />
          </Box>
        </Paper>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default LoginWithGoogle;
