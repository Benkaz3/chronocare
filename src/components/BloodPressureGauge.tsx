// src/components/BloodPressureGauge.tsx

import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import LinearGauge from './LinearGauge';
import { bloodPressureSegments } from '../constants/bloodPressureSegments';
import {
  bloodPressureRanges,
  BloodPressureCategory,
} from '../constants/bloodPressureCategories';

interface BloodPressureGaugeProps {
  systolic: number;
  diastolic: number;
}

const BloodPressureGauge: React.FC<BloodPressureGaugeProps> = ({
  systolic,
  diastolic,
}) => {
  const [gaugeValue, setGaugeValue] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setStatusInfo] = useState<{
    status: string;
    explanation: string;
    action: string;
  } | null>(null);

  useEffect(() => {
    // Function to determine the category based on SYS and DIA
    const getCategory = (sys: number, dia: number): BloodPressureCategory => {
      // Handle invalid inputs
      if (sys <= 0 || dia <= 0) return 'Invalid';

      let sysCategory: BloodPressureCategory | null = null;
      let diaCategory: BloodPressureCategory | null = null;

      // Determine SYS category
      for (const range of bloodPressureRanges) {
        const [sysMin, sysMax] = range.systolic;
        if (sys >= sysMin && sys <= sysMax) {
          sysCategory = range.category;
          break;
        }
      }

      // Determine DIA category
      for (const range of bloodPressureRanges) {
        const [diaMin, diaMax] = range.diastolic;
        if (dia >= diaMin && dia <= diaMax) {
          diaCategory = range.category;
          break;
        }
      }

      // Default to 'Normal' if categories not found
      sysCategory = sysCategory || 'Normal';
      diaCategory = diaCategory || 'Normal';

      // Determine the more severe category
      const severityOrder: BloodPressureCategory[] = [
        'Hypotension',
        'Normal',
        'Prehypertension',
        'Stage 1 Hypertension',
        'Stage 2 Hypertension',
      ];

      const sysIndex = severityOrder.indexOf(sysCategory);
      const diaIndex = severityOrder.indexOf(diaCategory);

      // Select the category with higher index (more severe)
      const selectedCategory = sysIndex > diaIndex ? sysCategory : diaCategory;

      return selectedCategory;
    };

    // Function to map category to gauge value
    const mapCategoryToGaugeValue = (
      category: BloodPressureCategory
    ): number => {
      switch (category) {
        case 'Hypotension':
          return 10; // Midpoint of 0-20%
        case 'Normal':
          return 30; // Midpoint of 21-40%
        case 'Prehypertension':
          return 50; // Midpoint of 41-60%
        case 'Stage 1 Hypertension':
          return 70; // Midpoint of 61-80%
        case 'Stage 2 Hypertension':
          return 90; // Midpoint of 81-100%
        case 'Invalid':
          return 0; // Could represent an error state
        default:
          return 0;
      }
    };

    // Function to get status information based on category
    const getStatusInfo = (category: BloodPressureCategory) => {
      switch (category) {
        case 'Hypotension':
          return {
            status: 'Hypotension',
            explanation: 'Your blood pressure is lower than normal.',
            action: 'Consult a healthcare provider if you experience symptoms.',
          };
        case 'Normal':
          return {
            status: 'Normal',
            explanation: 'Your blood pressure is within the normal range.',
            action: 'Maintain a healthy lifestyle to keep it that way.',
          };
        case 'Prehypertension':
          return {
            status: 'Prehypertension',
            explanation: 'Your blood pressure is higher than normal.',
            action: 'Consider lifestyle changes to lower your blood pressure.',
          };
        case 'Stage 1 Hypertension':
          return {
            status: 'Stage 1 Hypertension',
            explanation: 'Your blood pressure is in Stage 1 Hypertension.',
            action: 'Consult your healthcare provider for possible treatment.',
          };
        case 'Stage 2 Hypertension':
          return {
            status: 'Stage 2 Hypertension',
            explanation: 'Your blood pressure is in Stage 2 Hypertension.',
            action: 'Seek medical attention immediately.',
          };
        case 'Invalid':
          return {
            status: 'Invalid Input',
            explanation: 'Blood pressure values must be positive numbers.',
            action: 'Please enter valid blood pressure readings.',
          };
        default:
          return null;
      }
    };

    const category = getCategory(systolic, diastolic);
    const value = mapCategoryToGaugeValue(category);
    setGaugeValue(value);
    setStatusInfo(getStatusInfo(category));
  }, [systolic, diastolic]);

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Box display='flex' flexDirection='column' gap={4}>
        {/* Linear Gauge */}
        <Box>
          <LinearGauge
            segments={bloodPressureSegments}
            currentValue={gaugeValue}
          />
        </Box>

        {/* Status Information */}
        {/* {statusInfo && (
          <Box>
            <Typography variant='h6' gutterBottom>
              {statusInfo.status}
            </Typography>
            <Typography variant='body1' gutterBottom>
              {statusInfo.explanation}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {statusInfo.action}
            </Typography>
          </Box>
        )} */}
      </Box>
    </Paper>
  );
};

export default BloodPressureGauge;
