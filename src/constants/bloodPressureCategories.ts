// src/constants/bloodPressureCategories.ts

export type BloodPressureCategory =
  | 'Hypotension'
  | 'Normal'
  | 'Elevated'
  | 'Stage 1 Hypertension'
  | 'Stage 2 Hypertension'
  | 'Invalid';

export interface BPRange {
  systolic: [number, number];
  diastolic: [number, number];
  category: BloodPressureCategory;
  color: string;
}

export const bloodPressureRanges: BPRange[] = [
  {
    systolic: [0, 89],
    diastolic: [0, 59],
    category: 'Hypotension',
    color: '#2196f3',
  },
  {
    systolic: [90, 120],
    diastolic: [60, 80],
    category: 'Normal',
    color: '#4caf50',
  },
  {
    systolic: [121, 140],
    diastolic: [81, 90],
    category: 'Elevated',
    color: '#ff9800',
  },
  {
    systolic: [141, 160],
    diastolic: [91, 100],
    category: 'Stage 1 Hypertension',
    color: '#f44336',
  },
  {
    systolic: [161, Number.MAX_SAFE_INTEGER],
    diastolic: [101, Number.MAX_SAFE_INTEGER],
    category: 'Stage 2 Hypertension',
    color: '#b71c1c',
  },
];
