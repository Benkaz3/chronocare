import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BloodPressure from './components/BloodPressure';
import Test from './components/TestFirestoreAdd';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import { CssBaseline } from '@mui/material';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='/' element={<AuthPage />} />
            {/* <Route path='/dang-ky' element={<AuthPage />} /> */}
            {/* <Route path='/test' element={<TestPage />} /> */}
            <Route path='/reset-password' element={<ResetPasswordPage />} />
            <Route element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/blood-pressure' element={<BloodPressure />} />
              <Route
                path='/blood-sugar'
                element={<div>Blood Sugar Page</div>}
              />
              <Route path='/test' element={<Test />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
