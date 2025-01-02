// src/components/BloodPressureGauge.tsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import LinearGauge from './LinearGauge';
import {
  bloodPressureSegments,
  getBloodPressureCategory,
  mapBloodPressureCategoryToGaugeValue,
  getBloodPressureStatusInfo,
  getBloodPressureAlertSeverity,
  StatusInfo,
} from '../data/bloodPressure';

interface BloodPressureGaugeProps {
  systolic: number;
  diastolic: number;
}

const BloodPressureGauge: React.FC<BloodPressureGaugeProps> = ({
  systolic,
  diastolic,
}) => {
  const [gaugeValue, setGaugeValue] = useState<number>(0);
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);

  useEffect(() => {
    const category = getBloodPressureCategory(systolic, diastolic);
    const value = mapBloodPressureCategoryToGaugeValue(category);
    setGaugeValue(value);
    setStatusInfo(getBloodPressureStatusInfo(category));
  }, [systolic, diastolic]);

  return (
    <Box>
      <Box display='flex' flexDirection='column' gap={1}>
        <Box>
          <LinearGauge
            segments={bloodPressureSegments}
            currentValue={gaugeValue}
          />
        </Box>

        {/* Thông Tin Trạng Thái */}
        {statusInfo && (
          <Box sx={{ minHeight: '150px', mt: 0 }}>
            <Alert severity={getBloodPressureAlertSeverity(statusInfo.status)}>
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
              <Typography variant='body2'>{statusInfo.action}</Typography>
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BloodPressureGauge;
