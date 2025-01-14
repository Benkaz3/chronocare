import React from 'react';
import RecordForm from '../../components/RecordForm';
import { Box, Paper } from '@mui/material';

const RecordPage: React.FC = () => {
  return (
    <Paper
      elevation={2}
      sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2, height: '100vh' }}
    >
      <RecordForm />
    </Paper>
  );
};

export default RecordPage;
