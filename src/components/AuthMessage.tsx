// src/components/AuthMessage.tsx

import React from 'react';
import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AuthMessageProps {
  message: { type: 'success' | 'error'; text: React.ReactNode };
  onClose: () => void;
}

const AuthMessage: React.FC<AuthMessageProps> = ({ message, onClose }) => (
  <Alert
    severity={message.type}
    sx={{ mt: 2, mb: 2, width: '100%' }}
    action={
      <IconButton
        aria-label='close'
        color='inherit'
        size='small'
        onClick={onClose}
      >
        <CloseIcon fontSize='inherit' />
      </IconButton>
    }
  >
    {message.text}
  </Alert>
);

export default AuthMessage;
