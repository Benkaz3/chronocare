import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

interface StatusDisplayProps {
  status: {
    label: string;
    color: string;
  };
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 2,
      padding: 2,
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography variant='h6' gutterBottom>
      Tình trạng hiện tại
    </Typography>
    <Chip
      label={status.label}
      sx={{
        backgroundColor: status.color,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        padding: '0 1rem',
      }}
    />
  </Box>
);

export default StatusDisplay;
