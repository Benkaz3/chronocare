// src/components/LinearGauge.tsx

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react';

export interface GaugeSegment<TLabel extends React.ReactNode> {
  label: TLabel;
  value: number; // Represents the range size on the gauge (for cumulative calculation)
  color: string;
}

export interface LinearGaugeProps<TLabel extends React.ReactNode> {
  segments: GaugeSegment<TLabel>[];
  currentValue: number; // 1 to 100
}

const GaugeContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '80px',
  userSelect: 'none',
  // Disable pointer events to make it non-interactive
  pointerEvents: 'none',
}));

const GaugeSVG = styled('svg')({
  width: '100%',
  height: '100%',
});

const Heart = styled(FavoriteIcon)(() => ({
  position: 'absolute',
  top: '5px',
  transform: 'translateX(-50%)',
  transition: 'left 0.5s ease',
  zIndex: 2,
  fontSize: '24px',
  color: '#DE0D92',
}));

const Label = styled(Typography)({
  position: 'absolute',
  transform: 'translateX(-50%)',
  top: '-20px',
  whiteSpace: 'nowrap',
  zIndex: 3,
});

// Constrain TLabel to extend React.ReactNode
const LinearGauge = <TLabel extends React.ReactNode>({
  segments,
  currentValue,
}: LinearGaugeProps<TLabel>) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = 100; // Gauge range is 1-100

  // Clamp currentValue between 0 and 100
  const clampedValue = Math.min(Math.max(currentValue, 0), total);

  // Calculate the position percentage of the current value
  const positionPercentage = clampedValue / total;

  // Determine the current segment based on currentValue
  let cumulative = 0;
  let currentSegment: GaugeSegment<TLabel> | null = null;
  for (const segment of segments) {
    cumulative += segment.value;
    if (clampedValue <= cumulative) {
      currentSegment = segment;
      break;
    }
  }

  useEffect(() => {
    setIsTransitioning(true);
  }, [clampedValue]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <GaugeContainer>
      <GaugeSVG>
        {segments.map((segment, index) => {
          const startPercentage =
            (segments.slice(0, index).reduce((sum, s) => sum + s.value, 0) /
              total) *
            100;
          const widthPercentage = (segment.value / total) * 100;
          return (
            <rect
              key={index}
              x={`${startPercentage}%`}
              y='40%'
              width={`${widthPercentage}%`}
              height='20%'
              fill={segment.color}
            />
          );
        })}
      </GaugeSVG>
      {/* Heart Needle */}
      <Heart sx={{ left: `${positionPercentage * 100}%` }} />
      {/* Current Label */}
      {currentSegment && !isTransitioning && (
        <Label variant='h6' style={{ left: `${positionPercentage * 100}%` }}>
          {currentSegment.label}
        </Label>
      )}
    </GaugeContainer>
  );
};

export default LinearGauge;
