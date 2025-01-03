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
  systolic: string;
  diastolic: string;
}
const BloodPressureGauge: React.FC<BloodPressureGaugeProps> = ({
  systolic,
  diastolic,
}) => {
  const [gaugeValue, setGaugeValue] = useState<number | null>(null);
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);

  useEffect(() => {
    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);

    if (!isNaN(systolicValue) && !isNaN(diastolicValue)) {
      const category = getBloodPressureCategory(systolicValue, diastolicValue);
      const value = mapBloodPressureCategoryToGaugeValue(category);
      setGaugeValue(value);
      setStatusInfo(getBloodPressureStatusInfo(category));
    } else {
      // Inputs are empty or invalid
      setGaugeValue(null); // Indicate no value
      setStatusInfo(null); // Clear status info
    }
  }, [systolic, diastolic]);

  return (
    <Box>
      <Box display='flex' flexDirection='column' gap={1}>
        {/* Linear Gauge */}
        <Box>
          <LinearGauge
            segments={bloodPressureSegments}
            currentValue={gaugeValue}
            isBlurred={gaugeValue === null} // Blur gauge when no valid input
          />
        </Box>

        {statusInfo ? (
          <Box sx={{ minHeight: '150px', mt: 0 }}>
            <Alert severity={getBloodPressureAlertSeverity(statusInfo.status)}>
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
    </Box>
  );
};

export default BloodPressureGauge;
