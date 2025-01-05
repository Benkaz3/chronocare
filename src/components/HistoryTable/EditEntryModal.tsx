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
} from '@mui/material';
import {
  ProcessedBP,
  ProcessedBS,
  BloodPressureData,
  BloodSugarData,
} from '../../types';

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
      } else {
        setBsFormData({
          level: entry.level,
          time: entry.time,
          recordedAt: entry.recordedAt,
          timestamp: entry.timestamp,
        });
        setBsErrors({});
      }
    }
  }, [entry, open]);

  // Handle input changes for Blood Pressure
  const handleBpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['systolic', 'diastolic', 'pulse'];

    setBpFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  // Handle input changes for Blood Sugar
  const handleBsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['level'];

    setBsFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
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

      const updatedEntry: ProcessedBP = {
        ...entry,
        systolic: bpFormData.systolic!,
        diastolic: bpFormData.diastolic!,
        pulse: bpFormData.pulse ?? entry.pulse,
        time: bpFormData.time ?? entry.time,
        recordedAt: bpFormData.recordedAt ?? entry.recordedAt,
        timestamp: bpFormData.timestamp ?? entry.timestamp,
      };

      onSave(updatedEntry);
    } else {
      if (!validateBS()) return;

      const updatedEntry: ProcessedBS = {
        ...entry,
        level: bsFormData.level!,
        time: bsFormData.time ?? entry.time,
        recordedAt: bsFormData.recordedAt ?? entry.recordedAt,
        timestamp: bsFormData.timestamp ?? entry.timestamp,
      };

      onSave(updatedEntry);
    }
    onClose();
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
  };

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
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {isProcessedBP(entry) ? (
            <>
              <Grid item xs={6}>
                <TextField
                  label='Systolic (mmHg)'
                  name='systolic'
                  type='number'
                  value={bpFormData.systolic ?? ''}
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
                  value={bpFormData.diastolic ?? ''}
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
                  value={bpFormData.pulse ?? ''}
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
                value={bsFormData.level ?? ''}
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
