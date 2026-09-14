import React from 'react';
import {
  Box,
  Grid,
  Button,
} from '@mui/material';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

import { tripSchema } from '../../../utils/validationSchemas';
import { tripService } from '../services/tripService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { TravelStyle } from '../../../types';

export interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (tripId: string) => void;
  initialDestination?: string;
}

const TRAVEL_STYLES = [
  { value: TravelStyle.BUDGET, label: 'Budget' },
  { value: TravelStyle.STANDARD, label: 'Standard' },
  { value: TravelStyle.LUXURY, label: 'Luxury' },
  { value: TravelStyle.ADVENTURE, label: 'Adventure' },
  { value: TravelStyle.FAMILY, label: 'Family' },
  { value: TravelStyle.COUPLE, label: 'Couple' },
  { value: TravelStyle.SOLO, label: 'Solo' },
  { value: TravelStyle.BUSINESS, label: 'Business' },
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  open,
  onClose,
  onSuccess,
  initialDestination = '',
}) => {
  const dispatch = useAppDispatch();
  const today = dayjs().format('YYYY-MM-DD');
  const nextWeek = dayjs().add(5, 'day').format('YYYY-MM-DD');

  const formik = useFormik({
    initialValues: {
      name: initialDestination ? `${initialDestination} Vacation` : '',
      destination: initialDestination,
      startDate: today,
      endDate: nextWeek,
      numberOfTravelers: 2,
      travelStyle: TravelStyle.STANDARD,
      budget: 35000,
      currency: 'INR',
      notes: '',
    },
    enableReinitialize: true,
    validationSchema: tripSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const trip = await tripService.create(values);
        dispatch(showToast({ message: `🎉 Trip "${trip.name}" created! Itinerary generated.`, severity: 'success' }));
        onSuccess(trip.id);
        onClose();
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to create trip', severity: 'error' }));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Plan a New Trip"
      subtitle="We will automatically generate day-by-day itinerary days for your dates"
      maxWidth="md"
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Input
            id="name"
            name="name"
            label="Trip Name"
            placeholder="e.g. Exciting Goa Beach Getaway"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            id="destination"
            name="destination"
            label="Destination (City, Country)"
            placeholder="e.g. Goa, India"
            value={formik.values.destination}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.destination && formik.errors.destination}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startDate && formik.errors.startDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endDate && formik.errors.endDate}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input
                id="numberOfTravelers"
                name="numberOfTravelers"
                label="Number of Travelers"
                type="number"
                value={formik.values.numberOfTravelers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numberOfTravelers && formik.errors.numberOfTravelers}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                id="travelStyle"
                name="travelStyle"
                label="Travel Style"
                options={TRAVEL_STYLES}
                value={formik.values.travelStyle}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Input
                id="budget"
                name="budget"
                label="Planned Budget"
                type="number"
                value={formik.values.budget}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.budget && formik.errors.budget}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                id="currency"
                name="currency"
                label="Currency"
                options={[
                  { value: 'INR', label: 'INR (₹)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'JPY', label: 'JPY (¥)' },
                ]}
                value={formik.values.currency}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Input
            id="notes"
            name="notes"
            label="Notes & Preferences"
            multiline
            rows={2}
            placeholder="Focus on beach shacks, seafood dining, photography..."
            value={formik.values.notes}
            onChange={formik.handleChange}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
              Create Trip & Itinerary
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};
export default CreateTripModal;
