import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import { Destination } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { destinationService } from '../services/destinationService';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';

export interface DestinationCardProps {
  destination: Destination;
  isSaved?: boolean;
  onBookmarkToggle?: (saved: boolean) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isSaved: initialSaved = false,
  onBookmarkToggle,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [saved, setSaved] = useState(initialSaved);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please log in to save destinations to your wishlist', severity: 'info' }));
      navigate('/login');
      return;
    }

    try {
      if (saved) {
        await destinationService.unsaveDestination(destination.id);
        setSaved(false);
        onBookmarkToggle?.(false);
        dispatch(showToast({ message: 'Removed from wishlist', severity: 'info' }));
      } else {
        await destinationService.saveDestination(destination.id);
        setSaved(true);
        onBookmarkToggle?.(true);
        dispatch(showToast({ message: 'Saved to wishlist! 💖', severity: 'success' }));
      }
    } catch {
      dispatch(showToast({ message: 'Failed to update wishlist', severity: 'error' }));
    }
  };

  return (
    <Card
      component={Link}
      to={`/destinations/${destination.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        position: 'relative',
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
      {/* Cover Image & Badges */}
      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="220"
          image={destination.coverImage}
          alt={destination.name}
          sx={{
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />

        {/* Wishlist Button */}
        <Tooltip title={saved ? 'Remove from wishlist' : 'Save to wishlist'}>
          <IconButton
            onClick={handleBookmark}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              color: saved ? 'error.main' : 'text.secondary',
              '&:hover': { bgcolor: '#ffffff', transform: 'scale(1.1)' },
            }}
          >
            {saved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
          </IconButton>
        </Tooltip>

        {/* Rating Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            px: 1.2,
            py: 0.4,
            borderRadius: 2,
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <StarRoundedIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
          <span>{Number(destination.rating || 4.5).toFixed(1)}</span>
          <Typography variant="caption" sx={{ opacity: 0.8, ml: 0.3 }}>
            ({destination.reviewCount || 0})
          </Typography>
        </Box>

        {/* Trending Chip */}
        {destination.isTrending && (
          <Chip
            label="🔥 Trending"
            size="small"
            color="secondary"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 800,
              fontSize: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mb: 0.8 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="caption" fontWeight={600} noWrap>
            {destination.city ? `${destination.city}, ` : ''}{destination.country}
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={800} sx={{ mb: 1, lineHeight: 1.3 }}>
          {destination.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
          }}
        >
          {destination.description}
        </Typography>

        {/* Travel Style Tags */}
        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2 }}>
          {destination.travelTypes?.slice(0, 3).map((type, i) => (
            <Chip
              key={i}
              label={type}
              size="small"
              sx={{
                bgcolor: (t) => (t.palette.mode === 'light' ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.18)'),
                color: 'primary.main',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            />
          ))}
        </Box>

        {/* Footer info: Duration & Starting Budget */}
        <Box
          sx={{
            mt: 'auto',
            pt: 1.5,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" fontWeight={600}>
              {destination.suggestedDuration || '3-5 days'}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Starting from
            </Typography>
            <Typography variant="subtitle1" fontWeight={800} color="primary.main" lineHeight={1}>
              {formatCurrency(destination.startingBudget, destination.currency)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
export default DestinationCard;
