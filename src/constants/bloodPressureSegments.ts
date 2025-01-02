// src/constants/bloodPressureSegments.ts

import { GaugeSegment } from '../components/LinearGauge';

export const bloodPressureSegments: GaugeSegment<string>[] = [
  {
    label: 'Huyết áp thấp',
    value: 20, // 0-20%
    color: '#2196f3', // Blue
  },
  {
    label: 'Bình thường',
    value: 20, // 21-40%
    color: '#4caf50', // Green
  },
  {
    label: 'Tiền tăng huyết áp',
    value: 20, // 41-60%
    color: '#ff9800', // Orange
  },
  {
    label: 'HA cao - Giai đoạn 1',
    value: 20, // 61-80%
    color: '#f44336', // Red
  },
  {
    label: 'HA cao - Giai đoạn 2',
    value: 20, // 81-100%
    color: '#b71c1c', // Dark Red
  },
];
