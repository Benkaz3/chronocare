// src/components/FormAlert.tsx

import React from 'react';
import { Box, Alert, Typography } from '@mui/material';

interface FormAlertProps {
  successMessage?: string;
  errorMessage?: string;
}

const FormAlert: React.FC<FormAlertProps> = ({
  successMessage,
  errorMessage,
}) => (
  <Box sx={{ minHeight: '65px', mt: 2 }}>
    {successMessage && (
      <Alert severity='success'>
        <Typography variant='body2'>{successMessage}</Typography>
      </Alert>
    )}
    {errorMessage && (
      <Alert severity='error'>
        <Typography variant='body2'>{errorMessage}</Typography>
      </Alert>
    )}
  </Box>
);

export default FormAlert;
