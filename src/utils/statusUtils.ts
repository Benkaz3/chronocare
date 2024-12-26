// src/utils/statusUtils.ts

export type BPStatus =
  | 'Bình thường'
  | 'Tăng cao'
  | 'Tăng cao (Giai đoạn 1)'
  | 'Tăng cao (Giai đoạn 2)'
  | 'Không xác định';
export type BSStatus =
  | 'Bình thường'
  | 'Tiền tiểu đường'
  | 'Tiểu đường'
  | 'Không xác định';

interface StatusInfo {
  status: BPStatus | BSStatus;
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
        max: 119,
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
        min: 120,
        max: 129,
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
        min: 130,
        max: 139,
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
        min: 140,
        max: Infinity, // Changed to Infinity for better scalability
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
        max: Infinity, // Changed to Infinity for better scalability
        color: '#9e9e9e', // Grey
      },
    };
  }
};

export const evaluateBSStatus = (level: number): StatusInfo => {
  if (level < 100) {
    return {
      status: 'Bình thường',
      explanation: 'Mức đường huyết của bạn nằm trong khoảng bình thường.',
      action: 'Tiếp tục duy trì chế độ ăn cân bằng và tập thể dục đều đặn.',
      range: {
        min: 0,
        max: 99,
        color: '#4caf50', // Green
      },
    };
  } else if (level >= 100 && level < 126) {
    return {
      status: 'Tiền tiểu đường',
      explanation: 'Mức đường huyết của bạn cho thấy tiền tiểu đường.',
      action:
        'Xem xét các thay đổi về lối sống như tăng cường hoạt động thể chất và thay đổi chế độ ăn uống.',
      range: {
        min: 100,
        max: 125,
        color: '#ff9800', // Orange
      },
    };
  } else if (level >= 126) {
    return {
      status: 'Tiểu đường',
      explanation: 'Mức đường huyết của bạn cho thấy tiểu đường.',
      action:
        'Tham khảo ý kiến nhà cung cấp dịch vụ y tế để quản lý và điều trị thích hợp.',
      range: {
        min: 126,
        max: Infinity, // Changed to Infinity for better scalability
        color: '#f44336', // Red
      },
    };
  } else {
    return {
      status: 'Không xác định',
      explanation: 'Không xác định được trạng thái đường huyết.',
      action:
        'Vui lòng đảm bảo các chỉ số đo chính xác và tham khảo ý kiến nhà cung cấp dịch vụ y tế.',
      range: {
        min: 0,
        max: Infinity, // Changed to Infinity for better scalability
        color: '#9e9e9e', // Grey
      },
    };
  }
};
