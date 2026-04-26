import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if token exists
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
