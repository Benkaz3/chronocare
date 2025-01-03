import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';

export interface GaugeSegment<TLabel extends React.ReactNode> {
  label: TLabel;
  value: number; // Represents the range size on the gauge (for cumulative calculation)
  color: string;
}

export interface LinearGaugeProps<TLabel extends React.ReactNode> {
  segments: GaugeSegment<TLabel>[];
  currentValue: number | null; // Accepts null when there's no valid value
  isBlurred?: boolean;
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

const Heart = styled(FavoriteIcon)(({ theme }) => ({
  position: 'absolute',
  top: '5px',
  transform: 'translateX(-50%)',
  transition: 'left 0.5s ease',
  zIndex: 2,
  fontSize: '24px',
  color: theme.palette.error.main,
}));

const LinearGauge = <TLabel extends React.ReactNode>({
  segments,
  currentValue,
  isBlurred = false,
}: LinearGaugeProps<TLabel>) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = 100; // Gauge range is 1-100

  // Clamp currentValue between 0 and 100, if currentValue is not null
  const clampedValue =
    currentValue !== null ? Math.min(Math.max(currentValue, 0), total) : null;

  // Calculate the position percentage of the current value
  const positionPercentage = clampedValue !== null ? clampedValue / total : 0;

  useEffect(() => {
    if (currentValue !== null) {
      setIsTransitioning(true);
    }
  }, [currentValue]); // Include currentValue in the dependency array

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <GaugeContainer
      sx={{
        filter: isBlurred ? 'blur(4px)' : 'none', // Apply blur effect when isBlurred is true
      }}
    >
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
      {clampedValue !== null && !isBlurred && (
        <Heart sx={{ left: `${positionPercentage * 100}%` }} />
      )}
    </GaugeContainer>
  );
};

export default LinearGauge;
