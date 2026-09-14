import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Divider,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';

import { tripService } from '../services/tripService';
import { itineraryService } from '../../itinerary/services/itineraryService';
import { bookingService } from '../../bookings/services/bookingService';
import { expenseService } from '../../expenses/services/expenseService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { formatDate, formatCurrency, getDaysDuration } from '../../../utils/formatters';
import { TripStatus, ActivityType, BookingType, ExpenseCategory } from '../../../types';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const [addBookingModalOpen, setAddBookingModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);

  // Queries
  const { data: trip, isLoading, isError, refetch } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getById(id!),
    enabled: !!id,
  });

  const { data: summary } = useQuery({
    queryKey: ['tripSummary', id],
    queryFn: () => tripService.getSummary(id!),
    enabled: !!id,
  });

  const { data: expenseBreakdown } = useQuery({
    queryKey: ['tripExpenseBreakdown', id],
    queryFn: () => expenseService.getTripBreakdown(id!),
    enabled: !!id,
  });

  // Mutations
  const toggleActivityCompleteMutation = useMutation({
    mutationFn: (itemId: string) => itineraryService.toggleComplete(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      queryClient.invalidateQueries({ queryKey: ['tripSummary', id] });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (itemId: string) => itineraryService.deleteItem(itemId),
    onSuccess: () => {
      dispatch(showToast({ message: 'Activity deleted', severity: 'info' }));
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
    },
  });

  const updateTripStatusMutation = useMutation({
    mutationFn: (status: TripStatus) => tripService.update(id!, { status }),
    onSuccess: (_, status) => {
      dispatch(showToast({ message: `Trip status updated to ${status}`, severity: 'success' }));
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      setStatusMenuAnchor(null);
    },
  });

  // Activity Formik
  const activityFormik = useFormik({
    initialValues: {
      startTime: '10:00',
      endTime: '12:00',
      title: '',
      description: '',
      type: ActivityType.SIGHTSEEING,
      location: '',
      transportation: 'Taxi / Cab',
      estimatedCost: 500,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Activity title is required'),
      startTime: Yup.string().required('Start time is required'),
      estimatedCost: Yup.number().min(0),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!selectedDayId) return;
      try {
        await itineraryService.addItem(selectedDayId, values);
        dispatch(showToast({ message: 'Activity added to itinerary! 🎯', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['trip', id] });
        resetForm();
        setAddActivityModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to add activity', severity: 'error' }));
      }
    },
  });

  // Booking Formik
  const bookingFormik = useFormik({
    initialValues: {
      bookingType: BookingType.HOTEL,
      title: '',
      provider: '',
      confirmationNumber: '',
      startDateTime: trip?.startDate ? `${trip.startDate}T12:00:00Z` : '',
      cost: 5000,
      notes: '',
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await bookingService.create({ ...values, tripId: id });
        dispatch(showToast({ message: 'Booking record created! 🎫', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['trip', id] });
        resetForm();
        setAddBookingModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to create booking', severity: 'error' }));
      }
    },
  });

  // Expense Formik
  const expenseFormik = useFormik({
    initialValues: {
      title: '',
      amount: 1500,
      category: ExpenseCategory.FOOD,
      date: trip?.startDate || new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: '',
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await expenseService.create({ ...values, tripId: id });
        dispatch(showToast({ message: 'Expense logged successfully! 💰', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['trip', id] });
        queryClient.invalidateQueries({ queryKey: ['tripExpenseBreakdown', id] });
        resetForm();
        setAddExpenseModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to log expense', severity: 'error' }));
      }
    },
  });

  const handleDeleteTrip = async () => {
    try {
      await tripService.delete(id!);
      dispatch(showToast({ message: 'Trip deleted', severity: 'info' }));
      navigate('/trips');
    } catch {
      dispatch(showToast({ message: 'Failed to delete trip', severity: 'error' }));
    }
  };

  if (isLoading) return <Loading message="Loading trip overview & itinerary..." />;
  if (isError || !trip) return <ErrorState title="Trip Not Found" onRetry={refetch} />;

  const duration = getDaysDuration(trip.startDate, trip.endDate);
  const totalBudget = Number(trip.budget) || 0;
  const totalSpent = summary?.totalSpent || 0;
  const remainingBudget = summary?.remainingBudget || Math.max(0, totalBudget - totalSpent);
  const budgetProgress = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  return (
    <Box>
      {/* Trip Hero Card */}
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)'
              : 'linear-gradient(135deg, #111827 0%, #0c192e 100%)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                label={trip.status}
                color={trip.status === TripStatus.CONFIRMED ? 'primary' : (trip.status === TripStatus.ONGOING ? 'success' : 'warning')}
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <Chip
                label={`${duration} Days`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label={trip.travelStyle}
                size="small"
                variant="outlined"
                color="secondary"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>
              {trip.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap', color: 'text.secondary', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <LocationOnOutlinedIcon color="primary" fontSize="small" />
                <Typography variant="body2" fontWeight={600}>{trip.destination}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CalendarTodayOutlinedIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <PeopleAltOutlinedIcon color="action" fontSize="small" />
                <Typography variant="body2">{trip.numberOfTravelers} Travelers</Typography>
              </Box>
            </Box>

            {trip.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: 600 }}>
                &ldquo;{trip.notes}&rdquo;
              </Typography>
            )}
          </Grid>

          {/* Quick Actions & Budget Widget */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Budget Tracking
                </Typography>
                <Typography variant="caption" fontWeight={700} color={budgetProgress > 90 ? 'error.main' : 'primary.main'}>
                  {budgetProgress}% used
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={budgetProgress}
                color={budgetProgress > 90 ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Planned</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>{formatCurrency(totalBudget, trip.currency)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Spent</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="error.main">{formatCurrency(totalSpent, trip.currency)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Remaining</Typography>
                  <Typography variant="subtitle2" fontWeight={800} color="success.main">{formatCurrency(remainingBudget, trip.currency)}</Typography>
                </Grid>
              </Grid>

              {/* Status change and delete buttons */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                >
                  Change Status: {trip.status}
                </Button>
                <IconButton color="error" size="small" onClick={() => setDeleteDialogOpen(true)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>

              <Menu
                anchorEl={statusMenuAnchor}
                open={Boolean(statusMenuAnchor)}
                onClose={() => setStatusMenuAnchor(null)}
              >
                {Object.values(TripStatus).map((st) => (
                  <MenuItem key={st} onClick={() => updateTripStatusMutation.mutate(st)}>
                    <ListItemText>{st}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Tabs for Itinerary, Bookings, Expenses */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<LuggageOutlinedIcon />} iconPosition="start" label="Day-by-Day Itinerary" />
          <Tab icon={<ConfirmationNumberOutlinedIcon />} iconPosition="start" label={`Bookings (${trip.bookings?.length || 0})`} />
          <Tab icon={<AccountBalanceWalletOutlinedIcon />} iconPosition="start" label="Budget & Expenses" />
        </Tabs>
      </Paper>

      {/* Tab 0: Itinerary Builder */}
      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {trip.itineraryDays?.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No itinerary days found for this trip.
            </Typography>
          ) : (
            trip.itineraryDays?.map((day) => (
              <Card key={day.id} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Day Header */}
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: (t) => (t.palette.mode === 'light' ? '#f8fafc' : '#1e293b'),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip
                      label={`Day ${day.dayNumber}`}
                      color="primary"
                      sx={{ fontWeight: 800, borderRadius: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {day.title || `Day ${day.dayNumber}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(day.date, 'dddd, DD MMMM YYYY')} {day.summary ? `• ${day.summary}` : ''}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => {
                      setSelectedDayId(day.id);
                      setAddActivityModalOpen(true);
                    }}
                  >
                    Add Activity
                  </Button>
                </Box>

                {/* Day Activities List */}
                <CardContent sx={{ p: 2.5 }}>
                  {(!day.items || day.items.length === 0) ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
                      No activities planned for this day yet. Click &ldquo;Add Activity&rdquo; to schedule sightseeings, meals, or reservations!
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {day.items.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                            bgcolor: item.isCompleted
                              ? (t) => (t.palette.mode === 'light' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)')
                              : (t) => (t.palette.mode === 'light' ? '#ffffff' : '#111827'),
                            border: (t) => `1px solid ${item.isCompleted ? t.palette.success.light : t.palette.divider}`,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 280 }}>
                            <Checkbox
                              checked={item.isCompleted}
                              onChange={() => toggleActivityCompleteMutation.mutate(item.id)}
                              icon={<RadioButtonUncheckedRoundedIcon />}
                              checkedIcon={<CheckCircleRoundedIcon color="success" />}
                            />

                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3, flexWrap: 'wrap' }}>
                                <Chip
                                  label={item.startTime}
                                  size="small"
                                  color="secondary"
                                  sx={{ fontWeight: 700, height: 22, fontSize: '0.7rem' }}
                                />
                                <Chip
                                  label={item.type}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 22, fontSize: '0.7rem' }}
                                />
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                  sx={{
                                    textDecoration: item.isCompleted ? 'line-through' : 'none',
                                    color: item.isCompleted ? 'text.secondary' : 'text.primary',
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              </Box>

                              {item.description && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {item.description}
                                </Typography>
                              )}

                              <Box sx={{ display: 'flex', gap: 2, mt: 0.5, color: 'text.secondary' }}>
                                {item.location && (
                                  <Typography variant="caption">📍 {item.location}</Typography>
                                )}
                                {item.transportation && (
                                  <Typography variant="caption">🚗 {item.transportation}</Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>

                          {/* Cost and delete action */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {Number(item.estimatedCost) > 0 && (
                              <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                {formatCurrency(item.estimatedCost, trip.currency)}
                              </Typography>
                            )}

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteActivityMutation.mutate(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Tab 1: Bookings */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Trip Bookings & Reservations
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setAddBookingModalOpen(true)}
            >
              Add Booking
            </Button>
          </Box>

          {(!trip.bookings || trip.bookings.length === 0) ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No bookings recorded for this trip yet. Click &ldquo;Add Booking&rdquo; to track flight tickets, hotel vouchers, or car rentals.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {trip.bookings.map((booking) => (
                <Grid item key={booking.id} xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={booking.bookingType} size="small" color="primary" sx={{ fontWeight: 700 }} />
                        <Typography variant="subtitle1" fontWeight={700}>
                          {booking.title}
                        </Typography>
                      </Box>
                      <Chip label={booking.status} size="small" variant="outlined" color="success" />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Provider: <strong>{booking.provider}</strong>
                    </Typography>
                    {booking.confirmationNumber && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confirmation Code: <strong>{booking.confirmationNumber}</strong>
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                      Date: {formatDate(booking.startDateTime, 'DD MMM YYYY, hh:mm A')}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Total Cost</Typography>
                      <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        {formatCurrency(booking.cost, booking.currency)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Tab 2: Expenses & Budget */}
      {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Logged Expenses & Spending Breakdown
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setAddExpenseModalOpen(true)}
            >
              Add Expense
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Category Breakdown Cards */}
            {expenseBreakdown?.categoryBreakdown &&
              Object.entries(expenseBreakdown.categoryBreakdown).map(([cat, val]: any) => {
                if (val.amount === 0) return null;
                return (
                  <Grid item key={cat} xs={6} sm={4} md={3}>
                    <Card variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                        {cat}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        {formatCurrency(val.amount, trip.currency)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {val.percentage}% of total spent ({val.count} items)
                      </Typography>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>

          {/* Expenses Table/List */}
          {(!trip.expenses || trip.expenses.length === 0) ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No expenses recorded yet.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {trip.expenses.map((exp) => (
                <Card key={exp.id} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={exp.category} size="small" variant="outlined" />
                      <Typography variant="subtitle2" fontWeight={700}>
                        {exp.title}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(exp.date)} {exp.paymentMethod ? `• Paid via ${exp.paymentMethod}` : ''}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} color="error.main">
                    -{formatCurrency(exp.amount, exp.currency)}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Add Activity Modal */}
      <Modal
        open={addActivityModalOpen}
        onClose={() => setAddActivityModalOpen(false)}
        title="Add Activity to Itinerary"
        subtitle="Schedule a sightseeing spot, meal, or transit"
      >
        <form onSubmit={activityFormik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input
              id="title"
              name="title"
              label="Activity Title"
              placeholder="e.g. Scuba Diving at Grand Island"
              value={activityFormik.values.title}
              onChange={activityFormik.handleChange}
              onBlur={activityFormik.handleBlur}
              error={activityFormik.touched.title && activityFormik.errors.title}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="startTime"
                  name="startTime"
                  label="Start Time"
                  placeholder="09:00"
                  value={activityFormik.values.startTime}
                  onChange={activityFormik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="endTime"
                  name="endTime"
                  label="End Time"
                  placeholder="12:00"
                  value={activityFormik.values.endTime}
                  onChange={activityFormik.handleChange}
                />
              </Grid>
            </Grid>

            <Select
              id="type"
              name="type"
              label="Activity Type"
              options={Object.values(ActivityType).map((t) => ({ value: t, label: t }))}
              value={activityFormik.values.type}
              onChange={activityFormik.handleChange}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="location"
                  name="location"
                  label="Location"
                  placeholder="e.g. Grand Island Beach"
                  value={activityFormik.values.location}
                  onChange={activityFormik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="transportation"
                  name="transportation"
                  label="Transportation"
                  placeholder="e.g. Boat transfer / Taxi"
                  value={activityFormik.values.transportation}
                  onChange={activityFormik.handleChange}
                />
              </Grid>
            </Grid>

            <Input
              id="estimatedCost"
              name="estimatedCost"
              label="Estimated Cost"
              type="number"
              value={activityFormik.values.estimatedCost}
              onChange={activityFormik.handleChange}
            />

            <Input
              id="description"
              name="description"
              label="Description & Tips"
              multiline
              rows={2}
              placeholder="Bring swimwear, towels, and waterproof camera..."
              value={activityFormik.values.description}
              onChange={activityFormik.handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setAddActivityModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add to Itinerary
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Add Booking Modal */}
      <Modal
        open={addBookingModalOpen}
        onClose={() => setAddBookingModalOpen(false)}
        title="Add Booking Record"
      >
        <form onSubmit={bookingFormik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Select
              id="bookingType"
              name="bookingType"
              label="Booking Type"
              options={Object.values(BookingType).map((t) => ({ value: t, label: t }))}
              value={bookingFormik.values.bookingType}
              onChange={bookingFormik.handleChange}
            />

            <Input
              id="title"
              name="title"
              label="Booking Title"
              placeholder="e.g. Indigo Flight BOM -> GOI"
              value={bookingFormik.values.title}
              onChange={bookingFormik.handleChange}
            />

            <Input
              id="provider"
              name="provider"
              label="Provider / Agent"
              placeholder="e.g. MakeMyTrip / IndiGo"
              value={bookingFormik.values.provider}
              onChange={bookingFormik.handleChange}
            />

            <Input
              id="confirmationNumber"
              name="confirmationNumber"
              label="Confirmation Code"
              placeholder="e.g. PNR-98124"
              value={bookingFormik.values.confirmationNumber}
              onChange={bookingFormik.handleChange}
            />

            <Input
              id="cost"
              name="cost"
              label="Cost"
              type="number"
              value={bookingFormik.values.cost}
              onChange={bookingFormik.handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setAddBookingModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Booking
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        open={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        title="Log New Expense"
      >
        <form onSubmit={expenseFormik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input
              id="title"
              name="title"
              label="Expense Description"
              placeholder="e.g. Seafood Dinner at Martin's Corner"
              value={expenseFormik.values.title}
              onChange={expenseFormik.handleChange}
            />

            <Input
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              value={expenseFormik.values.amount}
              onChange={expenseFormik.handleChange}
            />

            <Select
              id="category"
              name="category"
              label="Expense Category"
              options={Object.values(ExpenseCategory).map((c) => ({ value: c, label: c }))}
              value={expenseFormik.values.category}
              onChange={expenseFormik.handleChange}
            />

            <Input
              id="paymentMethod"
              name="paymentMethod"
              label="Payment Method"
              placeholder="e.g. Credit Card / UPI / Cash"
              value={expenseFormik.values.paymentMethod}
              onChange={expenseFormik.handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setAddExpenseModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Record Expense
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete this Trip?"
        message="Are you sure you want to delete this trip and its entire day-by-day itinerary? This action cannot be undone."
        confirmText="Delete Trip"
        confirmColor="error"
        onConfirm={handleDeleteTrip}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};
export default TripDetailPage;
