// src/data/bloodPressure.ts

import { GaugeSegment } from '../components/LinearGauge';

// Define Blood Pressure Categories
export type BloodPressureCategory =
  | 'Hypotension'
  | 'Normal'
  | 'Elevated'
  | 'Hypertension Stage 1'
  | 'Hypertension Stage 2'
  | 'Hypertensive Crisis'
  | 'Invalid';

// Interface for status information
export interface StatusInfo {
  status: string;
  explanation: string;
  action: string;
  color: string;
}

// Define Blood Pressure Ranges
export interface BloodPressureRange {
  systolic: [number, number];
  diastolic: [number, number];
  category: BloodPressureCategory;
  color: string;
}

export const bloodPressureRanges: BloodPressureRange[] = [
  {
    systolic: [0, 89],
    diastolic: [0, 59],
    category: 'Hypotension',
    color: '#2196f3', // Blue
  },
  {
    systolic: [90, 119],
    diastolic: [60, 79],
    category: 'Normal',
    color: '#4caf50', // Green
  },
  {
    systolic: [120, 129],
    diastolic: [60, 79],
    category: 'Elevated',
    color: '#ff9800', // Orange
  },
  {
    systolic: [130, 139],
    diastolic: [80, 89],
    category: 'Hypertension Stage 1',
    color: '#FA6E1B', // Dark Orange
  },
  {
    systolic: [140, 179],
    diastolic: [90, 119],
    category: 'Hypertension Stage 2',
    color: '#f44336', // Red
  },
  {
    systolic: [180, Number.MAX_SAFE_INTEGER],
    diastolic: [120, Number.MAX_SAFE_INTEGER],
    category: 'Hypertensive Crisis',
    color: '#b71c1c', // Dark Red
  },
  {
    systolic: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    diastolic: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    category: 'Invalid',
    color: '#9e9e9e', // Grey
  },
];

// Define Blood Pressure Segments for the Gauge
export const bloodPressureSegments: GaugeSegment<string>[] = [
  {
    label: 'Huyết áp thấp',
    value: 10, // 0-16%
    color: '#2196f3', // Blue
  },
  {
    label: 'Bình Thường',
    value: 20, // 17-32%
    color: '#4caf50', // Green
  },
  {
    label: 'Tiền Tăng Huyết Áp',
    value: 20, // 33-48%
    color: '#ff9800', // Orange
  },
  {
    label: 'Tăng Huyết Áp Giai Đoạn 1',
    value: 20, // 49-64%
    color: '#FA6E1B', // Dark Orange
  },
  {
    label: 'Tăng Huyết Áp Giai Đoạn 2',
    value: 20, // 65-80%
    color: '#f44336', // Red
  },
  {
    label: 'Huyết áp BÁO ĐỘNG!',
    value: 10, // 81-96%
    color: '#b71c1c', // Dark Red
  },
];

// Define category priority for comparison
const categoryPriority: BloodPressureCategory[] = [
  'Hypertensive Crisis',
  'Hypertension Stage 2',
  'Hypertension Stage 1',
  'Elevated',
  'Normal',
  'Hypotension',
  'Invalid',
];

/**
 * Determine the Blood Pressure category based on systolic and diastolic values.
 * The category is determined by the higher severity between systolic and diastolic.
 *
 * @param systolic - Systolic blood pressure value.
 * @param diastolic - Diastolic blood pressure value.
 * @returns The corresponding BloodPressureCategory.
 */
export const getBloodPressureCategory = (
  systolic: number,
  diastolic: number
): BloodPressureCategory => {
  // Handle invalid inputs
  if (systolic <= 0 || diastolic <= 0) return 'Invalid';

  // Find categories for systolic
  const systolicCategory = bloodPressureRanges.find(
    (range) => systolic >= range.systolic[0] && systolic <= range.systolic[1]
  )?.category;

  // Find categories for diastolic
  const diastolicCategory = bloodPressureRanges.find(
    (range) =>
      diastolic >= range.diastolic[0] && diastolic <= range.diastolic[1]
  )?.category;

  // Determine the higher priority category
  const systolicIndex = categoryPriority.indexOf(systolicCategory || 'Invalid');
  const diastolicIndex = categoryPriority.indexOf(
    diastolicCategory || 'Invalid'
  );

  if (systolicIndex === -1 && diastolicIndex === -1) {
    return 'Invalid';
  } else if (systolicIndex === -1) {
    return diastolicCategory || 'Invalid';
  } else if (diastolicIndex === -1) {
    return systolicCategory || 'Invalid';
  }

  return systolicIndex < diastolicIndex
    ? systolicCategory || 'Invalid'
    : diastolicCategory || 'Invalid';
};

/**
 * Map the Blood Pressure category to a corresponding gauge value.
 *
 * @param category - The BloodPressureCategory to map.
 * @returns A numerical value representing the gauge position.
 */
export const mapBloodPressureCategoryToGaugeValue = (
  category: BloodPressureCategory
): number => {
  switch (category) {
    case 'Hypotension':
      return 5; // Midpoint of 0-10%
    case 'Normal':
      return 20; // Midpoint of 10-30%
    case 'Elevated':
      return 40; // Midpoint of 30-50%
    case 'Hypertension Stage 1':
      return 60; // Midpoint of 50-70%
    case 'Hypertension Stage 2':
      return 80; // Midpoint of 70-90%
    case 'Hypertensive Crisis':
      return 95; // Midpoint of 90-100%
    case 'Invalid':
    default:
      return 0; // Represents an invalid state
  }
};

/**
 * Get status information based on the Blood Pressure category.
 *
 * @param category - The BloodPressureCategory to retrieve information for.
 * @returns An object containing status details.
 */
export const getBloodPressureStatusInfo = (
  category: BloodPressureCategory
): StatusInfo | null => {
  switch (category) {
    case 'Hypotension':
      return {
        status: 'Huyết áp thấp',
        explanation: 'Huyết áp của bạn thấp hơn mức bình thường.',
        action: 'Tham khảo ý kiến bác sĩ nếu bạn có triệu chứng.',
        color: '#2196f3', // Blue
      };
    case 'Normal':
      return {
        status: 'Bình Thường',
        explanation: 'Huyết áp của bạn trong khoảng bình thường.',
        action: 'Duy trì lối sống lành mạnh để giữ mức này.',
        color: '#4caf50', // Green
      };
    case 'Elevated':
      return {
        status: 'Tiền Tăng Huyết Áp',
        explanation: 'Huyết áp của bạn cao hơn bình thường.',
        action: 'Xem xét thay đổi lối sống để giảm huyết áp.',
        color: '#ff9800', // Orange
      };
    case 'Hypertension Stage 1':
      return {
        status: 'Tăng Huyết Áp Giai Đoạn 1',
        explanation: 'Huyết áp của bạn ở mức Tăng Huyết Áp Giai Đoạn 1.',
        action: 'Tham khảo ý kiến bác sĩ để có thể điều trị.',
        color: '#FA6E1B', // Dark Orange
      };
    case 'Hypertension Stage 2':
      return {
        status: 'Tăng Huyết Áp Giai Đoạn 2',
        explanation: 'Huyết áp của bạn ở mức Tăng Huyết Áp Giai Đoạn 2.',
        action: 'Hãy tìm kiếm sự chăm sóc y tế ngay lập tức.',
        color: '#f44336', // Red
      };
    case 'Hypertensive Crisis':
      return {
        status: 'Huyết áp BÁO ĐỘNG!',
        explanation: 'Huyết áp của bạn ở mức cực cao, có thể gây nguy hiểm.',
        action: 'Hãy tìm kiếm sự chăm sóc y tế khẩn cấp ngay lập tức.',
        color: '#b71c1c', // Dark Red
      };
    case 'Invalid':
      return {
        status: 'Bạn chưa nhập dữ liệu huyết áp',
        explanation: '',
        action: '',
        color: '#9e9e9e', // Grey
      };
    default:
      return null;
  }
};

/**
 * Determine Alert Severity based on the Blood Pressure status.
 *
 * @param status - The status string to determine severity for.
 * @returns The corresponding alert severity.
 */
export const getBloodPressureAlertSeverity = (
  status: string
): 'success' | 'info' | 'warning' | 'error' => {
  switch (status) {
    case 'Bình Thường':
      return 'success';
    case 'Tiền Tăng Huyết Áp':
    case 'Tăng Huyết Áp Giai Đoạn 1':
      return 'warning';
    case 'Tăng Huyết Áp Giai Đoạn 2':
    case 'Huyết áp BÁO ĐỘNG!':
      return 'error';
    case 'Huyết áp thấp':
      return 'info';
    default:
      return 'info';
  }
};

// Exporting Filterable Status Labels
export const bloodPressureFilterableStatusLabels = [
  'Huyết áp thấp',
  'Bình Thường',
  'Tiền Tăng Huyết Áp',
  'Tăng Huyết Áp Giai Đoạn 1',
  'Tăng Huyết Áp Giai Đoạn 2',
  'Huyết áp BÁO ĐỘNG!',
];
