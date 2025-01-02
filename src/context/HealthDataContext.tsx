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

// Define the shape of the context
interface HealthDataContextProps {
  bloodPressure: BloodPressureData;
  bloodSugar: BloodSugarData;
  addBloodPressureReading: (data: BloodPressureData) => Promise<void>;
  addBloodSugarReading: (data: BloodSugarData) => Promise<void>;
  bpStatusInfo: ReturnType<typeof getBloodPressureStatusInfo> | null;
  bsStatusInfo: ReturnType<typeof getBloodSugarStatusInfo> | null;
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

  const [bloodPressure, setBloodPressure] = useState<BloodPressureData>({
    systolic: 120,
    diastolic: 80,
    pulse: 70,
    time: new Date().toISOString(),
  });

  const [bloodSugar, setBloodSugar] = useState<BloodSugarData>({
    level: 75,
    time: new Date().toISOString(),
  });

  const [bpStatusInfo, setBpStatusInfo] = useState<ReturnType<
    typeof getBloodPressureStatusInfo
  > | null>(null);
  const [bsStatusInfo, setBsStatusInfo] = useState<ReturnType<
    typeof getBloodSugarStatusInfo
  > | null>(null);

  // Fetch last readings from localStorage on mount
  useEffect(() => {
    const fetchLastReadings = () => {
      const lastBP = localStorage.getItem('lastBloodPressure');
      if (lastBP) {
        try {
          const parsedBP: BloodPressureData = JSON.parse(lastBP);
          setBloodPressure(parsedBP);
          setBpStatusInfo(
            getBloodPressureStatusInfo(
              getBloodPressureCategory(parsedBP.systolic, parsedBP.diastolic)
            )
          );
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
          setBloodSugar(parsedBS);
          setBsStatusInfo(
            getBloodSugarStatusInfo(getBloodSugarCategory(parsedBS.level))
          );
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
    setBloodPressure(data);
    setBpStatusInfo(
      getBloodPressureStatusInfo(
        getBloodPressureCategory(data.systolic, data.diastolic)
      )
    );
    localStorage.setItem('lastBloodPressure', JSON.stringify(data));
  };

  // Function to add blood sugar reading
  const addBloodSugarReading = async (data: BloodSugarData) => {
    await addReading('bloodSugar', data);
    setBloodSugar(data);
    setBsStatusInfo(getBloodSugarStatusInfo(getBloodSugarCategory(data.level)));
    localStorage.setItem('lastBloodSugar', JSON.stringify(data));
  };

  return (
    <HealthDataContext.Provider
      value={{
        bloodPressure,
        bloodSugar,
        addBloodPressureReading,
        addBloodSugarReading,
        bpStatusInfo,
        bsStatusInfo,
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
