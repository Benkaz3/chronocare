// src/types.ts

// HistoryTable Props
export interface HistoryTableProps {
  type: 'bloodPressure' | 'bloodSugar';
  title: string;
}

// Blood Pressure Types

// Interface for adding Blood Pressure data (write operations)
export interface BloodPressureData {
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
  recordedAt: Date | null;
  timestamp?: Date | null;
}

// Interface for reading Blood Pressure data (read operations)
export interface BloodPressureDataRead extends BloodPressureData {
  id: string;
}

// Processed Blood Pressure Type for HistoryTable
export interface ProcessedBP extends BloodPressureDataRead {
  status: string;
  color: string;
}

// Blood Sugar Types

// Interface for adding Blood Sugar data (write operations)
export interface BloodSugarData {
  level: number; // Blood sugar level in mg/dL
  time: string; // Time of the reading (e.g., "08:00 AM")
  recordedAt: Date | null;
  timestamp?: Date | null;
}

// Interface for reading Blood Sugar data (read operations)
export interface BloodSugarDataRead extends BloodSugarData {
  id: string;
}

// Processed Blood Sugar Type for HistoryTable
export interface ProcessedBS extends BloodSugarDataRead {
  status: string;
  color: string;
}

// Hook Return Type
export interface UseUserData {
  readings: Readings;
  loading: boolean;
  error: string | null;
  fetchReadings: () => void;
  addReading: (
    type: 'bloodPressure' | 'bloodSugar',
    data: BloodPressureData | BloodSugarData
  ) => void;
  updateReading: (
    type: 'bloodPressure' | 'bloodSugar',
    docId: string,
    data: Partial<BloodPressureData | BloodSugarData>
  ) => void;
}

// Combined Readings Interface
export interface Readings {
  bloodPressure: BloodPressureDataRead[];
  bloodSugar: BloodSugarDataRead[];
}
