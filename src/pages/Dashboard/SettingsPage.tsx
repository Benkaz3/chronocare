import React from 'react';
import { Typography, Paper } from '@mui/material';

const SettingsPage: React.FC = () => (
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant='h5' gutterBottom>
      Cài đặt
    </Typography>
    {/* Future settings go here */}
    <Typography variant='body1'>Opps, không có gì! Liu liu! 👻</Typography>
  </Paper>
);

export default SettingsPage;
