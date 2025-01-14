// src/pages/Dashboard/SettingsPage.tsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
  TextField,
  IconButton,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Stack,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

// Lazy load the Accordion component
const Accordion = lazy(() => import('@mui/material/Accordion'));

const SettingsPage: React.FC = () => {
  const { signOut, loading: authLoading } = useAuth();
  const { readings, error: dataError } = useUserData();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    try {
      await signOut();
      showSnackbar('Đăng xuất thành công!', 'success');
    } catch (err) {
      console.error('Logout error:', err);
      showSnackbar('Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.', 'error');
    }
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
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Download States
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingJSON, setIsDownloadingJSON] = useState(false);
  const [isDownloadingBPCSV, setIsDownloadingBPCSV] = useState(false);
  const [isDownloadingBGCSV, setIsDownloadingBGCSV] = useState(false);

  // Snackbar State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

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
              showSnackbar(
                'Không thể gán tên ngẫu nhiên. Vui lòng thử lại.',
                'error'
              );
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

  // Ensure userNameOrEmail is always a string
  const userNameOrEmail = user?.displayName || user?.email || 'unknown';

  const handleDownloadJSONData = async () => {
    if (
      readings.bloodPressure.length === 0 &&
      readings.bloodSugar.length === 0
    ) {
      showSnackbar('Không có dữ liệu sức khỏe để tải xuống.', 'warning');
      return;
    }

    setIsDownloadingJSON(true);
    setGlobalError(null);

    try {
      const dataToDownload = {
        bloodPressure: readings.bloodPressure.map((bp) => ({
          recordedAt: bp.recordedAt,
          time: bp.time,
          systolic: bp.systolic,
          diastolic: bp.diastolic,
          pulse: bp.pulse,
        })),
        bloodSugar: readings.bloodSugar.map((bs) => ({
          recordedAt: bs.recordedAt,
          time: bs.time,
          level: bs.level,
        })),
      };
      await downloadJSON(
        dataToDownload,
        `du_lieu_suc_khoe_${userNameOrEmail}.json`
      );
      showSnackbar('Tải xuống JSON thành công!', 'success');
    } catch (err) {
      console.error('JSON download error:', err);
      showSnackbar(
        'Đã xảy ra lỗi khi tải xuống JSON. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setIsDownloadingJSON(false);
    }
  };

  const handleDownloadBloodPressureCSVData = async () => {
    if (readings.bloodPressure.length === 0) {
      showSnackbar('Không có dữ liệu huyết áp để tải xuống.', 'warning');
      return;
    }

    setIsDownloadingBPCSV(true);
    setGlobalError(null);

    try {
      const formattedData = readings.bloodPressure.map((bp) => ({
        recordedAt: bp.recordedAt,
        time: bp.time,
        systolic: bp.systolic,
        diastolic: bp.diastolic,
        pulse: bp.pulse,
      }));
      await downloadBloodPressureCSV(
        formattedData,
        `du_lieu_huyet_ap_${userNameOrEmail}.csv`
      );
      showSnackbar('Tải xuống CSV huyết áp thành công!', 'success');
    } catch (err) {
      console.error('Blood Pressure CSV download error:', err);
      showSnackbar(
        'Đã xảy ra lỗi khi tải xuống CSV huyết áp. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setIsDownloadingBPCSV(false);
    }
  };

  const handleDownloadBloodSugarCSVData = async () => {
    if (readings.bloodSugar.length === 0) {
      showSnackbar('Không có dữ liệu đường máu để tải xuống.', 'warning');
      return;
    }

    setIsDownloadingBGCSV(true);
    setGlobalError(null);

    try {
      const formattedData = readings.bloodSugar.map((bs) => ({
        recordedAt: bs.recordedAt,
        time: bs.time,
        level: bs.level,
      }));
      await downloadBloodSugarCSV(
        formattedData,
        `du_lieu_duong_mau_${userNameOrEmail}.csv`
      );
      showSnackbar('Tải xuống CSV đường máu thành công!', 'success');
    } catch (err) {
      console.error('Blood Sugar CSV download error:', err);
      showSnackbar(
        'Đã xảy ra lỗi khi tải xuống CSV đường máu. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setIsDownloadingBGCSV(false);
    }
  };

  const handleDownloadPDFData = async () => {
    if (
      readings.bloodPressure.length === 0 &&
      readings.bloodSugar.length === 0
    ) {
      showSnackbar('Không có dữ liệu sức khỏe để tải xuống.', 'warning');
      return;
    }

    setIsDownloadingPDF(true);
    setGlobalError(null);

    try {
      const dataToDownload = {
        bloodPressure: readings.bloodPressure.map((bp) => ({
          recordedAt: bp.recordedAt,
          time: bp.time,
          systolic: bp.systolic,
          diastolic: bp.diastolic,
          pulse: bp.pulse,
        })),
        bloodSugar: readings.bloodSugar.map((bs) => ({
          recordedAt: bs.recordedAt,
          time: bs.time,
          level: bs.level,
        })),
      };
      await downloadPDF(
        dataToDownload,
        `du_lieu_suc_khoe_${userNameOrEmail}.pdf`,
        userNameOrEmail
      );
      showSnackbar('Tải xuống PDF thành công!', 'success');
    } catch (err) {
      console.error('PDF download error:', err);
      showSnackbar(
        'Đã xảy ra lỗi khi tải xuống PDF. Vui lòng thử lại.',
        'error'
      );
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNewDisplayName(user?.displayName || '');
  };

  const handleSaveClick = async () => {
    if (!newDisplayName.trim()) {
      setUpdateError('Tên không được để trống.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setGlobalError(null);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: newDisplayName });
        setUser({
          ...user!,
          displayName: newDisplayName,
        });
        setIsEditing(false);
        showSnackbar('Cập nhật tên thành công!', 'success');
      } catch (err) {
        console.error('Error updating display name:', err);
        setUpdateError('Đã xảy ra lỗi khi cập nhật tên. Vui lòng thử lại.');
      }
    } else {
      setUpdateError('Người dùng không được xác thực.');
    }

    setIsUpdating(false);
  };

  if (authLoading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
        p={2}
        sx={{ overflowY: 'auto' }} // Enable vertical scrolling
      >
        <Typography variant='h6' color='text.secondary' align='center'>
          Vui lòng đăng nhập để xem cài đặt của bạn.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2, height: '100vh' }}
    >
      <Box
        p={2}
        sx={{
          backgroundColor: 'background.default',
          borderRadius: 2,
          maxWidth: { xs: '100%', sm: 600 },
          width: '100%',
          margin: '0 auto',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Typography
          variant={isSmallScreen ? 'h5' : 'h4'}
          gutterBottom
          align='center'
          sx={{ color: 'text.primary' }}
        >
          Cài Đặt
        </Typography>

        {/* Global Error Alert */}
        {globalError && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {globalError}
          </Alert>
        )}

        {/* Data Error Alert */}
        {dataError && (
          <Alert severity='warning' sx={{ mb: 2 }}>
            {dataError} Vui lòng kiểm tra kết nối của bạn hoặc thử lại sau.
          </Alert>
        )}

        {/* Update Error Alert */}
        {updateError && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {updateError}
          </Alert>
        )}

        <Stack spacing={3} mb={4}>
          {/* Personal Information Section */}
          <Box>
            <Typography variant='h6' sx={{ color: 'text.secondary', mb: 1 }}>
              Thông tin cá nhân
            </Typography>
            <Divider />

            <Stack spacing={2} mt={2}>
              {/* Display Name */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isEditing ? (
                  <TextField
                    label='Tên'
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    variant='outlined'
                    size='small'
                    fullWidth
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveClick();
                      }
                    }}
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

              {/* Name Editing Actions */}
              {isEditing && (
                <Stack direction='row' spacing={2} mt={1}>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<SaveIcon />}
                    onClick={handleSaveClick}
                    disabled={isUpdating}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      minWidth: 100,
                      minHeight: 48, // Touch-friendly size
                    }}
                  >
                    {isUpdating ? (
                      <CircularProgress size={24} color='inherit' />
                    ) : (
                      'Lưu'
                    )}
                  </Button>
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={() => setIsEditing(false)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      minWidth: 100,
                      minHeight: 48, // Touch-friendly size
                    }}
                    disabled={isUpdating}
                  >
                    Hủy
                  </Button>
                </Stack>
              )}

              {/* Email */}
              <Typography variant='body1' sx={{ color: 'text.primary' }}>
                <strong>Email: </strong>
                {user.email}
              </Typography>

              {/* Logout Button */}
              <Button
                variant='outlined'
                color='secondary'
                fullWidth
                onClick={handleLogout}
                disabled={authLoading}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  minHeight: 48, // Touch-friendly size
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'white',
                  },
                }}
              >
                {authLoading ? <CircularProgress size={24} /> : 'Đăng Xuất'}
              </Button>
            </Stack>
          </Box>

          {/* Data Download Section */}
          <Box>
            <Typography variant='h6' sx={{ color: 'text.secondary', mb: 1 }}>
              Tải xuống dữ liệu
            </Typography>
            <Divider />

            <Stack spacing={2} mt={2}>
              {/* Prominent PDF Download Button */}
              <Button
                variant='contained'
                color='primary'
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPDFData}
                fullWidth
                disabled={isDownloadingPDF}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  minHeight: 48, // Touch-friendly size
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {isDownloadingPDF ? (
                  <CircularProgress color='inherit' size={24} />
                ) : (
                  'Tải Dữ Liệu (PDF)'
                )}
              </Button>

              {/* Lazy Loaded Accordion for Other Download Options */}
              <Suspense
                fallback={
                  <Box display='flex' justifyContent='center' mt={2}>
                    <CircularProgress size={24} />
                  </Box>
                }
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='additional-downloads-content'
                    id='additional-downloads-header'
                  >
                    <Typography sx={{ color: 'text.secondary' }}>
                      Thêm Tùy Chọn Tải Xuống
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {/* JSON Download */}
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={handleDownloadJSONData}
                        startIcon={<DownloadIcon />}
                        fullWidth
                        disabled={isDownloadingJSON}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          minHeight: 48, // Touch-friendly size
                          '&:hover': {
                            backgroundColor: 'secondary.main',
                            color: 'white',
                          },
                        }}
                      >
                        {isDownloadingJSON ? (
                          <CircularProgress color='inherit' size={24} />
                        ) : (
                          'Tải Dữ Liệu (JSON)'
                        )}
                      </Button>

                      {/* CSV Downloads */}
                      <Typography variant='subtitle1'>
                        Tải Dữ Liệu CSV
                      </Typography>
                      <Stack spacing={2}>
                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={handleDownloadBloodPressureCSVData}
                          startIcon={<DownloadIcon />}
                          fullWidth
                          disabled={isDownloadingBPCSV}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            minHeight: 48, // Touch-friendly size
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          {isDownloadingBPCSV ? (
                            <CircularProgress color='inherit' size={24} />
                          ) : (
                            'Dữ Liệu Huyết Áp'
                          )}
                        </Button>

                        <Button
                          variant='outlined'
                          color='primary'
                          onClick={handleDownloadBloodSugarCSVData}
                          startIcon={<DownloadIcon />}
                          fullWidth
                          disabled={isDownloadingBGCSV}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            minHeight: 48, // Touch-friendly size
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          {isDownloadingBGCSV ? (
                            <CircularProgress color='inherit' size={24} />
                          ) : (
                            'Dữ Liệu Đường Máu'
                          )}
                        </Button>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Suspense>
            </Stack>
          </Box>
        </Stack>

        {/* Snackbar for Success and Error Messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default SettingsPage;
