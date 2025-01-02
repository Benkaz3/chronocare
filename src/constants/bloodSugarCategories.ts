// src/constants/bloodSugarCategories.ts

export type BloodSugarCategory =
  | 'Hypoglycemia'
  | 'Normal'
  | 'Elevated'
  | 'Prediabetes'
  | 'Diabetes'
  | 'Invalid';

export interface BSRanges {
  range: [number, number];
  category: BloodSugarCategory;
  color: string;
}

export const bloodSugarRanges: BSRanges[] = [
  {
    range: [0, 70],
    category: 'Hypoglycemia',
    color: '#2196f3', // Blue
  },
  {
    range: [71, 108],
    category: 'Normal',
    color: '#4caf50', // Green
  },
  {
    range: [109, 150],
    category: 'Elevated',
    color: '#ffeb3b', // Yellow
  },
  {
    range: [151, 180],
    category: 'Prediabetes',
    color: '#ff9800', // Orange
  },
  {
    range: [181, 280],
    category: 'Diabetes',
    color: '#f44336', // Red
  },
  {
    range: [281, Number.MAX_SAFE_INTEGER],
    category: 'Invalid',
    color: '#9e9e9e', // Grey
  },
];
