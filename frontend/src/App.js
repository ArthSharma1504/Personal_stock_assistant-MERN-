import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginWithGoogle from './pages/LoginWithGoogle';
import Dashboard from './pages/Dashboard';  
import Strategy1 from './components/Strategy1';
import PrivateRoute from './components/PrivateRoute';  // Import the PrivateRoute component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginWithGoogle />} />  {/* Login route */}
          
          {/* Use PrivateRoute as a wrapper for protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/strategy1" 
            element={
              <PrivateRoute>
                <Strategy1 />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
