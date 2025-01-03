import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import LinearGauge from './LinearGauge';
import {
  bloodSugarSegments,
  getBloodSugarCategory,
  mapBloodSugarCategoryToGaugeValue,
  getBloodSugarStatusInfo,
  getBloodSugarAlertSeverity,
  BloodSugarStatusInfo,
} from '../data/bloodSugar';

interface BloodSugarGaugeProps {
  level: string; // Changed from number to string
}

const BloodSugarGauge: React.FC<BloodSugarGaugeProps> = ({ level }) => {
  const [gaugeValue, setGaugeValue] = useState<number | null>(null);
  const [statusInfo, setStatusInfo] = useState<BloodSugarStatusInfo | null>(
    null
  );

  useEffect(() => {
    const levelValue = parseFloat(level);

    if (!isNaN(levelValue)) {
      const category = getBloodSugarCategory(levelValue);
      const value = mapBloodSugarCategoryToGaugeValue(category);
      setGaugeValue(value);
      setStatusInfo(getBloodSugarStatusInfo(category));
    } else {
      // Input is empty or invalid
      setGaugeValue(null);
      setStatusInfo(null);
    }
  }, [level]);

  return (
    <Box display='flex' flexDirection='column' gap={1}>
      {/* Linear Gauge */}
      <Box>
        <LinearGauge
          segments={bloodSugarSegments}
          currentValue={gaugeValue}
          isBlurred={gaugeValue === null} // Blur gauge when no valid input
        />
      </Box>

      {/* Status Information */}
      {statusInfo ? (
        <Box sx={{ minHeight: '150px', mt: 0 }}>
          <Alert severity={getBloodSugarAlertSeverity(statusInfo.status)}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{ color: statusInfo.color || 'inherit' }}
            >
              {statusInfo.status}
            </Typography>
            <Typography variant='body2' gutterBottom>
              {statusInfo.explanation}
            </Typography>
            <Typography variant='body2'>{statusInfo.action}</Typography>
          </Alert>
        </Box>
      ) : (
        <Typography
          variant='body2'
          color='textSecondary'
          fontStyle='italic'
          textAlign='center'
          sx={{ minHeight: '150px', mt: 0 }}
        >
          Vui lòng nhập chỉ số để xem trạng thái
        </Typography>
      )}
    </Box>
  );
};

export default BloodSugarGauge;
