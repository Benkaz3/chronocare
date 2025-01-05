// src/components/HistoryTable/BloodSugarRow.tsx

import React from 'react';
import { TableCell, Typography } from '@mui/material';
import StatusCircle from './StatusCircle';
import { ProcessedBS } from '../../types';

interface BloodSugarRowProps {
  row: ProcessedBS;
  formatDateTime: (recordedAt: Date | null) => { date: string; time: string };
}

const BloodSugarRow: React.FC<BloodSugarRowProps> = ({
  row,
  formatDateTime,
}) => {
  const { date, time } = formatDateTime(row.recordedAt);

  return (
    <>
      <TableCell align='center'>
        <StatusCircle bgcolor={row.color}>
          <Typography variant='subtitle2'>{row.level}</Typography>
        </StatusCircle>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle1' color='textPrimary'>
          {row.status}
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          {date} {time}
        </Typography>
      </TableCell>
    </>
  );
};

export default React.memo(BloodSugarRow);
