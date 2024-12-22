import React from 'react';
import { Box, Typography } from '@mui/material';
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

interface TrendChartProps {
  chartData: {
    time: string[];
    systolic: number[];
    diastolic: number[];
    pulse: number[];
  };
}

const TrendChart: React.FC<TrendChartProps> = ({ chartData }) => {
  const combinedData = chartData.time.map((time, index) => ({
    time,
    systolic: chartData.systolic[index],
    diastolic: chartData.diastolic[index],
    pulse: chartData.pulse[index],
  }));

  return (
    <Box sx={{ width: '100%', marginTop: 4 }}>
      <Typography variant='h6' gutterBottom>
        Xu hướng huyết áp
      </Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='systolic'
            stroke='#42a5f5'
            name='Tâm thu (Systolic)'
          />
          <Line
            type='monotone'
            dataKey='diastolic'
            stroke='#66bb6a'
            name='Tâm trương (Diastolic)'
          />
          <Line
            type='monotone'
            dataKey='pulse'
            stroke='#ffa726'
            name='Mạch (Pulse)'
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TrendChart;
