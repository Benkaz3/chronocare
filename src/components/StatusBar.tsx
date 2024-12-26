import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface StatusBarProps {
  status:
    | 'Bình thường'
    | 'Tăng cao'
    | 'Tăng cao (Giai đoạn 1)'
    | 'Tăng cao (Giai đoạn 2)'
    | 'Tiền tiểu đường'
    | 'Tiểu đường'
    | 'Không xác định';
}

const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  const theme = useTheme();

  // Xác định màu sắc dựa trên trạng thái
  const getStatusColor = () => {
    switch (status) {
      case 'Bình thường':
        return '#4caf50';
      case 'Tăng cao':
      case 'Tiền tiểu đường':
        return '#ff9800';
      case 'Tăng cao (Giai đoạn 1)':
      case 'Tiểu đường':
        return '#ff5722';
      case 'Tăng cao (Giai đoạn 2)':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: theme.spacing(2),
        backgroundColor: getStatusColor(),
        borderRadius: 2,
        color: '#fff',
        boxShadow: 3,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Typography variant='h6' component='div'>
        {status}
      </Typography>
    </Box>
  );
};

export default StatusBar;
