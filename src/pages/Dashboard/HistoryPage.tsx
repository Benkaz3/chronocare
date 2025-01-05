import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import HistoryTable from '../../components/HistoryTable/HistoryTable';

const HistoryPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
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
    </Box>
  );
};

export default HistoryPage;
