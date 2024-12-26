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

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
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
      <Route
        path='/auth'
        element={
          !user ? <AuthPage /> : <Navigate to='/dashboard/record' replace />
        }
      />
      <Route
        path='/dashboard'
        element={user ? <Dashboard /> : <Navigate to='/auth' replace />}
      >
        <Route path='record' element={<RecordPage />} />
        <Route path='history' element={<HistoryPage />} />
        <Route path='stats' element={<StatsPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route index element={<Navigate to='record' replace />} />
        <Route path='*' element={<Navigate to='record' replace />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};

export default App;
