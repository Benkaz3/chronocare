// src/components/HistoryTable/ErrorAlert.tsx

import React from 'react';
import { Alert } from '@mui/material';

interface ErrorAlertProps {
  error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  return <Alert severity='error'>{error}</Alert>;
};

export default React.memo(ErrorAlert);
