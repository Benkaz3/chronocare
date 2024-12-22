import React from 'react';
import GaugeComponent from 'react-gauge-component';

interface BloodPressureGaugeProps {
  systolic: number;
  statusColors: {
    normal: string;
    elevated: string;
    hypertensionStage1: string;
    hypertensionStage2: string;
    hypertensiveCrisis: string;
  };
}

const BloodPressureGauge: React.FC<BloodPressureGaugeProps> = ({
  systolic,
  statusColors,
}) => (
  <GaugeComponent
    type='semicircle'
    arc={{
      width: 0.2,
      padding: 0.005,
      cornerRadius: 1,
      subArcs: [
        { limit: 120, color: statusColors.normal },
        { limit: 130, color: statusColors.elevated },
        { limit: 140, color: statusColors.hypertensionStage1 },
        { limit: 160, color: statusColors.hypertensionStage2 },
        { color: statusColors.hypertensiveCrisis },
      ],
    }}
    pointer={{
      color: '#345243',
      length: 0.8,
      width: 15,
      elastic: true,
    }}
    labels={{
      tickLabels: {
        type: 'outer',
        defaultTickValueConfig: { formatTextValue: (value) => value },
        ticks: [{ value: 60 }, { value: 120 }, { value: 180 }],
      },
    }}
    value={systolic}
    minValue={60}
    maxValue={180}
  />
);

export default BloodPressureGauge;
