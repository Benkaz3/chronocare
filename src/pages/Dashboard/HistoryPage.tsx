// src/pages/Dashboard/HistoryPage.tsx

import React from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import HistoryTable from '../../components/HistoryTable';

const HistoryPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant='h5' gutterBottom>
        Lịch sử
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label='History Tabs'
      >
        <Tab label='Huyết Áp' />
        <Tab label='Đường Huyết' />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <HistoryTable type='bloodPressure' title='' />}
        {tabIndex === 1 && <HistoryTable type='bloodSugar' title='' />}
      </Box>
    </Paper>
  );
};

export default HistoryPage;
