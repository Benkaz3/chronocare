// src/components/LastReading.tsx

import React from 'react';
import { Typography, useTheme, Paper, Divider } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import Vietnamese locale

// Initialize dayjs with the relativeTime plugin and set the locale to Vietnamese
dayjs.extend(relativeTime);
dayjs.locale('vi');

interface BloodPressureReading {
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
  status: string;
}

interface BloodSugarReading {
  level: number;
  time: string;
  status: string;
}

interface LastReadingProps {
  reading: BloodPressureReading | BloodSugarReading | null;
  type: 'bloodPressure' | 'bloodSugar';
}

const LastReading: React.FC<LastReadingProps> = ({ reading, type }) => {
  const theme = useTheme();

  if (!reading) return null;

  // Use dayjs to calculate the relative time from now
  const timeAgo = dayjs(reading.time).fromNow();

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: theme.palette.action.disabledBackground,
        border: `1px solid ${theme.palette.action.hover}`,
      }}
    >
      <Typography variant='subtitle2' color='text.secondary' sx={{ mb: -1 }}>
        Chỉ số gần nhất :
      </Typography>
      <Typography
        variant='caption'
        color='text.secondary'
        sx={{ mb: 2, fontStyle: 'italic' }}
      >
        ({timeAgo})
      </Typography>
      <Divider sx={{ mt: 1, mb: 1 }} />
      {/* Display the stats */}
      {type === 'bloodPressure' ? (
        <>
          <Typography variant='body2' color='text.secondary'>
            Huyết áp:{' '}
            <strong>
              {(reading as BloodPressureReading).systolic}/
              {(reading as BloodPressureReading).diastolic}
            </strong>{' '}
            mmHg
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Nhịp tim: <strong>{(reading as BloodPressureReading).pulse}</strong>{' '}
            bpm
          </Typography>
        </>
      ) : (
        <Typography variant='body2' color='text.secondary'>
          Mức đường huyết:{' '}
          <strong>{(reading as BloodSugarReading).level}</strong> mg/dL
        </Typography>
      )}
      <Divider sx={{ mt: 1, mb: 1 }} />
      {/* Display the status */}
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ mt: 1, display: 'block' }}
      >
        Trạng thái: {reading.status}
      </Typography>
    </Paper>
  );
};

export default LastReading;
