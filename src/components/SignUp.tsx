import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  TwitterAuthProvider,
} from 'firebase/auth';
import { auth } from '../firebase';
import GoogleLogo from '../assets/google-logo.svg';
import TwitterLogo from '../assets/twitter-logo.svg';

const theme = createTheme();

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in: ', error);
      setError('Failed to sign in with Google.');
    }
  };

  const signInWithTwitter = async () => {
    const provider = new TwitterAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in: ', error);
      setError('Failed to sign in with Twitter.');
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateInputs = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    setError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail(''); // Clear email field
      setPassword(''); // Clear password field
      setSuccess(true); // Show success message
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering: ', error);
      setError('Failed to register. Please try again.');
    }
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
          position: 'relative',
          padding: 2,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
            overflow: 'hidden',
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              mb: 3,
            }}
          >
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
              onClick={signInWithGoogle}
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
              onClick={signInWithTwitter}
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
            Bạn chưa có tài khoản? Đăng ký
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
