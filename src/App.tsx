// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import RecordPage from './pages/Dashboard/RecordPage';
import HistoryPage from './pages/Dashboard/HistoryPage';
import StatsPage from './pages/Dashboard/StatsPage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import useAuth from './hooks/useAuth';
import Spinner from './components/Spinner';
// import { Alert, Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  // if (error) {
  //   return (
  //     <Box mt={2} mx={2}>
  //       <Alert severity='error'>
  //         {error.message || 'Đã xảy ra lỗi trong quá trình xác thực.'}
  //       </Alert>
  //     </Box>
  //   );
  // }

  return (
    <Routes>
      {/* Root Route */}
      <Route
        path='/'
        element={
          user ? (
            <Navigate to='/dashboard/record' replace />
          ) : (
            <Navigate to='/auth' replace />
          )
        }
      />

      {/* Authentication Route */}
      <Route
        path='/auth'
        element={
          !user ? <AuthPage /> : <Navigate to='/dashboard/record' replace />
        }
      />

      {/* Dashboard Routes Protected by ProtectedRoute */}
      <Route
        path='/dashboard/*'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path='record' element={<RecordPage />} />
        <Route path='history' element={<HistoryPage />} />
        <Route path='stats' element={<StatsPage />} />
        <Route path='settings' element={<SettingsPage />} />
        {/* Redirect any unknown nested routes to /dashboard/record */}
        <Route path='*' element={<Navigate to='record' replace />} />
      </Route>

      {/* Catch-All Route */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default App;
