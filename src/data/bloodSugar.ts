// src/data/bloodSugar.ts

import { GaugeSegment } from '../components/LinearGauge';

// Define Blood Sugar Categories
export type BloodSugarCategory =
  | 'Hypoglycemia'
  | 'Normal'
  | 'Prediabetes'
  | 'Diabetes'
  | 'High risk'
  | 'Invalid';

// Interface for status information
export interface BloodSugarStatusInfo {
  status: string;
  explanation: string;
  action: string;
  color: string;
}

// Define Blood Sugar Ranges
export interface BloodSugarRange {
  range: [number, number];
  category: BloodSugarCategory;
  color: string;
}

export const bloodSugarRanges: BloodSugarRange[] = [
  {
    range: [0, 69],
    category: 'Hypoglycemia',
    color: '#2196f3', // Blue
  },
  {
    range: [70, 99],
    category: 'Normal',
    color: '#4caf50', // Green
  },
  {
    range: [100, 125],
    category: 'Prediabetes',
    color: '#ff9800', // Orange
  },
  {
    range: [126, 199],
    category: 'Diabetes',
    color: '#f44336', // Red
  },
  {
    range: [200, Number.MAX_SAFE_INTEGER],
    category: 'High risk', // High risk category
    color: '#b71c1c', // Dark Red
  },
  {
    range: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    category: 'Invalid',
    color: '#9e9e9e', // Grey
  },
];

// Define Blood Sugar Segments for the Gauge
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
    label: 'Tiền tiểu đường',
    value: 20, // 41-60%
    color: '#ff9800', // Orange
  },
  {
    label: 'Tiểu đường',
    value: 20, // 61-80%
    color: '#f44336', // Red
  },
  {
    label: 'Nguy hiểm',
    value: 20, // 81-100%
    color: '#b71c1c', // Dark Red
  },
];

// Utility Functions

/**
 * Determine the Blood Sugar category based on the blood sugar level.
 *
 * @param level - Blood sugar level in mg/dL.
 * @returns The corresponding BloodSugarCategory.
 */
export const getBloodSugarCategory = (level: number): BloodSugarCategory => {
  // Handle invalid inputs
  if (level <= 0) return 'Invalid';

  let category: BloodSugarCategory = 'Invalid';

  for (const range of bloodSugarRanges) {
    if (level >= range.range[0] && level <= range.range[1]) {
      category = range.category;
      break;
    }
  }

  return category;
};

/**
 * Map the Blood Sugar category to a corresponding gauge value.
 *
 * @param category - The BloodSugarCategory to map.
 * @returns A numerical value representing the gauge position.
 */
export const mapBloodSugarCategoryToGaugeValue = (
  category: BloodSugarCategory
): number => {
  switch (category) {
    case 'Hypoglycemia':
      return 10; // Midpoint of 0-20%
    case 'Normal':
      return 30; // Midpoint of 21-40%
    case 'Prediabetes':
      return 50; // Midpoint of 41-60%
    case 'Diabetes':
      return 70; // Midpoint of 61-80%
    case 'High risk':
      return 90; // Midpoint of 81-100%
    case 'Invalid':
    default:
      return 0; // Represents an invalid state
  }
};

/**
 * Get status information based on the Blood Sugar category.
 *
 * @param category - The BloodSugarCategory to retrieve information for.
 * @returns An object containing status details.
 */
export const getBloodSugarStatusInfo = (
  category: BloodSugarCategory
): BloodSugarStatusInfo => {
  switch (category) {
    case 'Hypoglycemia':
      return {
        status: 'Hạ đường huyết',
        explanation: 'Chỉ số đường huyết của bạn thấp hơn mức bình thường.',
        action:
          'Hãy ăn hoặc uống thực phẩm có chứa carbohydrate nhanh và tham khảo ý kiến bác sĩ.',
        color: '#2196f3', // Blue
      };
    case 'Normal':
      return {
        status: 'Bình thường',
        explanation:
          'Chỉ số đường huyết của bạn đang nằm trong mức bình thường.',
        action: 'Hãy duy trì chế độ ăn uống cân bằng và tập thể dục đều đặn.',
        color: '#4caf50', // Green
      };
    case 'Prediabetes':
      return {
        status: 'Tiền tiểu đường',
        explanation:
          'Chỉ số đường huyết của bạn cho thấy nguy cơ tiền tiểu đường.',
        action:
          'Áp dụng lối sống lành mạnh và tham khảo ý kiến bác sĩ để kiểm soát tốt hơn.',
        color: '#ff9800', // Orange
      };
    case 'Diabetes':
      return {
        status: 'Tiểu đường',
        explanation: 'Chỉ số đường huyết của bạn cho thấy bạn bị tiểu đường.',
        action:
          'Hãy tìm kiếm sự tư vấn và điều trị y tế từ bác sĩ để quản lý tình trạng này.',
        color: '#f44336', // Red
      };
    case 'High risk':
      return {
        status: 'Nguy hiểm',
        explanation:
          'Chỉ số đường huyết của bạn cho thấy bạn trong tình trạng nguy kịch.',
        action:
          'Hãy tìm kiếm sự tư vấn và điều trị y tế từ bác sĩ ngay lập tức.',
        color: '#b71c1c', // Dark Red
      };
    case 'Invalid':
    default:
      return {
        status: 'Bạn chưa nhập dữ liệu đường huyết',
        explanation: '',
        action: '',
        color: '#9e9e9e', // No color
      };
  }
};

/**
 * Determine Alert Severity based on the Blood Sugar status.
 *
 * @param status - The status string to determine severity for.
 * @returns The corresponding alert severity.
 */
export const getBloodSugarAlertSeverity = (
  status: string
): 'success' | 'info' | 'warning' | 'error' => {
  switch (status) {
    case 'Bình thường':
      return 'success';
    case 'Tiền tiểu đường':
      return 'warning';
    case 'Tiểu đường':
    case 'Nguy hiểm':
      return 'error';
    case 'Hạ đường huyết':
      return 'info';
    default:
      return 'info';
  }
};

// Exporting Filterable Status Labels
export const bloodSugarFilterableStatusLabels = [
  'Hạ đường huyết',
  'Bình thường',
  'Tiền tiểu đường',
  'Tiểu đường',
  'Nguy hiểm',
];
