import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

import { adminService } from '../services/adminService';
import StatsCard from '../../../components/StatsCard';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import Heading, { SubHeading } from '../../../components/Heading';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => adminService.getMetrics(),
  });

  if (isLoading) return <Loading message="Loading system metrics and operational analytics..." />;
  if (isError || !data) return <ErrorState title="Failed to load metrics" onRetry={refetch} />;

  const { metrics, popularDestinations = [], recentUsers = [], bookingsByType = {} } = data;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Heading badge="Admin Analytics">System Dashboard</Heading>
        <SubHeading>
          High-level operational overview of platform users, active trips, confirmed bookings, and catalog statistics.
        </SubHeading>
      </Box>

      {/* Top Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TOTAL REGISTERED USERS"
            value={metrics.totalUsers}
            subtitle={`${metrics.activeUsers} Active Accounts`}
            icon={<PeopleAltOutlinedIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TOTAL TRIPS CREATED"
            value={metrics.totalTrips}
            subtitle={`${metrics.upcomingTrips} Upcoming Trips`}
            icon={<LuggageOutlinedIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="CONFIRMED BOOKINGS"
            value={metrics.totalBookings}
            subtitle="Across flights, hotels & transit"
            icon={<ConfirmationNumberOutlinedIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TOTAL BOOKING VALUE"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle="Gross reservation value"
            icon={<AccountBalanceWalletOutlinedIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Popular Destinations & Bookings breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Popular Destinations */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              🔥 Most Popular Destinations
            </Typography>
            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Destination</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Reviews</TableCell>
                  <TableCell align="right">Starting Budget</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {popularDestinations.map((dest: any) => (
                  <TableRow key={dest.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={dest.coverImage} variant="rounded" sx={{ width: 36, height: 36 }} />
                        {dest.name}
                      </Box>
                    </TableCell>
                    <TableCell>{dest.country}</TableCell>
                    <TableCell>★ {Number(dest.rating).toFixed(1)}</TableCell>
                    <TableCell>{dest.reviewCount}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {formatCurrency(dest.startingBudget)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Bookings by Type */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3.5, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              📊 Bookings Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {Object.entries(bookingsByType).map(([type, count]: any) => (
                <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" fontWeight={600}>{type}</Typography>
                  <Chip label={`${count} Bookings`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Users Table */}
      <Paper sx={{ p: 3, borderRadius: 3.5 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          👤 Recent User Registrations
        </Typography>
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Joined Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentUsers.map((u: any) => (
              <TableRow key={u.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>
                  {u.firstName} {u.lastName}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip label={u.role} size="small" color={u.role === 'ADMIN' ? 'secondary' : 'default'} sx={{ fontWeight: 700 }} />
                </TableCell>
                <TableCell>
                  <Chip label={u.isActive ? 'Active' : 'Inactive'} size="small" color={u.isActive ? 'success' : 'error'} variant="outlined" />
                </TableCell>
                <TableCell align="right">{formatDate(u.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
export default AdminDashboardPage;
