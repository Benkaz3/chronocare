// src/pages/Dashboard/SettingsPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
  TextField,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import useUserData from '../../hooks/useUserData';
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
  updateProfile,
} from 'firebase/auth';
import { CUTE_NAMES } from '../../constants/cuteNames';

const SettingsPage: React.FC = () => {
  const { signOut, loading } = useAuth();
  const { readings, error } = useUserData();

  const handleLogout = async () => {
    await signOut();
    alert('Đăng xuất thành công!');
  };

  interface User {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser: FirebaseUser | null) => {
        if (currentUser) {
          let displayName = currentUser.displayName;

          // If displayName is null, assign a random cute name
          if (!displayName) {
            const randomName =
              CUTE_NAMES[Math.floor(Math.random() * CUTE_NAMES.length)];
            try {
              await updateProfile(currentUser, { displayName: randomName });
              displayName = randomName;
            } catch (err) {
              console.error('Error assigning random name:', err);
            }
          }

          setUser({
            displayName: displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Vui lòng đăng nhập để xem cài đặt của bạn.</div>;
  }

  // Ensure userNameOrEmail is always a string
  const userNameOrEmail = user.displayName || user.email || 'unknown';

  const handleDownloadJSON = () => {
    if (
      readings.bloodPressure.length === 0 &&
      readings.bloodSugar.length === 0
    ) {
      alert('Không có dữ liệu sức khỏe để tải xuống.');
      return;
    }

    const dataToDownload = {
      bloodPressure: readings.bloodPressure,
      bloodSugar: readings.bloodSugar,
    };
    downloadJSON(dataToDownload, `du_lieu_suc_khoe_${userNameOrEmail}.json`);
  };

  const handleDownloadBloodPressureCSV = () => {
    if (readings.bloodPressure.length === 0) {
      alert('Không có dữ liệu huyết áp để tải xuống.');
      return;
    }
    downloadBloodPressureCSV(
      readings.bloodPressure,
      `du_lieu_huyet_ap_${userNameOrEmail}.csv`
    );
  };

  const handleDownloadBloodSugarCSV = () => {
    if (readings.bloodSugar.length === 0) {
      alert('Không có dữ liệu đường máu để tải xuống.');
      return;
    }
    downloadBloodSugarCSV(
      readings.bloodSugar,
      `du_lieu_duong_mau_${userNameOrEmail}.csv`
    );
  };

  const handleDownloadPDF = () => {
    if (
      readings.bloodPressure.length === 0 &&
      readings.bloodSugar.length === 0
    ) {
      alert('Không có dữ liệu sức khỏe để tải xuống.');
      return;
    }

    const dataToDownload = {
      bloodPressure: readings.bloodPressure,
      bloodSugar: readings.bloodSugar,
    };
    downloadPDF(
      dataToDownload,
      `du_lieu_suc_khoe_${userNameOrEmail}.pdf`,
      userNameOrEmail
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNewDisplayName(user.displayName || '');
  };

  const handleSaveClick = async () => {
    if (!newDisplayName.trim()) {
      setUpdateError('Tên không được để trống.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: newDisplayName });
        setUser({
          ...user,
          displayName: newDisplayName,
        });
        setIsEditing(false);
        alert('Cập nhật tên thành công!');
      } catch (err) {
        console.error('Error updating display name:', err);
        setUpdateError('Đã xảy ra lỗi khi cập nhật tên.');
      }
    } else {
      setUpdateError('Người dùng không được xác thực.');
    }

    setIsUpdating(false);
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

      {(error || updateError) && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error || updateError}
        </Alert>
      )}

      <Box mb={4}>
        <Typography variant='h6' sx={{ color: 'text.secondary' }}>
          Thông tin cá nhân
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          {isEditing ? (
            <TextField
              label='Tên'
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              variant='outlined'
              size='small'
              fullWidth
            />
          ) : (
            <Typography
              variant='body1'
              sx={{ color: 'text.primary', flexGrow: 1 }}
            >
              <strong>Tên: </strong>
              {user.displayName}
            </Typography>
          )}
          {!isEditing && (
            <IconButton
              aria-label='edit'
              onClick={handleEditClick}
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        {isEditing && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
              disabled={isUpdating}
              sx={{ textTransform: 'none', borderRadius: 2, minWidth: 100 }}
            >
              Lưu
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setIsEditing(false)}
              sx={{
                ml: 2,
                textTransform: 'none',
                borderRadius: 2,
                minWidth: 100,
              }}
            >
              Hủy
            </Button>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
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
            Dữ liệu đường huyết
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
