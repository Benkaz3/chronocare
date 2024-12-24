// src/components/AuthForm.tsx

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  IconButton,
  Link,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface AuthFormProps {
  tab: number; // 0 for Log In, 1 for Sign Up
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirm: string) => void;
  onSubmit: () => void;
  message: { type: 'success' | 'error'; text: React.ReactNode } | null;
  onCloseMessage: () => void;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  tab,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  message,
  onCloseMessage,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
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
              WebkitBoxShadow: `0 0 0 100px #1e1e1e inset`,
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
        label='Password'
        type={showPassword ? 'text' : 'password'}
        id='password'
        autoComplete='current-password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          input: {
            color: 'white',
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px #1e1e1e inset`,
              WebkitTextFillColor: 'white',
            },
          },
          label: {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': { color: 'white' },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {tab === 1 && (
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='confirmPassword'
          label='Confirm Password'
          type='password'
          id='confirmPassword'
          autoComplete='new-password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            input: {
              color: 'white',
              '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 100px #1e1e1e inset`,
                WebkitTextFillColor: 'white',
              },
            },
            label: {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': { color: 'white' },
            },
          }}
        />
      )}
      <Button
        variant='contained'
        fullWidth
        disabled={loading}
        onClick={onSubmit}
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          textTransform: 'none',
          padding: '10px 0',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : tab === 0 ? (
          'Log In'
        ) : (
          'Sign Up'
        )}
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
              onClick={onCloseMessage}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        >
          {message.text}
        </Alert>
      )}
      <Link
        component='button'
        variant='body2'
        onClick={() => {}}
        sx={{
          color: 'inherit',
          textDecoration: 'underline',
          fontSize: '0.725rem',
          mt: 1,
        }}
      >
        Forgot Password?
      </Link>
    </>
  );
};

export default AuthForm;
