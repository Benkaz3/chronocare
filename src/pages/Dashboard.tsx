// src/pages/Dashboard/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Paper,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  History as HistoryIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  useUserData();

  const navigate = useNavigate();
  const location = useLocation();

  const navOptions = [
    { label: 'Thêm', icon: <AddIcon />, path: 'record' },
    { label: 'Lịch sử', icon: <HistoryIcon />, path: 'history' },
    { label: 'Biểu đồ', icon: <BarChartIcon />, path: 'stats' },
    { label: 'Cài đặt', icon: <SettingsIcon />, path: 'settings' },
  ];

  const currentNav = navOptions.findIndex((option) =>
    location.pathname.startsWith(`/dashboard/${option.path}`)
  );

  const [value, setValue] = useState(currentNav !== -1 ? currentNav : 0);

  useEffect(() => {
    setValue(currentNav !== -1 ? currentNav : 0);
  }, [currentNav]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`/dashboard/${navOptions[newValue].path}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h1' sx={{ flexGrow: 1, fontFamily: 'Playfair' }}>
            ChronoCare
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
      <Box sx={{ flex: 1, padding: 2 }}>
        <Container
          maxWidth='lg'
          sx={{ mb: 7 /* Space for Bottom Navigation */ }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange}>
          {navOptions.map((option) => (
            <BottomNavigationAction
              key={option.path}
              label={option.label}
              icon={option.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Dashboard;
