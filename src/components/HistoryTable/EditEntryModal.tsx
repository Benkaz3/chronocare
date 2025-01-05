// src/components/HistoryTable/EditEntryModal.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import {
  ProcessedBP,
  ProcessedBS,
  BloodPressureData,
  BloodSugarData,
} from '../../types';
import LinearGauge from '../LinearGauge';

import {
  bloodPressureSegments,
  getBloodPressureCategory,
  mapBloodPressureCategoryToGaugeValue,
  getBloodPressureStatusInfo,
  getBloodPressureAlertSeverity,
} from '../../data/bloodPressure';

import {
  bloodSugarSegments,
  getBloodSugarCategory,
  mapBloodSugarCategoryToGaugeValue,
  getBloodSugarStatusInfo,
  getBloodSugarAlertSeverity,
} from '../../data/bloodSugar';

interface EditEntryModalProps {
  open: boolean;
  onClose: () => void;
  entry: ProcessedBP | ProcessedBS;
  onSave: (updatedEntry: ProcessedBP | ProcessedBS) => void;
}

// Type Guard to determine if entry is ProcessedBP
const isProcessedBP = (
  entry: ProcessedBP | ProcessedBS
): entry is ProcessedBP => {
  return 'systolic' in entry;
};

interface StatusInfo {
  status: string;
  explanation: string;
  action?: string; // Made optional if not always present
  color: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({
  open,
  onClose,
  entry,
  onSave,
}) => {
  // Separate form states for Blood Pressure and Blood Sugar
  const [bpFormData, setBpFormData] = useState<Partial<BloodPressureData>>({});
  const [bsFormData, setBsFormData] = useState<Partial<BloodSugarData>>({});

  // Define errors state for each form type
  const [bpErrors, setBpErrors] = useState<
    Partial<Record<keyof BloodPressureData, string>>
  >({});
  const [bsErrors, setBsErrors] = useState<
    Partial<Record<keyof BloodSugarData, string>>
  >({});

  // Status Information
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);

  // Initialize form data when entry changes or modal opens
  useEffect(() => {
    if (entry) {
      if (isProcessedBP(entry)) {
        setBpFormData({
          systolic: entry.systolic,
          diastolic: entry.diastolic,
          pulse: entry.pulse,
          time: entry.time,
          recordedAt: entry.recordedAt,
          timestamp: entry.timestamp,
        });
        setBpErrors({});
        // Determine Status Info
        const category = getBloodPressureCategory(
          entry.systolic,
          entry.diastolic
        );
        const info = getBloodPressureStatusInfo(category);

        // Ensure 'info' is not null before setting
        if (info) {
          const severity = getBloodPressureAlertSeverity(info.status);
          setStatusInfo({
            status: info.status,
            explanation: info.explanation,
            action: info.action, // Optional property
            color: info.color,
            severity,
          });
        } else {
          setStatusInfo(null);
        }
      } else {
        const bsEntry = entry as ProcessedBS;
        setBsFormData({
          level: bsEntry.level,
          time: bsEntry.time,
          recordedAt: bsEntry.recordedAt,
          timestamp: bsEntry.timestamp,
        });
        setBsErrors({});
        // Determine Status Info
        const category = getBloodSugarCategory(bsEntry.level);
        const info = getBloodSugarStatusInfo(category);

        // Ensure 'info' is not null before setting
        if (info) {
          const severity = getBloodSugarAlertSeverity(info.status);
          setStatusInfo({
            status: info.status,
            explanation: info.explanation,
            action: info.action, // Optional property
            color: info.color,
            severity,
          });
        } else {
          setStatusInfo(null);
        }
      }
    }
  }, [entry, open]);

  // Update statusInfo dynamically as form data changes
  useEffect(() => {
    if (isProcessedBP(entry)) {
      const systolic = bpFormData.systolic ?? entry.systolic;
      const diastolic = bpFormData.diastolic ?? entry.diastolic;
      const category = getBloodPressureCategory(systolic, diastolic);
      const info = getBloodPressureStatusInfo(category);

      // Ensure 'info' is not null before setting
      if (info) {
        const severity = getBloodPressureAlertSeverity(info.status);
        setStatusInfo({
          status: info.status,
          explanation: info.explanation,
          action: info.action, // Optional property
          color: info.color,
          severity,
        });
      } else {
        setStatusInfo(null);
      }
    } else {
      const bsEntry = entry as ProcessedBS;
      const level = bsFormData.level ?? bsEntry.level;
      const category = getBloodSugarCategory(level);
      const info = getBloodSugarStatusInfo(category);

      // Ensure 'info' is not null before setting
      if (info) {
        const severity = getBloodSugarAlertSeverity(info.status);
        setStatusInfo({
          status: info.status,
          explanation: info.explanation,
          action: info.action, // Optional property
          color: info.color,
          severity,
        });
      } else {
        setStatusInfo(null);
      }
    }
  }, [
    bpFormData.systolic,
    bpFormData.diastolic,
    bpFormData.pulse,
    bsFormData.level,
    entry,
  ]);

  // Handle input changes for Blood Pressure
  const handleBpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['systolic', 'diastolic', 'pulse'] as const;

    if (numericFields.includes(name as (typeof numericFields)[number])) {
      const newValue = value === '' ? undefined : Number(value);
      setBpFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // Handle input changes for Blood Sugar
  const handleBsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['level'] as const;

    if (numericFields.includes(name as (typeof numericFields)[number])) {
      const newValue = value === '' ? undefined : Number(value);
      setBsFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // Validation for Blood Pressure form
  const validateBP = (): boolean => {
    const newErrors: Partial<Record<keyof BloodPressureData, string>> = {};

    if (bpFormData.systolic === undefined || bpFormData.systolic <= 0) {
      newErrors.systolic = 'Systolic must be a positive number';
    }
    if (bpFormData.diastolic === undefined || bpFormData.diastolic <= 0) {
      newErrors.diastolic = 'Diastolic must be a positive number';
    }
    if (
      bpFormData.pulse !== undefined &&
      (bpFormData.pulse < 30 || bpFormData.pulse > 200)
    ) {
      newErrors.pulse = 'Pulse must be between 30 and 200';
    }

    setBpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation for Blood Sugar form
  const validateBS = (): boolean => {
    const newErrors: Partial<Record<keyof BloodSugarData, string>> = {};

    if (bsFormData.level === undefined || bsFormData.level <= 0) {
      newErrors.level = 'Blood sugar level must be a positive number';
    }

    setBsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isProcessedBP(entry)) {
      if (!validateBP()) return;

      // Ensure all required fields are present before saving
      if (
        bpFormData.systolic !== undefined &&
        bpFormData.diastolic !== undefined
      ) {
        const updatedEntry: ProcessedBP = {
          ...entry,
          systolic: bpFormData.systolic,
          diastolic: bpFormData.diastolic,
          pulse: bpFormData.pulse ?? entry.pulse,
          time: bpFormData.time ?? entry.time,
          recordedAt: bpFormData.recordedAt ?? entry.recordedAt,
          timestamp: bpFormData.timestamp ?? entry.timestamp,
        };

        onSave(updatedEntry);
      }
    } else {
      const bsEntry = entry as ProcessedBS;
      if (!validateBS()) return;

      // Ensure all required fields are present before saving
      if (bsFormData.level !== undefined) {
        const updatedEntry: ProcessedBS = {
          ...bsEntry,
          level: bsFormData.level,
          time: bsFormData.time ?? bsEntry.time,
          recordedAt: bsFormData.recordedAt ?? bsEntry.recordedAt,
          timestamp: bsFormData.timestamp ?? bsEntry.timestamp,
        };

        onSave(updatedEntry);
      }
    }
    onClose();
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
  };

  // Helper functions to map values to gauge positions
  const getBPGaugeValue = (): number => {
    if (isProcessedBP(entry)) {
      const systolic = bpFormData.systolic ?? entry.systolic;
      const diastolic = bpFormData.diastolic ?? entry.diastolic;
      const category = getBloodPressureCategory(systolic, diastolic);
      return mapBloodPressureCategoryToGaugeValue(category);
    }
    return 0;
  };

  const getBSGaugeValue = (): number => {
    if (!isProcessedBP(entry)) {
      const bsEntry = entry as ProcessedBS;
      const level = bsFormData.level ?? bsEntry.level;
      const category = getBloodSugarCategory(level);
      return mapBloodSugarCategoryToGaugeValue(category);
    }
    return 0;
  };

  // Determine if current state is invalid
  const isInvalid =
    (isProcessedBP(entry) &&
      (statusInfo?.status === 'Invalid' ||
        statusInfo?.status === 'Bạn chưa nhập dữ liệu huyết áp')) ||
    (!isProcessedBP(entry) &&
      (statusInfo?.status === 'Invalid' ||
        statusInfo?.status === 'Bạn chưa nhập dữ liệu đường huyết'));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      aria-labelledby='edit-entry-dialog-title'
    >
      <DialogTitle id='edit-entry-dialog-title'>
        Sửa chỉ số {isProcessedBP(entry) ? 'Huyết Áp' : 'Đường Huyết'}
      </DialogTitle>
      <DialogContent>
        {/* Gauge Section */}
        <Box sx={{ mb: 3 }}>
          <LinearGauge
            segments={
              isProcessedBP(entry) ? bloodPressureSegments : bloodSugarSegments
            }
            currentValue={
              isProcessedBP(entry) ? getBPGaugeValue() : getBSGaugeValue()
            }
            isBlurred={isInvalid}
          />
        </Box>

        {/* Status Information */}
        {statusInfo &&
          statusInfo.status !== 'Bạn chưa nhập dữ liệu huyết áp' &&
          statusInfo.status !== 'Bạn chưa nhập dữ liệu đường huyết' && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                backgroundColor: `${statusInfo.color}20`, // Adding transparency
                border: `1px solid ${statusInfo.color}`,
              }}
            >
              <Typography variant='h6' color={statusInfo.color}>
                {statusInfo.status}
              </Typography>
            </Box>
          )}

        {/* Form Fields */}
        <Grid container spacing={2}>
          {isProcessedBP(entry) ? (
            <>
              <Grid item xs={6}>
                <TextField
                  label='Systolic (mmHg)'
                  name='systolic'
                  type='number'
                  value={
                    bpFormData.systolic !== undefined ? bpFormData.systolic : ''
                  }
                  onChange={handleBpChange}
                  fullWidth
                  required
                  error={!!bpErrors.systolic}
                  helperText={bpErrors.systolic}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label='Diastolic (mmHg)'
                  name='diastolic'
                  type='number'
                  value={
                    bpFormData.diastolic !== undefined
                      ? bpFormData.diastolic
                      : ''
                  }
                  onChange={handleBpChange}
                  fullWidth
                  required
                  error={!!bpErrors.diastolic}
                  helperText={bpErrors.diastolic}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Nhịp tim (bpm)'
                  name='pulse'
                  type='number'
                  value={bpFormData.pulse !== undefined ? bpFormData.pulse : ''}
                  onChange={handleBpChange}
                  fullWidth
                  error={!!bpErrors.pulse}
                  helperText={bpErrors.pulse}
                  inputProps={{ min: 30, max: 200 }}
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <TextField
                label='Đường huyết (mg/dL)'
                name='level'
                type='number'
                value={bsFormData.level !== undefined ? bsFormData.level : ''}
                onChange={handleBsChange}
                fullWidth
                required
                error={!!bsErrors.level}
                helperText={bsErrors.level}
                inputProps={{ min: 1 }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Huỷ
        </Button>
        <Button onClick={handleSubmit} color='primary' variant='contained'>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEntryModal;
