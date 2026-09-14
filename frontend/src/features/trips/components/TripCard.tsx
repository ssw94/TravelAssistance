import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import { Trip, TripStatus } from '../../../types';
import { formatDate, formatCurrency, getDaysDuration } from '../../../utils/formatters';

export interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const duration = getDaysDuration(trip.startDate, trip.endDate);

  const statusColorMap: Record<TripStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default'> = {
    [TripStatus.PLANNING]: 'warning',
    [TripStatus.CONFIRMED]: 'primary',
    [TripStatus.ONGOING]: 'success',
    [TripStatus.COMPLETED]: 'default',
    [TripStatus.CANCELLED]: 'error',
  };

  const totalSpent = (trip.expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
  const totalBudget = Number(trip.budget) || 0;
  const budgetProgress = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  return (
    <Card
      component={Link}
      to={`/trips/${trip.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 16px 32px -4px rgba(2, 132, 199, 0.15)'
              : '0 16px 32px -4px rgba(0, 0, 0, 0.7)',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={trip.coverImageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
          alt={trip.name}
        />
        <Chip
          label={trip.status}
          size="small"
          color={statusColorMap[trip.status]}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 800,
            fontSize: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        />
        <Chip
          label={`${duration} Days`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            bgcolor: 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            fontWeight: 700,
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="caption" fontWeight={600} noWrap>
            {trip.destination}
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={800} sx={{ mb: 1, lineHeight: 1.3 }}>
          {trip.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={500}>
              {formatDate(trip.startDate, 'DD MMM')} - {formatDate(trip.endDate, 'DD MMM YYYY')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={500}>
              {trip.numberOfTravelers} {trip.numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}
            </Typography>
          </Box>
        </Box>

        {/* Budget Progress Bar */}
        {totalBudget > 0 && (
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Budget: {formatCurrency(totalSpent, trip.currency)} spent
              </Typography>
              <Typography variant="caption" fontWeight={700} color="primary.main">
                {formatCurrency(totalBudget, trip.currency)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={budgetProgress}
              color={budgetProgress > 90 ? 'error' : 'primary'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default TripCard;
