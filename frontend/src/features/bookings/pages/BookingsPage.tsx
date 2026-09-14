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
  Divider,
  IconButton,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import TrainOutlinedIcon from '@mui/icons-material/TrainOutlined';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';

import { bookingService } from '../services/bookingService';
import { tripService } from '../../trips/services/tripService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { BookingType, BookingStatus } from '../../../types';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import Heading, { SubHeading } from '../../../components/Heading';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useFormik } from 'formik';
import { bookingSchema } from '../../../utils/validationSchemas';

export const BookingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', typeFilter],
    queryFn: () => bookingService.getAll(undefined, typeFilter === 'ALL' ? undefined : typeFilter),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getAll(),
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id: string) => bookingService.delete(id),
    onSuccess: () => {
      dispatch(showToast({ message: 'Booking removed', severity: 'info' }));
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setCancelDialogOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      bookingType: BookingType.HOTEL,
      title: '',
      provider: '',
      confirmationNumber: '',
      startDateTime: new Date().toISOString().slice(0, 16),
      cost: 5000,
      currency: 'INR',
      status: BookingStatus.CONFIRMED,
      tripId: '',
      notes: '',
    },
    validationSchema: bookingSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await bookingService.create(values);
        dispatch(showToast({ message: 'Booking record added successfully! 🎫', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        resetForm();
        setAddModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to add booking', severity: 'error' }));
      }
    },
  });

  const getTypeIcon = (type: BookingType) => {
    switch (type) {
      case BookingType.FLIGHT: return <FlightOutlinedIcon color="primary" />;
      case BookingType.HOTEL: return <HotelOutlinedIcon color="secondary" />;
      case BookingType.TRAIN: return <TrainOutlinedIcon color="info" />;
      case BookingType.BUS: return <DirectionsBusOutlinedIcon color="warning" />;
      case BookingType.CAR_RENTAL: return <DirectionsCarOutlinedIcon color="success" />;
      default: return <LocalActivityOutlinedIcon color="primary" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Heading badge={`${bookings.length} Bookings`}>Reservations & Bookings</Heading>
          <SubHeading>
            Consolidate your flight tickets, hotel vouchers, train reservations, and activities in one secure hub.
          </SubHeading>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Add Booking Record
        </Button>
      </Box>

      {/* Type Filter Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={typeFilter}
          onChange={(_, val) => setTypeFilter(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="ALL" label="All Bookings" />
          <Tab value={BookingType.FLIGHT} label="Flights" />
          <Tab value={BookingType.HOTEL} label="Hotels" />
          <Tab value={BookingType.TRAIN} label="Trains" />
          <Tab value={BookingType.BUS} label="Buses" />
          <Tab value={BookingType.CAR_RENTAL} label="Car Rentals" />
          <Tab value={BookingType.ACTIVITY} label="Activities" />
        </Tabs>
      </Paper>

      {/* Bookings Content */}
      {isLoading && <Loading message="Loading booking records..." />}

      {isError && (
        <ErrorState
          title="Could not load bookings"
          message="Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && bookings.length === 0 && (
        <EmptyState
          icon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: 40 }} />}
          title={typeFilter === 'ALL' ? 'No Bookings Recorded Yet' : `No ${typeFilter.toLowerCase()} bookings found`}
          description="Keep all your flight confirmation codes, hotel vouchers, and transport tickets organized together."
          actionText="Add My First Booking"
          onAction={() => setAddModalOpen(true)}
        />
      )}

      {!isLoading && !isError && bookings.length > 0 && (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item key={booking.id} xs={12} sm={6} lg={4}>
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'background.default' }}>
                      {getTypeIcon(booking.bookingType)}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {booking.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Provider: <strong>{booking.provider}</strong>
                      </Typography>
                    </Box>
                  </Box>

                  <Chip label={booking.status} size="small" color={booking.status === BookingStatus.CONFIRMED ? 'success' : 'warning'} variant="outlined" sx={{ fontWeight: 700 }} />
                </Box>

                {booking.confirmationNumber && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Confirmation / PNR: <strong>{booking.confirmationNumber}</strong>
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  📅 Date & Time: {formatDate(booking.startDateTime, 'DD MMM YYYY, hh:mm A')}
                </Typography>

                {booking.trip && (
                  <Chip
                    label={`Trip: ${booking.trip.name}`}
                    size="small"
                    sx={{ width: 'fit-content', mb: 1.5, fontSize: '0.7rem' }}
                  />
                )}

                {booking.notes && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1.5, display: 'block' }}>
                    &ldquo;{booking.notes}&rdquo;
                  </Typography>
                )}

                <Box sx={{ mt: 'auto', pt: 1.5, borderTop: (t) => `1px solid ${t.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Total Cost</Typography>
                    <Typography variant="h6" fontWeight={800} color="primary.main">
                      {formatCurrency(booking.cost, booking.currency)}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      setCancelDialogOpen(true);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Booking Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Booking Record"
        subtitle="Track tickets, vouchers, and reservation details"
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Select
              id="bookingType"
              name="bookingType"
              label="Booking Type"
              options={Object.values(BookingType).map((t) => ({ value: t, label: t }))}
              value={formik.values.bookingType}
              onChange={formik.handleChange}
            />

            <Input
              id="title"
              name="title"
              label="Booking Description"
              placeholder="e.g. Indigo Flight 6E-204 (BOM -> GOI)"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="provider"
                  name="provider"
                  label="Provider / Company"
                  placeholder="e.g. IndiGo / Taj Hotels"
                  value={formik.values.provider}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.provider && formik.errors.provider}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="confirmationNumber"
                  name="confirmationNumber"
                  label="Confirmation / PNR"
                  placeholder="e.g. 6E-GOA-78921"
                  value={formik.values.confirmationNumber}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Input
              id="startDateTime"
              name="startDateTime"
              label="Start Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formik.values.startDateTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDateTime && formik.errors.startDateTime}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="cost"
                  name="cost"
                  label="Cost"
                  type="number"
                  value={formik.values.cost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cost && formik.errors.cost}
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  id="status"
                  name="status"
                  label="Booking Status"
                  options={Object.values(BookingStatus).map((s) => ({ value: s, label: s }))}
                  value={formik.values.status}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            {trips.length > 0 && (
              <Select
                id="tripId"
                name="tripId"
                label="Assign to Trip (Optional)"
                options={[{ value: '', label: 'None (Standalone Booking)' }, ...trips.map((t) => ({ value: t.id, label: t.name }))]}
                value={formik.values.tripId}
                onChange={formik.handleChange}
              />
            )}

            <Input
              id="notes"
              name="notes"
              label="Notes"
              multiline
              rows={2}
              placeholder="Terminal info, seat numbers, check-in instructions..."
              value={formik.values.notes}
              onChange={formik.handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setAddModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Booking Record
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Delete/Cancel Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        title="Remove Booking?"
        message="Are you sure you want to delete this booking record? This action cannot be undone."
        confirmText="Remove"
        onConfirm={() => selectedBookingId && deleteBookingMutation.mutate(selectedBookingId)}
        onCancel={() => setCancelDialogOpen(false)}
      />
    </Box>
  );
};
export default BookingsPage;
