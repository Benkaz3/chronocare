import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
  TextField,
  Link,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const theme = createTheme();

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setEmail('');
      navigate('/'); // Redirect to the homepage
    } catch (err) {
      console.error('Error sending password reset email: ', err);
      setError('Failed to send password reset email.');
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component='main'
        maxWidth='xs'
        sx={{
          backgroundColor: '#121212',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#1e1e1e',
            padding: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant='h4'
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 3,
              fontFamily: 'Fairdisplay',
            }}
          >
            Quên mật khẩu
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 3,
              textAlign: 'left',
              fontSize: '0.825rem',
            }}
          >
            Nhập địa chỉ email để nhận mail thay đổi mật khẩu
          </Typography>
          <TextField
            variant='outlined'
            fullWidth
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1, mb: 2 }}
          />
          <Button
            variant='contained'
            sx={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textTransform: 'none',
              padding: '10px 0',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
            }}
            onClick={handlePasswordReset}
          >
            Gửi email thay đổi mật khẩu
          </Button>
          <Typography
            variant='body2'
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 2,
              fontSize: '0.725rem',
              textAlign: 'center',
            }}
          >
            Bạn còn nhớ mật khẩu?{' '}
            <Link
              component='button'
              variant='body2'
              onClick={() => navigate('/')}
              sx={{
                color: 'inherit',
                textDecoration: 'underline',
                fontSize: '0.725rem',
              }}
            >
              Đăng nhập tại đây
            </Link>
          </Typography>
        </Box>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity='error'
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPassword;
