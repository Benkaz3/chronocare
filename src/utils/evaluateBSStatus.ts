// src/utils/evaluateBSStatus.ts

import {
  BloodSugarCategory,
  bloodSugarRanges,
} from '../constants/bloodSugarCategories';

export interface BSStatusInfo {
  status: BloodSugarCategory;
  explanation: string;
  action: string;
  color: string;
  range: {
    min: number;
    max: number;
  };
}

export const evaluateBSStatus = (level: number): BSStatusInfo => {
  for (const range of bloodSugarRanges) {
    const [min, max] = range.range;
    if (level >= min && level <= max) {
      return {
        status: range.category,
        explanation: getBSExplanation(range.category),
        action: getBSAction(range.category),
        color: range.color || '#9e9e9e', // Fallback to grey if color is empty
        range: {
          min,
          max,
        },
      };
    }
  }

  return {
    status: 'Invalid',
    explanation: 'Invalid blood sugar level.',
    action: 'Please check your measurements.',
    color: '#9e9e9e', // Grey for invalid
    range: {
      min: 0,
      max: 0,
    },
  };
};

const getBSExplanation = (category: BloodSugarCategory): string => {
  switch (category) {
    case 'Hypoglycemia':
      return 'Your blood sugar is below the normal range.';
    case 'Normal':
      return 'Your blood sugar is within the normal range.';
    case 'Elevated':
      return 'Your blood sugar is above the normal range.';
    case 'Prediabetes':
      return 'Your blood sugar levels indicate prediabetes.';
    case 'Diabetes':
      return 'Your blood sugar levels indicate diabetes.';
    case 'Invalid':
      return 'Invalid blood sugar level.';
    default:
      return 'Unable to determine blood sugar status.';
  }
};

const getBSAction = (category: BloodSugarCategory): string => {
  switch (category) {
    case 'Hypoglycemia':
      return 'Consider consuming fast-acting carbohydrates and consult a healthcare provider.';
    case 'Normal':
      return 'Maintain your current diet and lifestyle.';
    case 'Elevated':
      return 'Monitor your blood sugar and consult a healthcare provider if necessary.';
    case 'Prediabetes':
      return 'Adopt healthy lifestyle changes and consult your healthcare provider.';
    case 'Diabetes':
      return 'Seek immediate medical attention to manage your blood sugar.';
    case 'Invalid':
      return 'Please ensure accurate measurements and consult a doctor.';
    default:
      return 'Please ensure accurate measurements and consult a doctor.';
  }
};
