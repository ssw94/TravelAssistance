import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Button,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import DestinationFilters, { FilterState } from '../components/DestinationFilters';
import SearchBar from '../../../components/SearchBar';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import Heading, { SubHeading } from '../../../components/Heading';

export const DestinationDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const travelTypeParam = searchParams.get('travelType') || undefined;
  const trendingOnlyParam = searchParams.get('trendingOnly') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('rating');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [filters, setFilters] = useState<FilterState>({
    travelType: travelTypeParam,
    trendingOnly: trendingOnlyParam,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['destinations', page, searchQuery, sortBy, order, filters],
    queryFn: () =>
      destinationService.getAll({
        page,
        limit: 9,
        search: searchQuery || undefined,
        country: filters.country,
        travelType: filters.travelType,
        season: filters.season,
        maxBudget: filters.maxBudget,
        minRating: filters.minRating,
        trendingOnly: filters.trendingOnly,
        sortBy,
        order,
      }),
  });

  const handleSortChange = (event: any) => {
    const val = event.target.value;
    if (val === 'budget_asc') {
      setSortBy('startingBudget');
      setOrder('ASC');
    } else if (val === 'budget_desc') {
      setSortBy('startingBudget');
      setOrder('DESC');
    } else if (val === 'rating') {
      setSortBy('rating');
      setOrder('DESC');
    } else {
      setSortBy('name');
      setOrder('ASC');
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  return (
    <Box>
      {/* Header Banner */}
      <Box sx={{ mb: 4 }}>
        <Heading badge="Global Catalog">Discover Destinations</Heading>
        <SubHeading>
          Explore world-renowned destinations, golden coastlines, cultural wonders, and mountain retreats with realistic cost estimates.
        </SubHeading>

        {/* Search & Sort Controls */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7} lg={8}>
            <SearchBar
              value={searchQuery}
              onSearch={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              placeholder="Search by city, country, attractions, or vibe (e.g. Goa, Paris, temples, surfing)..."
            />
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={`${sortBy}_${order.toLowerCase()}`.replace('rating_desc', 'rating').replace('name_asc', 'name')}
                  onChange={handleSortChange}
                >
                  <MenuItem value="rating">Top Rated (★ High to Low)</MenuItem>
                  <MenuItem value="budget_asc">Budget: Low to High</MenuItem>
                  <MenuItem value="budget_desc">Budget: High to Low</MenuItem>
                  <MenuItem value="name">Alphabetical (A - Z)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Main Grid with Sidebar Filter */}
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={4} lg={3.2}>
          <DestinationFilters
            filters={filters}
            onChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
            onReset={handleResetFilters}
          />
        </Grid>

        {/* Destination Cards List */}
        <Grid item xs={12} md={8} lg={8.8}>
          {isLoading && <Loading message="Finding destinations matching your preferences..." />}

          {isError && (
            <ErrorState
              title="Failed to Load Destinations"
              message="Could not retrieve the destination catalog. Please check your network connection."
              onRetry={refetch}
            />
          )}

          {!isLoading && !isError && data && data.data?.length === 0 && (
            <EmptyState
              title="No Destinations Found"
              description="No destinations match your current filter and search criteria. Try adjusting or clearing your filters."
              actionText="Clear All Filters"
              onAction={handleResetFilters}
            />
          )}

          {!isLoading && !isError && data && data.data?.length > 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing <strong>{data.data.length}</strong> of <strong>{data.meta.total}</strong> destinations
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {data.data.map((destination) => (
                  <Grid item key={destination.id} xs={12} sm={6} lg={4}>
                    <DestinationCard destination={destination} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {data.meta.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination
                    count={data.meta.totalPages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    size="large"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default DestinationDiscoveryPage;
