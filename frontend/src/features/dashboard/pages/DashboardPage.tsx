import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { tripService } from '../../trips/services/tripService';
import { destinationService } from '../../destinations/services/destinationService';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { toggleChatDrawer } from '../../../store/slices/uiSlice';
import { formatDate, formatCurrency, getDaysDuration } from '../../../utils/formatters';
import DestinationCard from '../../destinations/components/DestinationCard';
import Loading from '../../../components/Loading';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { data: trips = [], isLoading: tripsLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getAll(),
  });

  const { data: recommended = [], isLoading: recLoading } = useQuery({
    queryKey: ['recommendedDestinations'],
    queryFn: () => destinationService.getRecommended(4),
  });

  const upcomingTrip = trips.length > 0 ? trips[0] : null;

  // Calculate global budget stats
  const totalPlannedBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);
  const totalExpensesSpent = trips.reduce(
    (sum, t) => sum + (t.expenses || []).reduce((eSum, exp) => eSum + Number(exp.amount || 0), 0),
    0,
  );

  return (
    <Box>
      {/* Welcome & Quick Search Banner */}
      <Paper
        sx={{
          p: { xs: 3, md: 4.5 },
          borderRadius: 4,
          mb: 4,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
              : 'linear-gradient(135deg, #0f2b48 0%, #0a192f 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 36px -8px rgba(2, 132, 199, 0.4)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Chip
              label="Welcome Back Explorer"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 700, mb: 1.5 }}
            />
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>
              Where would you like to travel, {user?.firstName || 'Traveler'}?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 550, mb: 3 }}>
              Discover curated destinations, craft day-by-day itineraries, track your budget, or let our AI assistant plan your next trip in seconds.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/destinations"
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<ExploreOutlinedIcon />}
                sx={{ fontWeight: 700, px: 3 }}
              >
                Discover Places
              </Button>
              <Button
                onClick={() => dispatch(toggleChatDrawer())}
                variant="outlined"
                sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.6)', fontWeight: 600 }}
                startIcon={<SmartToyOutlinedIcon />}
              >
                Ask AI Assistant
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Dashboard Grid */}
      <Grid container spacing={4}>
        {/* Left: Upcoming Trip & Trips Summary */}
        <Grid item xs={12} md={7} lg={8}>
          {/* Upcoming Trip Card */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={800}>
                Upcoming Trip
              </Typography>
              <Button component={Link} to="/trips" size="small" endIcon={<ArrowForwardIcon />}>
                View All ({trips.length})
              </Button>
            </Box>

            {tripsLoading ? (
              <Loading minHeight={200} />
            ) : upcomingTrip ? (
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  borderRadius: 3.5,
                  overflow: 'hidden',
                  bgcolor: (t) => (t.palette.mode === 'light' ? '#ffffff' : '#111827'),
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: { xs: '100%', sm: 240 }, height: { xs: 180, sm: 'auto' } }}
                  image={upcomingTrip.coverImageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'}
                  alt={upcomingTrip.name}
                />
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Chip label={upcomingTrip.status} size="small" color="primary" sx={{ fontWeight: 700, mb: 0.5 }} />
                      <Typography variant="h5" fontWeight={800}>
                        {upcomingTrip.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayOutlinedIcon fontSize="small" />
                    {formatDate(upcomingTrip.startDate)} - {formatDate(upcomingTrip.endDate)} ({getDaysDuration(upcomingTrip.startDate, upcomingTrip.endDate)} Days)
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    📍 Destination: <strong>{upcomingTrip.destination}</strong> • {upcomingTrip.numberOfTravelers} Travelers
                  </Typography>

                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Budget</Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        {formatCurrency(upcomingTrip.budget, upcomingTrip.currency)}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      to={`/trips/${upcomingTrip.id}`}
                      variant="contained"
                      color="primary"
                    >
                      View Itinerary
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <LuggageOutlinedIcon color="primary" sx={{ fontSize: 44, mb: 1 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  No upcoming trips scheduled
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  Plan your next vacation or ask our AI assistant to generate a day-by-day itinerary.
                </Typography>
                <Button component={Link} to="/trips?newTrip=true" variant="contained" color="primary" startIcon={<AddCircleOutlineIcon />}>
                  Create Trip
                </Button>
              </Paper>
            )}
          </Box>

          {/* Quick Trips Chips */}
          {trips.length > 1 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                Your Travel Destinations:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {trips.map((t) => (
                  <Chip
                    key={t.id}
                    label={`📍 ${t.destination}`}
                    onClick={() => navigate(`/trips/${t.id}`)}
                    variant="outlined"
                    sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: 'primary.light', color: 'primary.dark' } }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Recommended Destinations Carousel */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={800}>
                Recommended for You
              </Typography>
              <Button component={Link} to="/destinations" size="small" endIcon={<ArrowForwardIcon />}>
                Explore All
              </Button>
            </Box>

            {recLoading ? (
              <Loading minHeight={200} />
            ) : (
              <Grid container spacing={2.5}>
                {recommended.slice(0, 3).map((dest) => (
                  <Grid item key={dest.id} xs={12} sm={6} md={4}>
                    <DestinationCard destination={dest} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Right Column: Budget Widget, Weather, AI Prompts */}
        <Grid item xs={12} md={5} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Global Budget Overview Widget */}
            <Paper sx={{ p: 3, borderRadius: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <AccountBalanceWalletOutlinedIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Travel Budget Summary
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Total Planned</Typography>
                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    {formatCurrency(totalPlannedBudget)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">Total Spent</Typography>
                  <Typography variant="h5" fontWeight={800} color="error.main">
                    {formatCurrency(totalExpensesSpent)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 1.5 }} />

              <Button
                component={Link}
                to="/expenses"
                fullWidth
                variant="outlined"
                color="primary"
                size="small"
              >
                View Detailed Expenses
              </Button>
            </Paper>

            {/* AI Assistant Quick Prompt Box */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3.5,
                background: (t) =>
                  t.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)'
                    : 'linear-gradient(135deg, #2a1f0a 0%, #111827 100%)',
                border: '1px solid',
                borderColor: 'secondary.light',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SmartToyOutlinedIcon color="secondary" />
                <Typography variant="h6" fontWeight={800}>
                  AI Travel Assistant
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Instant custom itinerary generation, budget calculation, and packing tips tailored to you.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  label="🌴 Plan a 5-day Goa trip under ₹30,000"
                  size="small"
                  onClick={() => dispatch(toggleChatDrawer())}
                  sx={{ cursor: 'pointer', fontWeight: 600, justifyContent: 'flex-start' }}
                />
                <Chip
                  label="🧳 What to pack for Kerala in December?"
                  size="small"
                  onClick={() => dispatch(toggleChatDrawer())}
                  sx={{ cursor: 'pointer', fontWeight: 600, justifyContent: 'flex-start' }}
                />
                <Chip
                  label="🏰 3-day royal Jaipur itinerary"
                  size="small"
                  onClick={() => dispatch(toggleChatDrawer())}
                  sx={{ cursor: 'pointer', fontWeight: 600, justifyContent: 'flex-start' }}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardPage;
