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
    // Xác định loại đường huyết dựa trên mức độ
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

    // Ánh xạ loại sang giá trị trên thước đo
    const mapCategoryToGaugeValue = (category: BloodSugarCategory): number => {
      switch (category) {
        case 'Hypoglycemia':
          return 10; // Điểm giữa của 0-20%
        case 'Normal':
          return 30; // Điểm giữa của 21-40%
        case 'Elevated':
          return 50; // Điểm giữa của 41-60%
        case 'Prediabetes':
          return 70; // Điểm giữa của 61-80%
        case 'Diabetes':
          return 90; // Điểm giữa của 81-100%
        case 'Invalid':
        default:
          return 0; // Đại diện cho trạng thái lỗi
      }
    };

    // Lấy thông tin trạng thái dựa trên loại
    const getStatusInfo = (category: BloodSugarCategory): StatusInfo => {
      switch (category) {
        case 'Hypoglycemia':
          return {
            status: 'Hạ đường huyết',
            explanation: 'Chỉ số đường huyết của bạn thấp hơn mức bình thường.',
            action:
              'Hãy ăn hoặc uống thực phẩm có chứa carbohydrate nhanh và tham khảo ý kiến bác sĩ.',
          };
        case 'Normal':
          return {
            status: 'Bình thường',
            explanation:
              'Chỉ số đường huyết của bạn đang nằm trong mức bình thường.',
            action:
              'Hãy duy trì chế độ ăn uống cân bằng và tập thể dục đều đặn.',
          };
        case 'Elevated':
          return {
            status: 'Tăng đường huyết',
            explanation: 'Chỉ số đường huyết của bạn cao hơn mức bình thường.',
            action: 'Theo dõi chế độ ăn uống và tăng cường hoạt động thể chất.',
          };
        case 'Prediabetes':
          return {
            status: 'Tiền tiểu đường',
            explanation:
              'Chỉ số đường huyết của bạn cho thấy nguy cơ tiền tiểu đường.',
            action:
              'Áp dụng lối sống lành mạnh và tham khảo ý kiến bác sĩ để kiểm soát tốt hơn.',
          };
        case 'Diabetes':
          return {
            status: 'Tiểu đường',
            explanation:
              'Chỉ số đường huyết của bạn cho thấy bạn bị tiểu đường.',
            action:
              'Hãy tìm kiếm sự tư vấn và điều trị y tế từ bác sĩ để quản lý tình trạng này.',
          };
        case 'Invalid':
        default:
          return {
            status: 'Không hợp lệ',
            explanation: 'Chỉ số đường huyết bạn nhập không hợp lệ.',
            action: 'Vui lòng nhập một chỉ số đường huyết hợp lệ.',
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
        {/* Thước đo tuyến tính */}
        <Box>
          <LinearGauge
            segments={bloodSugarSegments}
            currentValue={gaugeValue}
          />
        </Box>

        {/* Thông tin trạng thái */}
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
