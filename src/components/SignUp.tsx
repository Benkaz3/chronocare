import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  TextField,
  Alert,
  Link,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import GoogleLogo from '../assets/google-logo.svg';
import TwitterLogo from '../assets/twitter-logo.svg';

const theme = createTheme();

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: React.ReactNode;
  } | null>(null);

  const handleAuthProviderSignIn = async (
    provider: GoogleAuthProvider | TwitterAuthProvider,
    providerName: string
  ) => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      console.error(`Error signing in with ${providerName}: `, err);
      setMessage({
        type: 'error',
        text: `Không thể đăng nhập với ${providerName}. Vui lòng thử lại sau.`,
      });
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Vui lòng nhập email và mật khẩu.' });
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage({
        type: 'success',
        text: 'Đăng ký thành công! Chuyển hướng đến bảng điều khiển.',
      });
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000); // Delay navigation by 3 seconds
    } catch (err: any) {
      console.error('Error signing up: ', err);
      if (err.code === 'auth/email-already-in-use') {
        setMessage({
          type: 'error',
          text: (
            <>
              Email đã được sử dụng. Vui lòng{' '}
              <Link
                component='button'
                variant='body2'
                onClick={() => navigate('/')}
                sx={{ color: 'inherit', textDecoration: 'underline' }}
              >
                đăng nhập
              </Link>
              .
            </>
          ),
        });
      } else if (err.code === 'auth/invalid-email') {
        setMessage({ type: 'error', text: 'Email không hợp lệ.' });
      } else if (err.code === 'auth/weak-password') {
        setMessage({
          type: 'error',
          text: 'Mật khẩu quá yếu. Xin hãy chọn mật khẩu mạnh hơn.',
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Đăng ký thất bại. Vui lòng thử lại.',
        });
      }
    }
  };

  const handleCloseMessage = () => {
    setMessage(null);
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
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: {
                color: 'white',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #1e1e1e inset',
                  WebkitTextFillColor: 'white',
                },
              },
              label: {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: 'white' },
              },
            }}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Mật khẩu'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: {
                color: 'white',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #1e1e1e inset',
                  WebkitTextFillColor: 'white',
                },
              },
              label: {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: 'white' },
              },
            }}
          />
          <Button
            variant='contained'
            fullWidth
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textTransform: 'none',
              padding: '10px 0',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
            }}
            onClick={handleEmailSignUp}
          >
            Đăng ký
          </Button>
          {message && (
            <Alert
              severity={message.type}
              sx={{ mt: 2, mb: 2, width: '100%' }}
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={handleCloseMessage}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              {message.text}
            </Alert>
          )}
          <Typography
            variant='body2'
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Hoặc tiếp tục với
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
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
              Tiếp tục với Google
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
              Tiếp tục với Twitter
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
