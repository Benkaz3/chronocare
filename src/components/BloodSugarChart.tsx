// src/components/BloodSugarChart.tsx

import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import useUserData from '../hooks/useUserData';
import dayjs from 'dayjs';

const BloodSugarChart: React.FC = () => {
  const { readings } = useUserData();
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('7');

  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRange: '7' | '30' | '90' | 'all' | null
  ) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ: lọc theo khoảng thời gian và sử dụng recordedAt
  const data = useMemo(() => {
    const now = dayjs();
    let filteredReadings = readings.bloodSugar.slice().reverse(); // Đảm bảo thứ tự theo thời gian

    if (timeRange !== 'all') {
      const days = parseInt(timeRange, 10);
      const cutoffDate = now.subtract(days, 'day');
      filteredReadings = filteredReadings.filter((reading) =>
        reading.recordedAt
          ? dayjs(reading.recordedAt).isAfter(cutoffDate)
          : false
      );
    }

    return filteredReadings.map((reading) => ({
      date: reading.recordedAt
        ? dayjs(reading.recordedAt).format('DD/MM/YYYY')
        : 'Unknown',
      level: reading.level,
    }));
  }, [readings.bloodSugar, timeRange]);

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Đường Huyết
      </Typography>
      <Box mb={2}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label='khoảng thời gian hiển thị'
        >
          <ToggleButton value='7' aria-label='7 ngày'>
            7 Ngày
          </ToggleButton>
          <ToggleButton value='30' aria-label='30 ngày'>
            30 Ngày
          </ToggleButton>
          <ToggleButton value='90' aria-label='90 ngày'>
            90 Ngày
          </ToggleButton>
          <ToggleButton value='all' aria-label='tất cả'>
            Tất Cả
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {data.length === 0 ? (
        <Typography>Không có dữ liệu đường huyết để hiển thị.</Typography>
      ) : (
        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              label={{ value: 'Ngày', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              domain={[50, 500]}
              label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend verticalAlign='top' height={36} />
            <Bar
              dataKey='level'
              fill='#8884d8'
              name='Mức Đường Huyết (mg/dL)'
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default BloodSugarChart;
