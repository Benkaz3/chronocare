// src/pages/Dashboard/StatsPage.tsx

import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import BloodPressureChart from '../../components/BloodPressureChart';
import BloodSugarChart from '../../components/BloodSugarChart';

const StatsPage: React.FC = () => (
  <div>
    <Typography variant='h5' gutterBottom>
      Biểu đồ
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <BloodPressureChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <BloodSugarChart />
        </Paper>
      </Grid>
    </Grid>
  </div>
);

export default StatsPage;
