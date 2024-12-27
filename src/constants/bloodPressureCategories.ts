// src/constants/bloodPressureCategories.ts

export type BloodPressureCategory =
  | 'Hypotension'
  | 'Normal'
  | 'Prehypertension'
  | 'Stage 1 Hypertension'
  | 'Stage 2 Hypertension'
  | 'Invalid';

export interface BPRange {
  systolic: [number, number];
  diastolic: [number, number];
  category: BloodPressureCategory;
}

export const bloodPressureRanges: BPRange[] = [
  {
    systolic: [0, 89],
    diastolic: [0, 59],
    category: 'Hypotension',
  },
  {
    systolic: [90, 120],
    diastolic: [60, 80],
    category: 'Normal',
  },
  {
    systolic: [121, 140],
    diastolic: [81, 90],
    category: 'Prehypertension',
  },
  {
    systolic: [141, 160],
    diastolic: [91, 100],
    category: 'Stage 1 Hypertension',
  },
  {
    systolic: [161, Number.MAX_SAFE_INTEGER],
    diastolic: [101, Number.MAX_SAFE_INTEGER],
    category: 'Stage 2 Hypertension',
  },
];
