// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';
// import { Alert, Box } from '@mui/material';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
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

  return user ? children : <Navigate to='/auth' replace />;
};

export default ProtectedRoute;
