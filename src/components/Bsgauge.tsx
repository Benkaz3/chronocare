// src/components/BloodSugarGauge.tsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import LinearGauge from './LinearGauge';
import { bloodSugarSegments } from '../constants/bloodSugarSegments';
import {
  bloodSugarRanges,
  BloodSugarCategory,
} from '../constants/bloodSugarCategories';

interface BsgaugeProps {
  level: number;
}

interface StatusInfo {
  status: string;
  explanation: string;
  action: string;
  color: string;
}

const Bsgauge: React.FC<BsgaugeProps> = ({ level }) => {
  const [gaugeValue, setGaugeValue] = useState<number>(0);
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);

  useEffect(() => {
    // Determine the blood sugar category based on the level
    const getCategory = (bsLevel: number): BloodSugarCategory => {
      if (bsLevel <= 0) return 'Invalid';

      for (const range of bloodSugarRanges) {
        const [min, max] = range.range;
        if (bsLevel >= min && bsLevel <= max) {
          return range.category;
        }
      }

      return 'Invalid';
    };

    // Map category to gauge value (0-100 scale)
    const mapCategoryToGaugeValue = (category: BloodSugarCategory): number => {
      switch (category) {
        case 'Hypoglycemia':
          return 10; // Midpoint of 0-20%
        case 'Normal':
          return 30; // Midpoint of 21-40%
        case 'Elevated':
          return 50; // Midpoint of 41-60%
        case 'Prediabetes':
          return 70; // Midpoint of 61-80%
        case 'Diabetes':
          return 90; // Midpoint of 81-100%
        case 'Invalid':
        default:
          return 0; // Represents an invalid state
      }
    };

    // Retrieve status information based on the category
    const getStatusInfo = (category: BloodSugarCategory): StatusInfo => {
      switch (category) {
        case 'Hypoglycemia':
          return {
            status: 'Hạ đường huyết',
            explanation: 'Chỉ số đường huyết của bạn thấp hơn mức bình thường.',
            action:
              'Hãy ăn hoặc uống thực phẩm có chứa carbohydrate nhanh và tham khảo ý kiến bác sĩ.',
            color: '#2196f3', // Blue
          };
        case 'Normal':
          return {
            status: 'Bình thường',
            explanation:
              'Chỉ số đường huyết của bạn đang nằm trong mức bình thường.',
            action:
              'Hãy duy trì chế độ ăn uống cân bằng và tập thể dục đều đặn.',
            color: '#4caf50', // Green
          };
        case 'Elevated':
          return {
            status: 'Tăng đường huyết',
            explanation: 'Chỉ số đường huyết của bạn cao hơn mức bình thường.',
            action: 'Theo dõi chế độ ăn uống và tăng cường hoạt động thể chất.',
            color: '#ffeb3b', // Yellow
          };
        case 'Prediabetes':
          return {
            status: 'Tiền tiểu đường',
            explanation:
              'Chỉ số đường huyết của bạn cho thấy nguy cơ tiền tiểu đường.',
            action:
              'Áp dụng lối sống lành mạnh và tham khảo ý kiến bác sĩ để kiểm soát tốt hơn.',
            color: '#ff9800', // Orange
          };
        case 'Diabetes':
          return {
            status: 'Tiểu đường',
            explanation:
              'Chỉ số đường huyết của bạn cho thấy bạn bị tiểu đường.',
            action:
              'Hãy tìm kiếm sự tư vấn và điều trị y tế từ bác sĩ để quản lý tình trạng này.',
            color: '#f44336', // Red
          };
        case 'Invalid':
        default:
          return {
            status: 'Không hợp lệ',
            explanation: 'Chỉ số đường huyết bạn nhập không hợp lệ.',
            action: 'Vui lòng nhập một chỉ số đường huyết hợp lệ.',
            color: '', // No color
          };
      }
    };

    // Determine the severity level for the Alert component

    const category = getCategory(level);
    const value = mapCategoryToGaugeValue(category);
    setGaugeValue(value);
    setStatusInfo(getStatusInfo(category));
  }, [level]);

  const getAlertSeverity = (
    status: string
  ): 'success' | 'info' | 'warning' | 'error' => {
    switch (status) {
      case 'Bình thường':
        return 'success';
      case 'Tăng đường huyết':
      case 'Tiền tiểu đường':
        return 'warning';
      case 'Tiểu đường':
        return 'error';
      case 'Hạ đường huyết':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Box display='flex' flexDirection='column' gap={1}>
      {/* Linear Gauge */}
      <Box>
        <LinearGauge segments={bloodSugarSegments} currentValue={gaugeValue} />
      </Box>

      {/* Status Information */}
      {statusInfo && (
        <Box sx={{ minHeight: '150px', mt: 0 }}>
          <Alert severity={getAlertSeverity(statusInfo.status)}>
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

export default Bsgauge;
