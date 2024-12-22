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
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/useAuth';
import GoogleLogo from '../assets/google-logo.svg';
import FacebookLogo from '../assets/facebook-logo.svg';

const theme = createTheme();

const GoogleSignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
            >
              <img
                src={FacebookLogo}
                alt='Facebook'
                style={{ width: 20, marginRight: 8 }}
              />
              Facebook
            </Button>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              margin='normal'
              variant='standard'
              placeholder='Username'
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
              placeholder='Email'
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
          >
            Register
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default GoogleSignIn;
