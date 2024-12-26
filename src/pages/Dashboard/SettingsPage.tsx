// src/pages/Dashboard/SettingsPage.tsx

import React from 'react';
import { Typography, Paper } from '@mui/material';

const SettingsPage: React.FC = () => (
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant='h5' gutterBottom>
      Settings
    </Typography>
    {/* Future settings go here */}
    <Typography variant='body1'>
      Settings page is under construction.
    </Typography>
  </Paper>
);

export default SettingsPage;
