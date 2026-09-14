import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';

import { tripService } from '../services/tripService';
import TripCard from '../components/TripCard';
import CreateTripModal from '../components/CreateTripModal';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import Heading, { SubHeading } from '../../../components/Heading';
import { TripStatus } from '../../../types';

export const TripsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldOpenCreate = searchParams.get('newTrip') === 'true';
  const initialDest = searchParams.get('dest') || '';

  const [createModalOpen, setCreateModalOpen] = useState(shouldOpenCreate);
  const [statusTab, setStatusTab] = useState<string>('ALL');

  const { data: trips = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getAll(),
  });

  const filteredTrips = trips.filter((t) => {
    if (statusTab === 'ALL') return true;
    if (statusTab === 'ACTIVE') return t.status === TripStatus.PLANNING || t.status === TripStatus.CONFIRMED || t.status === TripStatus.ONGOING;
    if (statusTab === 'COMPLETED') return t.status === TripStatus.COMPLETED;
    if (statusTab === 'CANCELLED') return t.status === TripStatus.CANCELLED;
    return true;
  });

  return (
    <Box>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Heading badge={`${trips.length} Total Trips`}>My Trips & Itineraries</Heading>
          <SubHeading>
            Manage your past and upcoming travels, organize day-by-day schedules, and track budgets.
          </SubHeading>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Create New Trip
        </Button>
      </Box>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={statusTab}
          onChange={(_, val) => setStatusTab(val)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="ALL" label={`All Trips (${trips.length})`} />
          <Tab value="ACTIVE" label="Active & Upcoming" />
          <Tab value="COMPLETED" label="Completed" />
          <Tab value="CANCELLED" label="Cancelled" />
        </Tabs>
      </Paper>

      {/* Trips Grid */}
      {isLoading && <Loading message="Loading your trips and itineraries..." />}

      {isError && (
        <ErrorState
          title="Could not load your trips"
          message="Please ensure you are connected and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && filteredTrips.length === 0 && (
        <EmptyState
          icon={<LuggageOutlinedIcon sx={{ fontSize: 40 }} />}
          title={statusTab === 'ALL' ? 'No Trips Created Yet' : `No ${statusTab.toLowerCase()} trips`}
          description="Start planning your dream adventure today. You can build day-by-day schedules and track every expense."
          actionText="Create My First Trip"
          onAction={() => setCreateModalOpen(true)}
        />
      )}

      {!isLoading && !isError && filteredTrips.length > 0 && (
        <Grid container spacing={3}>
          {filteredTrips.map((trip) => (
            <Grid item key={trip.id} xs={12} sm={6} md={4}>
              <TripCard trip={trip} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        initialDestination={initialDest}
        onSuccess={(tripId) => {
          refetch();
          navigate(`/trips/${tripId}`);
        }}
      />
    </Box>
  );
};
export default TripsListPage;
