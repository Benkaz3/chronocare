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
            padding: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant='h4'
            sx={{ color: 'white', fontWeight: 700, mb: 2 }}
          >
            Create an account
          </Typography>
          <Typography
            variant='body1'
            sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}
          >
            Sign up with
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}
          >
            <Button
              variant='contained'
              sx={{
                width: '45%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
              }}
              onClick={signInWithGoogle}
            >
              <img
                src={GoogleLogo}
                alt='Google'
                style={{ width: 20, marginRight: 8 }}
              />
              Google
            </Button>
            <Button
              variant='contained'
              sx={{
                width: '45%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
              }}
              onClick={signInWithTwitter}
            >
              <img
                src={TwitterLogo}
                alt='Facebook'
                style={{ width: 20, marginRight: 8 }}
              />
              Twitter
            </Button>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              margin='normal'
              variant='standard'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{ style: { color: 'white' } }}
              sx={{
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover .MuiInput-underline:before': {
                  borderBottomColor: 'white',
                },
                '&.Mui-focused .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              }}
            />
            <TextField
              fullWidth
              margin='normal'
              variant='standard'
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: 'white' },
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handlePasswordVisibility}
                      sx={{
                        color: showPassword
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover .MuiInput-underline:before': {
                  borderBottomColor: 'white',
                },
                '&.Mui-focused .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              }}
            />
          </Box>
          {error && (
            <Typography variant='body2' sx={{ color: 'red', mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant='contained'
            color='primary'
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#1a73e8',
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#1669c1' },
            }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
