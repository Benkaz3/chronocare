// src/context/HealthDataContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { BloodPressureData, BloodSugarData } from '../firebase';
import useUserData from '../hooks/useUserData';
import {
  getBloodPressureCategory,
  getBloodPressureStatusInfo,
} from '../data/bloodPressure';
import {
  getBloodSugarCategory,
  getBloodSugarStatusInfo,
} from '../data/bloodSugar';

// Extend the existing data interfaces to include 'status'
interface BloodPressureReading extends BloodPressureData {
  status: string;
}

interface BloodSugarReading extends BloodSugarData {
  status: string;
}

// Define the shape of the context
interface HealthDataContextProps {
  bloodPressure: BloodPressureReading | null;
  bloodSugar: BloodSugarReading | null;
  addBloodPressureReading: (data: BloodPressureData) => Promise<void>;
  addBloodSugarReading: (data: BloodSugarData) => Promise<void>;
  loading: boolean;
}

// Create the context with default values
const HealthDataContext = createContext<HealthDataContextProps | undefined>(
  undefined
);

// Provider component
export const HealthDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { addReading, loading } = useUserData();

  const [bloodPressure, setBloodPressure] =
    useState<BloodPressureReading | null>(null);

  const [bloodSugar, setBloodSugar] = useState<BloodSugarReading | null>(null);

  // Fetch last readings from localStorage on mount
  useEffect(() => {
    const fetchLastReadings = () => {
      const lastBP = localStorage.getItem('lastBloodPressure');
      if (lastBP) {
        try {
          const parsedBP: BloodPressureData = JSON.parse(lastBP);
          const category = getBloodPressureCategory(
            parsedBP.systolic,
            parsedBP.diastolic
          );
          const statusInfo = getBloodPressureStatusInfo(category);

          const status = statusInfo ? statusInfo.status : 'Unknown';

          setBloodPressure({
            ...parsedBP,
            status: status,
          });
        } catch (error) {
          console.error(
            'Error parsing lastBloodPressure from localStorage:',
            error
          );
        }
      }

      const lastBS = localStorage.getItem('lastBloodSugar');
      if (lastBS) {
        try {
          const parsedBS: BloodSugarData = JSON.parse(lastBS);
          const category = getBloodSugarCategory(parsedBS.level);
          const statusInfo = getBloodSugarStatusInfo(category);

          const status = statusInfo ? statusInfo.status : 'Unknown';

          setBloodSugar({
            ...parsedBS,
            status: status,
          });
        } catch (error) {
          console.error(
            'Error parsing lastBloodSugar from localStorage:',
            error
          );
        }
      }
    };

    fetchLastReadings();
  }, []);

  // Function to add blood pressure reading
  const addBloodPressureReading = async (data: BloodPressureData) => {
    await addReading('bloodPressure', data);
    const category = getBloodPressureCategory(data.systolic, data.diastolic);
    const statusInfo = getBloodPressureStatusInfo(category);

    const status = statusInfo ? statusInfo.status : 'Unknown';

    const bpReading: BloodPressureReading = {
      ...data,
      status: status,
    };

    setBloodPressure(bpReading);
    localStorage.setItem('lastBloodPressure', JSON.stringify(data));
  };

  // Function to add blood sugar reading
  const addBloodSugarReading = async (data: BloodSugarData) => {
    await addReading('bloodSugar', data);
    const category = getBloodSugarCategory(data.level);
    const statusInfo = getBloodSugarStatusInfo(category);

    const status = statusInfo ? statusInfo.status : 'Unknown';

    const bsReading: BloodSugarReading = {
      ...data,
      status: status,
    };

    setBloodSugar(bsReading);
    localStorage.setItem('lastBloodSugar', JSON.stringify(data));
  };

  return (
    <HealthDataContext.Provider
      value={{
        bloodPressure,
        bloodSugar,
        addBloodPressureReading,
        addBloodSugarReading,
        loading,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

// Custom hook for consuming the context
export const useHealthData = (): HealthDataContextProps => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
