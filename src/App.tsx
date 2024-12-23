import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BloodPressure from './components/BloodPressure';
import Test from './components/TestFirestoreAdd';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import { CssBaseline } from '@mui/material';
import SignIn from './components/SignIn';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<SignIn />} />
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/blood-pressure' element={<BloodPressure />} />
            <Route path='/blood-sugar' element={<div>Blood Sugar Page</div>} />
            <Route path='/test' element={<Test />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
