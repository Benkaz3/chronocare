// src/utils/downloadUtils.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import vietnameseFont from './vietnameseFontBase64';

const formatDate = (date: Date | null, time: string): string => {
  if (!date) return time || 'Unknown Time';
  return (
    date.toLocaleDateString('vi-VN') +
    ' ' +
    date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  );
};

export const downloadJSON = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const convertArrayOfObjectsToCSV = (
  array: any[],
  headers: string[]
): string => {
  const csvRows = [];
  csvRows.push(headers.join(','));

  array.forEach((obj) => {
    const row = headers.map((header) => {
      const key = header;
      const val = obj[key] !== undefined ? obj[key] : '';
      const escaped = `${val}`.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

export const downloadPDF = (
  data: any,
  filename: string,
  userNameOrEmail: string
) => {
  const doc = new jsPDF();

  // Embed the custom font
  doc.addFileToVFS('BeVietnamPro.ttf', vietnameseFont);
  doc.addFont('BeVietnamPro.ttf', 'BeVietnamPro', 'normal');
  doc.setFont('BeVietnamPro');

  // Add Title
  doc.setFontSize(18);
  doc.text(`Báo Cáo Dữ Liệu Sức Khỏe - ${userNameOrEmail}`, 14, 22);

  // Add Subtitle for Blood Pressure
  doc.setFontSize(14);
  doc.text('Dữ Liệu Huyết Áp:', 14, 32);

  const bloodPressureHeaders = [
    'Ngày',
    'Huyết áp tâm thu',
    'Huyết áp tâm trương',
    'Nhịp tim',
  ];
  const bloodPressureRows = data.bloodPressure.map((item: any) => [
    formatDate(item.recordedAt, item.time),
    item.systolic,
    item.diastolic,
    item.pulse,
  ]);

  doc.autoTable({
    theme: 'grid',
    head: [bloodPressureHeaders],
    body: bloodPressureRows,
    startY: 36,
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      font: 'BeVietnamPro',
      fontStyle: 'normal',
      fontSize: 12,
    },
    bodyStyles: {
      font: 'BeVietnamPro',
      fontStyle: 'normal',
      fontSize: 10,
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: {
      overflow: 'linebreak',
      cellPadding: 3,
    },
  });

  const bloodSugarStartY = doc.lastAutoTable.finalY + 10;

  // Add Subtitle for Blood Sugar
  doc.setFontSize(14);
  doc.text('Dữ Liệu Đường Máu:', 14, bloodSugarStartY);

  const bloodSugarHeaders = ['Ngày', 'Mức Đường Máu'];
  const bloodSugarRows = data.bloodSugar.map((item: any) => [
    formatDate(item.recordedAt, item.time),
    item.level,
  ]);

  doc.autoTable({
    theme: 'grid',
    head: [bloodSugarHeaders],
    body: bloodSugarRows,
    startY: bloodSugarStartY + 4,
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      font: 'BeVietnamPro',
      fontStyle: 'normal',
      fontSize: 12,
    },
    bodyStyles: {
      font: 'BeVietnamPro',
      fontStyle: 'normal',
      fontSize: 10,
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: {
      overflow: 'linebreak',
      cellPadding: 3,
    },
  });

  doc.save(filename);
};

export const downloadBloodPressureCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('Không có dữ liệu huyết áp để tải xuống.');
    return;
  }

  const headers = [
    'Ngày',
    'Huyết áp tâm thu',
    'Huyết áp tâm trương',
    'Nhịp tim',
  ];
  const formattedData = data.map((item) => ({
    Ngày: formatDate(item.recordedAt, item.time),
    'Huyết áp tâm thu': item.systolic,
    'Huyết áp tâm trương': item.diastolic,
    'Nhịp tim': item.pulse,
  }));
  const csv = convertArrayOfObjectsToCSV(formattedData, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadBloodSugarCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('Không có dữ liệu đường máu để tải xuống.');
    return;
  }

  const headers = ['Ngày', 'Mức Đường Máu'];
  const formattedData = data.map((item) => ({
    Ngày: formatDate(item.recordedAt, item.time),
    'Mức Đường Máu': item.level,
  }));
  const csv = convertArrayOfObjectsToCSV(formattedData, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
