import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import { formatCurrency } from '../../../utils/formatters';

export interface FilterState {
  country?: string;
  travelType?: string;
  season?: string;
  maxBudget?: number;
  minRating?: number;
  trendingOnly?: boolean;
}

export interface DestinationFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const TRAVEL_TYPES = ['Beach', 'Adventure', 'Heritage', 'Romantic', 'Nature', 'Culture', 'Culinary', 'City'];
const SEASONS = ['Winter', 'Spring', 'Summer', 'Monsoon', 'Autumn'];
const COUNTRIES = ['All Countries', 'India', 'France', 'Japan', 'Indonesia', 'Switzerland'];

export const DestinationFilters: React.FC<DestinationFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const handleCountryChange = (event: any) => {
    const val = event.target.value;
    onChange({ ...filters, country: val === 'All Countries' ? undefined : val });
  };

  const handleBudgetChange = (_: Event, newValue: number | number[]) => {
    onChange({ ...filters, maxBudget: newValue as number });
  };

  const handleTravelTypeToggle = (type: string) => {
    onChange({ ...filters, travelType: filters.travelType === type ? undefined : type });
  };

  const handleSeasonToggle = (season: string) => {
    onChange({ ...filters, season: filters.season === season ? undefined : season });
  };

  const handleRatingChange = (event: any) => {
    const val = event.target.value;
    onChange({ ...filters, minRating: val ? parseFloat(val) : undefined });
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterAltOutlinedIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Filters
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<RestartAltOutlinedIcon />}
          onClick={onReset}
          sx={{ color: 'text.secondary' }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Country Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Country
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Select Country</InputLabel>
          <Select
            value={filters.country || 'All Countries'}
            label="Select Country"
            onChange={handleCountryChange}
          >
            {COUNTRIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Budget Slider */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Max Budget
          </Typography>
          <Typography variant="caption" fontWeight={700} color="primary.main">
            {filters.maxBudget ? formatCurrency(filters.maxBudget) : 'Any Budget'}
          </Typography>
        </Box>
        <Slider
          value={filters.maxBudget || 100000}
          min={5000}
          max={100000}
          step={5000}
          onChange={handleBudgetChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => formatCurrency(val)}
        />
      </Box>

      {/* Rating Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Minimum Rating
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Rating</InputLabel>
          <Select
            value={filters.minRating || ''}
            label="Rating"
            onChange={handleRatingChange}
          >
            <MenuItem value="">Any Rating</MenuItem>
            <MenuItem value="4.5">★ 4.5 & Above (Exceptional)</MenuItem>
            <MenuItem value="4.0">★ 4.0 & Above (Very Good)</MenuItem>
            <MenuItem value="3.5">★ 3.5 & Above</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Travel Styles Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Travel Style
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {TRAVEL_TYPES.map((type) => {
            const isSelected = filters.travelType === type;
            return (
              <Chip
                key={type}
                label={type}
                size="small"
                onClick={() => handleTravelTypeToggle(type)}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Best Season Chips */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Best Season
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {SEASONS.map((season) => {
            const isSelected = filters.season === season;
            return (
              <Chip
                key={season}
                label={season}
                size="small"
                onClick={() => handleSeasonToggle(season)}
                color={isSelected ? 'secondary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};
export default DestinationFilters;
