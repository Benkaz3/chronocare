// src/components/BloodSugarGauge.tsx

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
  level: number;
}

const BloodSugarGauge: React.FC<BloodSugarGaugeProps> = ({ level }) => {
  const [gaugeValue, setGaugeValue] = useState<number>(0);
  const [statusInfo, setStatusInfo] = useState<BloodSugarStatusInfo | null>(
    null
  );

  useEffect(() => {
    const category = getBloodSugarCategory(level);
    const value = mapBloodSugarCategoryToGaugeValue(category);
    setGaugeValue(value);
    setStatusInfo(getBloodSugarStatusInfo(category));
  }, [level]);

  return (
    <Box display='flex' flexDirection='column' gap={1}>
      {/* Linear Gauge */}
      <Box>
        <LinearGauge segments={bloodSugarSegments} currentValue={gaugeValue} />
      </Box>

      {/* Status Information */}
      {statusInfo && (
        <Box sx={{ minHeight: '150px', mt: 0 }}>
          <Alert severity={getBloodSugarAlertSeverity(statusInfo.status)}>
            <Typography
              variant='h6'
              gutterBottom
              sx={{ color: statusInfo.color || 'inherit' }} // Dynamically apply color if available
            >
              {statusInfo.status}
            </Typography>
            <Typography variant='body2' gutterBottom>
              {statusInfo.explanation}
            </Typography>
            <Typography variant='body2'>
              <strong>Khuyến cáo:</strong> {statusInfo.action}
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default BloodSugarGauge;
