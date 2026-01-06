import React from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';

interface ProgressCircleProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 100,
  thickness = 6,
  label,
  subtitle,
  color = 'primary'
}) => {
  const getColor = () => {
    switch (color) {
      case 'primary': return '#1976d2';
      case 'secondary': return '#9c27b0';
      case 'success': return '#2e7d32';
      case 'error': return '#d32f2f';
      case 'warning': return '#ed6c02';
      case 'info': return '#0288d1';
      default: return '#1976d2';
    }
  };

  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <Tooltip title={`${normalizedValue.toFixed(1)}%`} arrow>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={normalizedValue}
          size={size}
          thickness={thickness}
          sx={{ color: getColor() }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {label ? (
            <Typography variant="h6" component="div" color="text.primary">
              {label}
            </Typography>
          ) : (
            <Typography variant="h6" component="div" color="text.primary">
              {`${normalizedValue.toFixed(0)}%`}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" component="div" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

export default ProgressCircle;