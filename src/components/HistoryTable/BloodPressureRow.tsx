// src/components/HistoryTable/BloodPressureRow.tsx

import React from 'react';
import { TableCell, Typography, Box } from '@mui/material';
import StatusCircle from './StatusCircle';
import { ProcessedBP } from '../../types';

interface BloodPressureRowProps {
  row: ProcessedBP;
  formatDateTime: (recordedAt: Date | null) => { date: string; time: string };
}

const BloodPressureRow: React.FC<BloodPressureRowProps> = ({
  row,
  formatDateTime,
}) => {
  const { date, time } = formatDateTime(row.recordedAt);

  return (
    <>
      <TableCell align='center'>
        <StatusCircle bgcolor={row.color}>
          <Typography variant='subtitle2'>{row.systolic}</Typography>
          <Box
            sx={{
              width: '80%',
              height: '1px',
              backgroundColor: '#fff',
              marginY: '2px',
            }}
          />
          <Typography variant='subtitle2'>{row.diastolic}</Typography>
        </StatusCircle>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle1' color='textPrimary'>
          {row.status}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {date} {time}
          {row.pulse !== null && ` | ${row.pulse} bpm`}
        </Typography>
      </TableCell>
    </>
  );
};

export default React.memo(BloodPressureRow);
