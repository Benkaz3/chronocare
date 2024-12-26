// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import useAuth from './hooks/useAuth';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can replace this with a spinner or a more elaborate loading screen
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Default Route */}
      <Route
        path='/'
        element={
          user ? (
            <Navigate to='/dashboard' replace />
          ) : (
            <Navigate to='/auth' replace />
          )
        }
      />

      {/* Authentication Route */}
      <Route
        path='/auth'
        element={!user ? <AuthPage /> : <Navigate to='/dashboard' replace />}
      />

      {/* Protected Dashboard Route */}
      <Route
        path='/dashboard'
        element={user ? <Dashboard /> : <Navigate to='/auth' replace />}
      />

      {/* Catch-All Route for Undefined Paths */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default App;
