// src/constants/bloodSugarSegments.ts
import { GaugeSegment } from '../components/LinearGauge';

export const bloodSugarSegments: GaugeSegment<string>[] = [
  {
    label: 'Hạ đường huyết',
    value: 20, // 0-20%
    color: '#2196f3', // Blue
  },
  {
    label: 'Bình thường',
    value: 20, // 21-40%
    color: '#4caf50', // Green
  },
  {
    label: 'Tăng đường huyết',
    value: 20, // 41-60%
    color: '#ffeb3b', // Yellow
  },
  {
    label: 'Tiền tiểu đường',
    value: 20, // 61-80%
    color: '#ff9800', // Orange
  },
  {
    label: 'Tiểu đường',
    value: 20, // 81-100%
    color: '#f44336', // Red
  },
];
