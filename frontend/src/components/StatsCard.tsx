import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
}) => {
  const colorMap = {
    primary: { bg: 'rgba(2, 132, 199, 0.1)', text: '#0284c7' },
    secondary: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    warning: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316' },
    info: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1' },
  };

  const selectedColor = colorMap[color];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: selectedColor.bg,
              color: selectedColor.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default StatsCard;
