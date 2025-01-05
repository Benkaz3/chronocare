// src/App.tsx

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from './components/Spinner';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { HealthDataProvider } from './context/HealthDataContext';
import TermsPrivacyPolicy from './pages/terms-privacy-policy';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecordPage = lazy(() => import('./pages/Dashboard/RecordPage'));
const HistoryPage = lazy(() => import('./pages/Dashboard/HistoryPage'));
const StatsPage = lazy(() => import('./pages/Dashboard/StatsPage'));
const SettingsPage = lazy(() => import('./pages/Dashboard/SettingsPage'));

const preloadComponent = (
  component: () => Promise<{ default: React.ComponentType<any> }>
) => {
  component();
};

const App: React.FC = () => {
  const { user, loading } = useAuth();

  // Preload components based on authentication state
  useEffect(() => {
    if (user) {
      preloadComponent(() => import('./pages/Dashboard'));
      preloadComponent(() => import('./pages/Dashboard/RecordPage'));
    } else {
      preloadComponent(() => import('./pages/AuthPage'));
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
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
            path='/terms-privacy-policy'
            element={<TermsPrivacyPolicy />}
          />

          {/* Dashboard Routes Protected by ProtectedRoute */}
          <Route
            path='/dashboard/*'
            element={
              <ProtectedRoute>
                <HealthDataProvider>
                  <Dashboard />
                </HealthDataProvider>
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
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
