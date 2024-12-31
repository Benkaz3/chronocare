// src/utils/downloadUtils.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const downloadJSON = (data: any, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 2); // Pretty-print with 2-space indentation
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Converts an array of objects to CSV string
const convertArrayOfObjectsToCSV = (
  array: any[],
  headers: string[]
): string => {
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  array.forEach((obj) => {
    const row = headers.map((header) => {
      const val = obj[header] !== undefined ? obj[header] : '';
      // Escape double quotes by doubling them
      const escaped = `${val}`.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

export const downloadPDF = (
  data: any,
  filename: string = 'health_data_report.pdf'
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('Health Data Report', 14, 22);

  // Blood Pressure Table
  doc.setFontSize(14);
  doc.text('Blood Pressure Data:', 14, 32);

  const bloodPressureHeaders = ['Date', 'Systolic', 'Diastolic', 'Pulse'];
  const bloodPressureRows = data.bloodPressure.map((item: any) => [
    item.date,
    item.value.systolic,
    item.value.diastolic,
    item.value.pulse,
  ]);

  doc.autoTable({
    startY: 36,
    head: [bloodPressureHeaders],
    body: bloodPressureRows,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // Blood Sugar Table
  const bloodSugarStartY = doc.lastAutoTable.finalY + 10;
  doc.text('Blood Sugar Data:', 14, bloodSugarStartY);

  const bloodSugarHeaders = ['Date', 'Blood Sugar Level'];
  const bloodSugarRows = data.bloodSugar.map((item: any) => [
    item.date,
    item.value.level,
  ]);

  doc.autoTable({
    startY: bloodSugarStartY + 4,
    head: [bloodSugarHeaders],
    body: bloodSugarRows,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save(filename);
};
// Download Blood Pressure CSV
export const downloadBloodPressureCSV = (
  data: any[],
  filename: string = 'blood_pressure_data.csv'
) => {
  if (data.length === 0) {
    alert('No blood pressure data available to download.');
    return;
  }

  const headers = ['Date', 'Systolic', 'Diastolic', 'Pulse'];
  const formattedData = data.map((item) => ({
    Date: item.date,
    Systolic: item.value.systolic,
    Diastolic: item.value.diastolic,
    Pulse: item.value.pulse,
  }));
  const csv = convertArrayOfObjectsToCSV(formattedData, headers);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download Blood Sugar CSV
export const downloadBloodSugarCSV = (
  data: any[],
  filename: string = 'blood_sugar_data.csv'
) => {
  if (data.length === 0) {
    alert('No blood sugar data available to download.');
    return;
  }

  const headers = ['Date', 'Blood Sugar Level'];
  const formattedData = data.map((item) => ({
    Date: item.date,
    'Blood Sugar Level': item.value.level,
  }));
  const csv = convertArrayOfObjectsToCSV(formattedData, headers);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
