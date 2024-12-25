import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface AuthFormProps {
  tab: number; // 0 for Log In, 1 for Sign Up
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
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
  onSubmit,
  message,
  onCloseMessage,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Reference to the alert for focus management
  const alertRef = useRef<HTMLDivElement>(null);

  // Shift focus to the alert when a message appears
  useEffect(() => {
    if (message && alertRef.current) {
      alertRef.current.focus();
    }
  }, [message]);

  // Define password rules
  const passwordRules = [
    {
      label: 'Ít nhất 8 ký tự',
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: 'Ít nhất 1 ký tự viết hoa',
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: 'Ít nhất 1 ký tự viết thường',
      test: (pw: string) => /[a-z]/.test(pw),
    },
    {
      label: 'Ít nhất 1 số',
      test: (pw: string) => /[0-9]/.test(pw),
    },
    {
      label: 'Ít nhất 1 ký tự đặc biệt (!@#$%^&*)',
      test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id='email'
        label='Email'
        name='email'
        type='email'
        autoComplete='email'
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label='Địa chỉ email'
      />
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        name='password'
        label='Mật khẩu'
        type={showPassword ? 'text' : 'password'}
        id='password'
        autoComplete='current-password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label='Mật khẩu'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShowPassword(!showPassword)}
                edge='end'
                sx={{
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {tab === 1 && (
        <Box sx={{ mt: 1, mb: 1 }}>
          <Typography
            variant='caption'
            sx={{ mb: 0.5, display: 'block', textAlign: 'left' }}
          >
            Mật khẩu phải bao gồm:
          </Typography>
          <List dense sx={{ pl: 0 }}>
            {passwordRules.map((rule, index) => {
              const isValid = rule.test(password);
              return (
                <ListItem key={index} disableGutters sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    {isValid ? (
                      <CheckCircleIcon
                        color='success'
                        fontSize='small'
                        aria-hidden='true'
                        sx={{ fontSize: 12 }}
                      />
                    ) : (
                      <CancelIcon
                        color='error'
                        fontSize='small'
                        aria-hidden='true'
                        sx={{ fontSize: 12 }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant='caption'
                        color={isValid ? 'success.main' : 'error.main'}
                      >
                        {rule.label}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={
          loading ||
          (tab === 1 && passwordRules.some((rule) => !rule.test(password)))
        }
        aria-label={tab === 0 ? 'Log In' : 'Sign Up'}
      >
        {loading ? (
          <CircularProgress size={24} color='inherit' />
        ) : tab === 0 ? (
          'Đăng Nhập'
        ) : (
          'Đăng Ký'
        )}
      </Button>
      {message && (
        <Alert
          severity={message.type}
          sx={{ mt: 2, mb: 2 }}
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={onCloseMessage}
              sx={{
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor:
                    message.type === 'error' ? 'error.main' : 'success.main',
                  outlineOffset: '2px',
                },
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          role='alert'
          tabIndex={-1}
          ref={message.type === 'error' ? alertRef : null}
        >
          {message.text}
        </Alert>
      )}
    </form>
  );
};

export default AuthForm;
