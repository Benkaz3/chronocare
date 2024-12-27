// src/constants/bloodPressureSegments.ts

import { GaugeSegment } from '../components/LinearGauge';

export const bloodPressureSegments: GaugeSegment<string>[] = [
  {
    label: 'Hypotension',
    value: 20, // 0-20%
    color: '#2196f3', // Blue
  },
  {
    label: 'Normal',
    value: 20, // 21-40%
    color: '#4caf50', // Green
  },
  {
    label: 'Prehypertension',
    value: 20, // 41-60%
    color: '#ff9800', // Orange
  },
  {
    label: 'Stage 1 Hypertension',
    value: 20, // 61-80%
    color: '#f44336', // Red
  },
  {
    label: 'Stage 2 Hypertension',
    value: 20, // 81-100%
    color: '#b71c1c', // Dark Red
  },
];
