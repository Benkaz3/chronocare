import React from 'react';
import { Grid, Paper } from '@mui/material';
import BloodPressureChart from '../../components/BloodPressureChart';
import BloodSugarChart from '../../components/BloodSugarChart';

const StatsPage: React.FC = () => (
  <div>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ padding: 1 }}>
          <BloodPressureChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ padding: 1 }}>
          <BloodSugarChart />
        </Paper>
      </Grid>
    </Grid>
  </div>
);

export default StatsPage;
