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
}

export const bloodSugarRanges: BSRanges[] = [
  {
    range: [0, 54],
    category: 'Hypoglycemia',
  },
  {
    range: [55, 99],
    category: 'Normal',
  },
  {
    range: [100, 125],
    category: 'Elevated',
  },
  {
    range: [126, 199],
    category: 'Prediabetes',
  },
  {
    range: [200, Number.MAX_SAFE_INTEGER],
    category: 'Diabetes',
  },
];
