// src/components/BloodPressureChart.tsx

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
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

const BloodPressureChart: React.FC = () => {
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

  // Prepare data for the chart: filter by time range and use recordedAt
  const data = useMemo(() => {
    const now = dayjs();
    // Ensure chronological order (oldest first)
    let filteredReadings = readings.bloodPressure.slice().reverse();

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
      systolic: reading.systolic, // **Updated Here**
      diastolic: reading.diastolic, // **Updated Here**
    }));
  }, [readings.bloodPressure, timeRange]);

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Huyết Áp
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
        <Typography>Không có dữ liệu huyết áp để hiển thị.</Typography>
      ) : (
        <ResponsiveContainer width='100%' height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              label={{ value: 'Ngày', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              domain={[50, 200]}
              label={{ value: 'mmHg', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend verticalAlign='top' height={36} />
            <Line
              type='monotone'
              dataKey='systolic'
              stroke='#8884d8'
              name='HA Tâm Thu'
              activeDot={{ r: 8 }}
            />
            <Line
              type='monotone'
              dataKey='diastolic'
              stroke='#82ca9d'
              name='HA Tâm Trương'
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default BloodPressureChart;
