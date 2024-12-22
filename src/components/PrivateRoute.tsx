import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // Ensure this path is correct

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }

  return user ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
