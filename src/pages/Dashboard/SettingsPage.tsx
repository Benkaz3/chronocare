import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import useUserData from '../../hooks/useUserData'; // Adjust the import path as needed
import {
  downloadJSON,
  downloadBloodPressureCSV,
  downloadBloodSugarCSV,
  downloadPDF,
} from '../../utils/downloadUtils';
import useAuth from '../../hooks/useAuth';
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

const SettingsPage: React.FC = () => {
  const { signOut, loading } = useAuth();
  const { readings, error } = useUserData(); // Ensure this is called at the top level

  const handleLogout = async () => {
    await signOut();
    alert('Logged out successfully!');
  };

  // User Info
  interface User {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser: FirebaseUser | null) => {
        if (currentUser) {
          setUser({
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          });
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Please sign in to view your settings.</div>;
  }

  const handleDownloadJSON = () => {
    if (
      readings.bloodPressure.length === 0 &&
      readings.bloodSugar.length === 0
    ) {
      alert('No health data available to download.');
      return;
    }

    const dataToDownload = {
      bloodPressure: readings.bloodPressure,
      bloodSugar: readings.bloodSugar,
    };
    downloadJSON(dataToDownload, 'health_data.json');
  };

  const handleDownloadBloodPressureCSV = () => {
    if (readings.bloodPressure.length === 0) {
      alert('No blood pressure data available to download.');
      return;
    }
    downloadBloodPressureCSV(readings.bloodPressure, 'blood_pressure_data.csv');
  };

  const handleDownloadBloodSugarCSV = () => {
    if (readings.bloodSugar.length === 0) {
      alert('No blood sugar data available to download.');
      return;
    }
    downloadBloodSugarCSV(readings.bloodSugar, 'blood_sugar_data.csv');
  };

  const handleDownloadPDF = () => {
    if (
      readings.bloodPressure.length === 0 &&
      readings.bloodSugar.length === 0
    ) {
      alert('No health data available to download.');
      return;
    }

    const dataToDownload = {
      bloodPressure: readings.bloodPressure,
      bloodSugar: readings.bloodSugar,
    };
    downloadPDF(dataToDownload, 'health_data.pdf');
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: 'background.default',
        borderRadius: 2,
        maxWidth: 600,
        margin: '0 auto',
        boxShadow: 3,
      }}
    >
      <Typography
        variant='h4'
        gutterBottom
        align='center'
        sx={{ color: 'text.primary' }}
      >
        Cài Đặt
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* User Information Section */}
      <Box mb={4}>
        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
          Thông tin cá nhân
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Display user info, assuming 'user' contains name and email */}
        <Box sx={{ mb: 2 }}>
          <Typography variant='body1' sx={{ color: 'text.primary' }}>
            <strong>Tên: </strong>
            {user.displayName}
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.primary' }}>
            <strong>Email: </strong>
            {user.email}
          </Typography>
        </Box>

        <Button
          variant='outlined'
          color='secondary'
          fullWidth
          sx={{
            mb: 2,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'secondary.main',
              color: 'white',
            },
          }}
          onClick={handleLogout}
        >
          Đăng Xuất
        </Button>
      </Box>

      {/* Download Section */}
      <Box mb={4}>
        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
          Tải xuống dữ liệu
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Button
          variant='contained'
          color='primary'
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
          fullWidth
          sx={{
            mb: 2,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Tải (PDF)
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleDownloadJSON}
          startIcon={<DownloadIcon />}
          fullWidth
          sx={{
            mb: 2,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'secondary.main',
              color: 'white',
            },
          }}
        >
          Tải (JSON)
        </Button>
      </Box>

      {/* CSV Download Section */}
      <Box>
        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
          Tải CSV
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display='flex' flexDirection='column' gap={2}>
          <Button
            variant='outlined'
            color='primary'
            onClick={handleDownloadBloodPressureCSV}
            startIcon={<DownloadIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            Dữ liệu huyết áp
          </Button>

          <Button
            variant='outlined'
            color='primary'
            onClick={handleDownloadBloodSugarCSV}
            startIcon={<DownloadIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            Dữ liệu đường máu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
