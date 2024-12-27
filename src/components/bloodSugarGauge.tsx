// src/components/BloodSugarGauge.tsx

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LinearGauge from './LinearGauge';
import { bloodSugarSegments } from '../constants/bloodSugarSegments';
import {
  bloodSugarRanges,
  BloodSugarCategory,
} from '../constants/bloodSugarCategories';

interface BloodSugarGaugeProps {
  level: number;
}

interface StatusInfo {
  status: string;
  explanation: string;
  action: string;
}

const BloodSugarGauge: React.FC<BloodSugarGaugeProps> = ({ level }) => {
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

    // Map the category to a gauge value
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
          return 0; // Represents an error state
      }
    };

    // Get status information based on the category
    const getStatusInfo = (category: BloodSugarCategory): StatusInfo => {
      switch (category) {
        case 'Hypoglycemia':
          return {
            status: 'Hạ Đường Huyết',
            explanation: 'Chỉ số đường huyết của bạn thấp hơn mức bình thường.',
            action:
              'Tiêu thụ carbohydrate nhanh và tham khảo ý kiến nhà cung cấp dịch vụ y tế.',
          };
        case 'Normal':
          return {
            status: 'Bình Thường',
            explanation:
              'Chỉ số đường huyết của bạn nằm trong mức bình thường.',
            action: 'Duy trì chế độ ăn uống cân bằng và tập thể dục đều đặn.',
          };
        case 'Elevated':
          return {
            status: 'Tăng Đường Huyết',
            explanation: 'Chỉ số đường huyết của bạn cao hơn mức bình thường.',
            action: 'Theo dõi chế độ ăn uống và hoạt động thể chất.',
          };
        case 'Prediabetes':
          return {
            status: 'Tiền Tiểu Đường',
            explanation: 'Chỉ số đường huyết của bạn cho thấy tiền tiểu đường.',
            action:
              'Áp dụng lối sống lành mạnh và tham khảo ý kiến nhà cung cấp dịch vụ y tế.',
          };
        case 'Diabetes':
          return {
            status: 'Tiểu Đường',
            explanation: 'Chỉ số đường huyết của bạn cho thấy tiểu đường.',
            action:
              'Tìm kiếm sự chăm sóc y tế và tuân thủ hướng dẫn của nhà cung cấp dịch vụ y tế.',
          };
        case 'Invalid':
        default:
          return {
            status: 'Không Xác Định',
            explanation: 'Chỉ số đường huyết không hợp lệ.',
            action: 'Vui lòng nhập chỉ số đường huyết hợp lệ.',
          };
      }
    };

    const category = getCategory(level);
    const value = mapCategoryToGaugeValue(category);
    setGaugeValue(value);
    setStatusInfo(getStatusInfo(category));
  }, [level]);

  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Box display='flex' flexDirection='column' gap={4}>
        {/* Linear Gauge */}
        <Box>
          <LinearGauge
            segments={bloodSugarSegments}
            currentValue={gaugeValue}
          />
        </Box>

        {/* Status Information */}
        {statusInfo && (
          <Box>
            <Typography variant='h6' gutterBottom>
              {statusInfo.status}
            </Typography>
            <Typography variant='body1' gutterBottom>
              {statusInfo.explanation}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              Khuyến cáo: {statusInfo.action}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BloodSugarGauge;
