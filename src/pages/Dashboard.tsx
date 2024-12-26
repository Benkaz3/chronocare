// src/pages/Dashboard.tsx

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData'; // Import the hook
import StatusSummary from '../components/StatusSummary';
import RecordForm from '../components/RecordForm';
import HistoryTable from '../components/HistoryTable';
import BloodPressureChart from '../components/BloodPressureChart';
import BloodSugarChart from '../components/BloodSugarChart';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  useUserData(); // Removed 'readings' as it's not used

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      {/* Header */}
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            ChronoCare Dashboard
          </Typography>
          <IconButton
            color='inherit'
            onClick={handleLogout}
            aria-label='Logout'
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Current Status Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <StatusSummary />
            </Paper>
          </Grid>

          {/* Record New Readings */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <RecordForm />
            </Paper>
          </Grid>

          {/* Blood Pressure History */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <HistoryTable
                type='bloodPressure'
                title='Blood Pressure History'
              />
            </Paper>
          </Grid>

          {/* Blood Sugar History */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <HistoryTable type='bloodSugar' title='Blood Sugar History' />
            </Paper>
          </Grid>

          {/* Blood Pressure Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <BloodPressureChart />
            </Paper>
          </Grid>

          {/* Blood Sugar Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <BloodSugarChart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
