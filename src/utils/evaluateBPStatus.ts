// src/utils/evaluateBPStatus.ts

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
  if (systolic < 120 && diastolic < 80) {
    return {
      status: 'Bình thường',
      explanation: 'Huyết áp của bạn nằm trong khoảng bình thường.',
      action: 'Duy trì lối sống hiện tại để giữ huyết áp của bạn khỏe mạnh.',
      range: {
        min: 0,
        max: 25,
        color: '#4caf50', // Green
      },
    };
  } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
    return {
      status: 'Tăng cao',
      explanation:
        'Huyết áp của bạn đang tăng cao, có thể làm tăng nguy cơ mắc bệnh tim.',
      action:
        'Xem xét việc áp dụng chế độ ăn uống lành mạnh hơn và tăng cường hoạt động thể chất.',
      range: {
        min: 26,
        max: 50,
        color: '#ff9800', // Orange
      },
    };
  } else if (
    (systolic >= 130 && systolic < 140) ||
    (diastolic >= 80 && diastolic < 90)
  ) {
    return {
      status: 'Tăng cao (Giai đoạn 1)',
      explanation: 'Huyết áp của bạn nằm trong khoảng tăng cao (Giai đoạn 1).',
      action:
        'Tham khảo ý kiến nhà cung cấp dịch vụ y tế để thay đổi lối sống hoặc sử dụng thuốc.',
      range: {
        min: 51,
        max: 75,
        color: '#ff5722', // Deep Orange
      },
    };
  } else if (systolic >= 140 || diastolic >= 90) {
    return {
      status: 'Tăng cao (Giai đoạn 2)',
      explanation: 'Huyết áp của bạn đang rất cao (Giai đoạn 2).',
      action:
        'Tìm kiếm sự chăm sóc y tế ngay lập tức để quản lý huyết áp của bạn.',
      range: {
        min: 76,
        max: 100,
        color: '#f44336', // Red
      },
    };
  } else {
    return {
      status: 'Không xác định',
      explanation: 'Không xác định được trạng thái huyết áp.',
      action:
        'Vui lòng đảm bảo các chỉ số đo chính xác và tham khảo ý kiến nhà cung cấp dịch vụ y tế.',
      range: {
        min: 0,
        max: 100,
        color: '#9e9e9e', // Grey
      },
    };
  }
};
