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
  Link,
  TextField,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import GoogleLogo from '../assets/google-logo.svg';
import TwitterLogo from '../assets/twitter-logo.svg';

const theme = createTheme();

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleAuthProviderSignIn = async (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ) => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      console.error(`Error signing in with ${providerName}: `, err);
      setError(`Failed to sign in with ${providerName}.`);
    }
  };

  const handleEmailPasswordSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error signing in with email and password: ', err);
      setError('Failed to sign in with email and password.');
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
            ChronoCare
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
            Đăng nhập để ghi lại chỉ số huyết áp và đường huyết.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              variant='outlined'
              fullWidth
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
            <TextField
              variant='outlined'
              fullWidth
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
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
              onClick={handleEmailPasswordSignIn}
            >
              Đăng nhập với Email
            </Button>
            <Link
              component='button'
              variant='body2'
              onClick={() => navigate('/quen-mat-khau')}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'underline',
                fontSize: '0.725rem',
                textAlign: 'left',
                mb: 4,
              }}
            >
              Quên mật khẩu?
            </Link>
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
              onClick={() =>
                handleAuthProviderSignIn(new GoogleAuthProvider(), 'Google')
              }
            >
              <img
                src={GoogleLogo}
                alt='Google logo'
                style={{ width: 20, marginRight: 8 }}
              />
              Đăng nhập với Google
            </Button>
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
              onClick={() =>
                handleAuthProviderSignIn(new TwitterAuthProvider(), 'Twitter')
              }
            >
              <img
                src={TwitterLogo}
                alt='Twitter logo'
                style={{ width: 20, marginRight: 8 }}
              />
              Đăng nhập với Twitter
            </Button>
          </Box>
          <Typography
            variant='body2'
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 1,
              mb: 1,
              fontSize: '0.725rem',
              textAlign: 'left',
            }}
          >
            Bạn chưa có tài khoản?{' '}
            <Link
              component='button'
              variant='body2'
              onClick={() => navigate('/dang-ky')}
              sx={{
                color: 'inherit',
                textDecoration: 'underline',
                fontSize: '0.725rem',
              }}
            >
              Đăng ký
            </Link>
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 2,
              fontSize: '0.725rem',
              textAlign: 'left',
            }}
          >
            Khi đăng ký và đăng nhập, bạn tự động đồng ý với{' '}
            <Link
              href='/terms-and-conditions'
              sx={{
                color: 'inherit',
                textDecoration: 'underline',
                fontSize: '0.725rem',
              }}
            >
              điều khoản sử dụng dịch vụ của chúng tôi.
            </Link>
            .
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

export default SignIn;
