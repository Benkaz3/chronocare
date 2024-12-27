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
    // Hàm xác định danh mục dựa trên SYS và DIA
    const getCategory = (sys: number, dia: number): BloodPressureCategory => {
      // Xử lý đầu vào không hợp lệ
      if (sys <= 0 || dia <= 0) return 'Invalid';

      let sysCategory: BloodPressureCategory | null = null;
      let diaCategory: BloodPressureCategory | null = null;

      // Xác định danh mục SYS
      for (const range of bloodPressureRanges) {
        const [sysMin, sysMax] = range.systolic;
        if (sys >= sysMin && sys <= sysMax) {
          sysCategory = range.category;
          break;
        }
      }

      // Xác định danh mục DIA
      for (const range of bloodPressureRanges) {
        const [diaMin, diaMax] = range.diastolic;
        if (dia >= diaMin && dia <= diaMax) {
          diaCategory = range.category;
          break;
        }
      }

      // Mặc định là 'Bình Thường' nếu không tìm thấy danh mục
      sysCategory = sysCategory || 'Normal';
      diaCategory = diaCategory || 'Normal';

      // Xác định danh mục nghiêm trọng hơn
      const severityOrder: BloodPressureCategory[] = [
        'Hypotension',
        'Normal',
        'Prehypertension',
        'Stage 1 Hypertension',
        'Stage 2 Hypertension',
      ];

      const sysIndex = severityOrder.indexOf(sysCategory);
      const diaIndex = severityOrder.indexOf(diaCategory);

      // Chọn danh mục có mức độ nghiêm trọng cao hơn
      const selectedCategory = sysIndex > diaIndex ? sysCategory : diaCategory;

      return selectedCategory;
    };

    // Hàm ánh xạ danh mục sang giá trị đồng hồ đo
    const mapCategoryToGaugeValue = (
      category: BloodPressureCategory
    ): number => {
      switch (category) {
        case 'Hypotension':
          return 10; // Điểm giữa của 0-20%
        case 'Normal':
          return 30; // Điểm giữa của 21-40%
        case 'Prehypertension':
          return 50; // Điểm giữa của 41-60%
        case 'Stage 1 Hypertension':
          return 70; // Điểm giữa của 61-80%
        case 'Stage 2 Hypertension':
          return 90; // Điểm giữa của 81-100%
        case 'Invalid':
          return 0; // Có thể đại diện cho trạng thái lỗi
        default:
          return 0;
      }
    };

    // Hàm lấy thông tin trạng thái dựa trên danh mục
    const getStatusInfo = (category: BloodPressureCategory) => {
      switch (category) {
        case 'Hypotension':
          return {
            status: 'Huyết áp thấp',
            explanation: 'Huyết áp của bạn thấp hơn mức bình thường.',
            action: 'Tham khảo ý kiến bác sĩ nếu bạn có triệu chứng.',
          };
        case 'Normal':
          return {
            status: 'Bình Thường',
            explanation: 'Huyết áp của bạn trong khoảng bình thường.',
            action: 'Duy trì lối sống lành mạnh để giữ mức này.',
          };
        case 'Prehypertension':
          return {
            status: 'Tiền Tăng Huyết Áp',
            explanation: 'Huyết áp của bạn cao hơn bình thường.',
            action: 'Xem xét thay đổi lối sống để giảm huyết áp.',
          };
        case 'Stage 1 Hypertension':
          return {
            status: 'Tăng Huyết Áp Giai Đoạn 1',
            explanation: 'Huyết áp của bạn ở mức Tăng Huyết Áp Giai Đoạn 1.',
            action: 'Tham khảo ý kiến bác sĩ để có thể điều trị.',
          };
        case 'Stage 2 Hypertension':
          return {
            status: 'Tăng Huyết Áp Giai Đoạn 2',
            explanation: 'Huyết áp của bạn ở mức Tăng Huyết Áp Giai Đoạn 2.',
            action: 'Hãy tìm kiếm sự chăm sóc y tế ngay lập tức.',
          };
        case 'Invalid':
          return {
            status: 'Dữ liệu không hợp lệ',
            explanation: 'Giá trị huyết áp phải là số dương.',
            action: 'Vui lòng nhập giá trị huyết áp hợp lệ.',
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
        {/* Đồng Hồ Đo Tuyến Tính */}
        <Box>
          <LinearGauge
            segments={bloodPressureSegments}
            currentValue={gaugeValue}
          />
        </Box>

        {/* Thông Tin Trạng Thái */}
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
