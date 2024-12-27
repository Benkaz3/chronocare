// src/constants/bloodSugarSegments.ts
import { GaugeSegment } from '../components/LinearGauge';

export const bloodSugarSegments: GaugeSegment<string>[] = [
  {
    label: 'Hypoglycemia',
    value: 20, // 0-20%
    color: '#2196f3', // Blue
  },
  {
    label: 'Normal',
    value: 20, // 21-40%
    color: '#4caf50', // Green
  },
  {
    label: 'Elevated',
    value: 20, // 41-60%
    color: '#ffeb3b', // Yellow
  },
  {
    label: 'Prediabetes',
    value: 20, // 61-80%
    color: '#ff9800', // Orange
  },
  {
    label: 'Diabetes',
    value: 20, // 81-100%
    color: '#f44336', // Red
  },
];
