import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown, Equalizer } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
  loading = false,
}) => {
  const getColor = () => {
    switch (color) {
      case 'primary': return '#1976d2';
      case 'secondary': return '#9c27b0';
      case 'success': return '#2e7d32';
      case 'error': return '#d32f2f';
      case 'info': return '#0288d1';
      case 'warning': return '#ed6c02';
      default: return '#1976d2';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: '#2e7d32', fontSize: 16 }} />;
      case 'down': return <TrendingDown sx={{ color: '#d32f2f', fontSize: 16 }} />;
      case 'neutral': return <Equalizer sx={{ color: '#757575', fontSize: 16 }} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${getColor()}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {icon && (
              <Box sx={{ 
                color: getColor(),
                mb: 1 
              }}>
                {icon}
              </Box>
            )}
            {getTrendIcon()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;