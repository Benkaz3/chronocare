import { initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
  FirestoreError,
  Timestamp,
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// TypeScript interface for blood pressure data (write operations)
export interface BloodPressureData {
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
  recordedAt: Timestamp; // Added recordedAt field
  timestamp?: ReturnType<typeof serverTimestamp>;
}

// TypeScript interface for blood sugar data (write operations)
export interface BloodSugarData {
  level: number; // Blood sugar level in mg/dL
  time: string; // Time of the reading (e.g., "08:00 AM")
  recordedAt: Timestamp; // Added recordedAt field
  timestamp?: ReturnType<typeof serverTimestamp>; // Firestore server timestamp
}

// TypeScript interface for blood pressure data (read operations)
interface BloodPressureDataRead {
  systolic: number;
  diastolic: number;
  pulse: number;
  time: string;
  recordedAt: Date | null;
  timestamp: Date | null;
}

// TypeScript interface for blood sugar data (read operations)
interface BloodSugarDataRead {
  level: number; // Blood sugar level in mg/dL
  time: string; // Time of the reading (e.g., "08:00 AM")
  recordedAt: Date | null;
  timestamp: Date | null;
}

/**
 * Function to add blood pressure data to Firestore
 */
const addBloodPressureData = async (data: BloodPressureData): Promise<void> => {
  const user: User | null = auth.currentUser; // Get the currently authenticated user

  if (!user) {
    throw new Error('User not authenticated');
  }

  const userId = user.uid; // User's unique ID

  try {
    // Store the blood pressure data in a subcollection named 'bloodPressure' under the user's document
    const newData = { ...data, timestamp: serverTimestamp() };
    const docRef = await addDoc(
      collection(db, 'users', userId, 'bloodPressure'),
      newData
    );
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    const error = e as FirestoreError;
    console.error('Error adding document: ', error.message);
    throw new Error('Error adding document');
  }
};

/**
 * Function to fetch blood pressure data from Firestore
 */
const getBloodPressureData = async (): Promise<BloodPressureDataRead[]> => {
  const user: User | null = auth.currentUser;
  if (!user) {
    console.error('No user is logged in');
    return [];
  }

  const userId = user.uid;
  console.log('Fetching data for user ID:', userId);

  try {
    const q = query(
      collection(db, 'users', userId, 'bloodPressure'),
      orderBy('recordedAt', 'desc'),
      limit(25)
    );
    const querySnapshot = await getDocs(q);
    console.log('Query Snapshot Size:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.log('No blood pressure data found.');
      return [];
    }

    const data: BloodPressureDataRead[] = querySnapshot.docs.map((doc) => {
      const docData = doc.data() as BloodPressureData;
      console.log('Document Data:', docData);
      return {
        systolic: docData.systolic,
        diastolic: docData.diastolic,
        pulse: docData.pulse,
        time: docData.time,
        recordedAt: docData.recordedAt ? docData.recordedAt.toDate() : null,
        timestamp: docData.timestamp
          ? (docData.timestamp as Timestamp).toDate()
          : null,
      };
    });

    return data;
  } catch (e) {
    const error = e as FirestoreError;
    console.error('Error fetching data: ', error.message);
    throw new Error('Error fetching data');
  }
};

/**
 * Function to add blood sugar data to Firestore
 */
const addBloodSugarData = async (data: BloodSugarData): Promise<void> => {
  const user: User | null = auth.currentUser; // Get the currently authenticated user

  if (!user) {
    throw new Error('User not authenticated');
  }

  const userId = user.uid; // User's unique ID

  try {
    // Store the blood sugar data in a subcollection named 'bloodSugar' under the user's document
    const newData = { ...data, timestamp: serverTimestamp() };
    const docRef = await addDoc(
      collection(db, 'users', userId, 'bloodSugar'),
      newData
    );
    console.log('Blood Sugar Document written with ID: ', docRef.id);
  } catch (e) {
    const error = e as FirestoreError;
    console.error('Error adding Blood Sugar document: ', error.message);
    throw new Error('Error adding Blood Sugar document');
  }
};

/**
 * Function to fetch blood sugar data from Firestore
 */
const getBloodSugarData = async (): Promise<BloodSugarDataRead[]> => {
  const user: User | null = auth.currentUser; // Get the currently authenticated user
  if (!user) {
    console.error('No user is logged in');
    return [];
  }

  const userId = user.uid;
  console.log('Fetching blood sugar data for user ID:', userId);

  try {
    const q = query(
      collection(db, 'users', userId, 'bloodSugar'),
      orderBy('recordedAt', 'desc'),
      limit(25) // Fetch the latest 25 records
    );
    const querySnapshot = await getDocs(q);
    console.log('Blood Sugar Query Snapshot Size:', querySnapshot.size);

    if (querySnapshot.empty) {
      console.log('No blood sugar data found.');
      return [];
    }

    const data: BloodSugarDataRead[] = querySnapshot.docs.map((doc) => {
      const docData = doc.data() as BloodSugarData;
      console.log('Blood Sugar Document Data:', docData);
      return {
        level: docData.level,
        time: docData.time,
        recordedAt: docData.recordedAt ? docData.recordedAt.toDate() : null,
        timestamp: docData.timestamp
          ? (docData.timestamp as Timestamp).toDate()
          : null,
      };
    });

    return data;
  } catch (e) {
    const error = e as FirestoreError;
    console.error('Error fetching Blood Sugar data: ', error.message);
    throw new Error('Error fetching Blood Sugar data');
  }
};

// Exporting functions and types
export {
  auth,
  db,
  addBloodPressureData,
  getBloodPressureData,
  addBloodSugarData,
  getBloodSugarData,
};

// Exporting types separately using 'export type' to comply with 'isolatedModules'
export type { BloodPressureDataRead, BloodSugarDataRead };
