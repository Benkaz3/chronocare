// src/utils/evaluateBPStatus.ts

import { BloodPressureCategory } from '../constants/bloodPressureCategories';
import { bloodPressureSegments } from '../constants/bloodPressureSegments';

export interface StatusInfo {
  status: string;
  explanation: string;
  action: string;
  range: {
    min: number;
    max: number;
    color: string;
  };
}

export const evaluateBPStatus = (
  systolic: number,
  diastolic: number
): StatusInfo => {
  // Determine the blood pressure category based on standard guidelines
  let category: BloodPressureCategory = 'Invalid';

  if (systolic >= 140 || diastolic >= 90) {
    category = 'Stage 2 Hypertension';
  } else if (systolic >= 130 || diastolic >= 80) {
    category = 'Stage 1 Hypertension';
  } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
    category = 'Elevated';
  } else if (systolic < 90 || diastolic < 60) {
    category = 'Hypotension';
  } else if (systolic < 120 && diastolic < 80) {
    category = 'Normal';
  } else {
    category = 'Invalid';
  }

  // Map the category to the corresponding segment and percentages
  let cumulativePercent = 0;
  let minPercent = 0;
  let maxPercent = 0;
  let color = '#9e9e9e'; // Default color (grey)
  let label = 'Không xác định';

  for (const segment of bloodPressureSegments) {
    minPercent = cumulativePercent;
    maxPercent = cumulativePercent + segment.value;

    // Match segment label to category
    let segmentCategory: BloodPressureCategory;
    switch (segment.label) {
      case 'Huyết áp thấp':
        segmentCategory = 'Hypotension';
        break;
      case 'Bình thường':
        segmentCategory = 'Normal';
        break;
      case 'Tiền tăng huyết áp':
        segmentCategory = 'Elevated';
        break;
      case 'HA cao - Giai đoạn 1':
        segmentCategory = 'Stage 1 Hypertension';
        break;
      case 'HA cao - Giai đoạn 2':
        segmentCategory = 'Stage 2 Hypertension';
        break;
      default:
        segmentCategory = 'Invalid';
    }

    if (segmentCategory === category) {
      color = segment.color;
      label = segment.label;
      break;
    }

    cumulativePercent = maxPercent; // Update cumulative percent for next segment
  }

  // Now, set the min and max percentages for the category
  switch (category) {
    case 'Hypotension':
      minPercent = 0;
      maxPercent = 20;
      break;
    case 'Normal':
      minPercent = 20;
      maxPercent = 40;
      break;
    case 'Elevated':
      minPercent = 40;
      maxPercent = 60;
      break;
    case 'Stage 1 Hypertension':
      minPercent = 60;
      maxPercent = 80;
      break;
    case 'Stage 2 Hypertension':
      minPercent = 80;
      maxPercent = 100;
      break;
    default:
      minPercent = 0;
      maxPercent = 100;
      break;
  }

  // Now, return the StatusInfo
  switch (category) {
    case 'Hypotension':
      return {
        status: label,
        explanation: 'Huyết áp của bạn thấp hơn mức bình thường.',
        action: 'Bạn nên tham khảo ý kiến bác sĩ để được tư vấn cụ thể.',
        range: {
          min: minPercent,
          max: maxPercent,
          color: color,
        },
      };
    case 'Normal':
      return {
        status: label,
        explanation: 'Huyết áp của bạn nằm trong khoảng bình thường.',
        action: 'Duy trì lối sống hiện tại để giữ huyết áp của bạn khỏe mạnh.',
        range: {
          min: minPercent,
          max: maxPercent,
          color: color,
        },
      };
    case 'Elevated':
      return {
        status: label,
        explanation:
          'Huyết áp của bạn cao hơn mức bình thường, có nguy cơ phát triển thành tăng huyết áp.',
        action:
          'Bạn nên duy trì chế độ ăn uống lành mạnh và tập thể dục thường xuyên.',
        range: {
          min: minPercent,
          max: maxPercent,
          color: color,
        },
      };
    case 'Stage 1 Hypertension':
      return {
        status: label,
        explanation:
          'Huyết áp của bạn nằm trong mức tăng huyết áp Giai đoạn 1.',
        action:
          'Bạn nên tham khảo ý kiến bác sĩ để được tư vấn và điều trị phù hợp.',
        range: {
          min: minPercent,
          max: maxPercent,
          color: color,
        },
      };
    case 'Stage 2 Hypertension':
      return {
        status: label,
        explanation:
          'Huyết áp của bạn nằm trong mức tăng huyết áp Giai đoạn 2.',
        action:
          'Bạn cần tìm kiếm sự chăm sóc y tế để quản lý huyết áp của mình.',
        range: {
          min: minPercent,
          max: maxPercent,
          color: color,
        },
      };
    default:
      return {
        status: label,
        explanation: 'Không xác định được trạng thái huyết áp.',
        action:
          'Vui lòng đảm bảo các chỉ số đo chính xác và tham khảo ý kiến bác sĩ.',
        range: {
          min: minPercent,
          max: maxPercent,
          color: color,
        },
      };
  }
};
