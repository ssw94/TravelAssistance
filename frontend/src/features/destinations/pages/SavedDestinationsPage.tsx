import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import Heading, { SubHeading } from '../../../components/Heading';

export const SavedDestinationsPage: React.FC = () => {
  const { data: saved = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['savedDestinations'],
    queryFn: () => destinationService.getSaved(),
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Heading badge={`${saved.length} Saved`}>Wishlist & Saved Destinations</Heading>
        <SubHeading>
          Quick access to destinations you have bookmarked for your future travel plans.
        </SubHeading>
      </Box>

      {isLoading && <Loading message="Retrieving your saved wishlist..." />}

      {isError && (
        <ErrorState
          title="Could not load saved destinations"
          message="Please check your network and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && saved.length === 0 && (
        <EmptyState
          icon={<BookmarkBorderOutlinedIcon sx={{ fontSize: 36 }} />}
          title="Your Wishlist is Empty"
          description="Explore our world catalog and click the bookmark icon on any destination card to save it here."
          actionText="Discover Destinations"
          onAction={() => window.location.href = '/destinations'}
        />
      )}

      {!isLoading && !isError && saved.length > 0 && (
        <Grid container spacing={3}>
          {saved.map((destination) => (
            <Grid item key={destination.id} xs={12} sm={6} md={4} lg={3}>
              <DestinationCard destination={destination} isSaved={true} onBookmarkToggle={() => refetch()} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default SavedDestinationsPage;
