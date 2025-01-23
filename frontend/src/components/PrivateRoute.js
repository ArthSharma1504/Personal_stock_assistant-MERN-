import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component that will be used to protect routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('googleAuthToken'); // Check if the user is authenticated
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;  // Redirect to login page if not authenticated
  }

  return children;  // Render the child components if authenticated
};

export default PrivateRoute;
