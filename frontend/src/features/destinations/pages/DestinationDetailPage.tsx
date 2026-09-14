import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Divider,
  Rating,
  Avatar,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import DirectionsTransitOutlinedIcon from '@mui/icons-material/DirectionsTransitOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';

import { destinationService } from '../services/destinationService';
import { reviewService } from '../../reviews/services/reviewService';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import { useFormik } from 'formik';
import { reviewSchema } from '../../../utils/validationSchemas';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: destination, isLoading, isError, refetch } = useQuery({
    queryKey: ['destination', id],
    queryFn: () => destinationService.getById(id!),
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['destinationReviews', id],
    queryFn: () => reviewService.getByDestination(id!),
    enabled: !!id,
  });

  const reviewFormik = useFormik({
    initialValues: {
      rating: 5,
      title: '',
      comment: '',
    },
    validationSchema: reviewSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await reviewService.create(id!, values);
        dispatch(showToast({ message: 'Review submitted successfully! Thank you.', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['destinationReviews', id] });
        queryClient.invalidateQueries({ queryKey: ['destination', id] });
        resetForm();
        setReviewModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to submit review', severity: 'error' }));
      }
    },
  });

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please log in to save to your wishlist', severity: 'info' }));
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await destinationService.unsaveDestination(id!);
        setIsSaved(false);
        dispatch(showToast({ message: 'Removed from wishlist', severity: 'info' }));
      } else {
        await destinationService.saveDestination(id!);
        setIsSaved(true);
        dispatch(showToast({ message: 'Added to wishlist! 💖', severity: 'success' }));
      }
    } catch {
      dispatch(showToast({ message: 'Failed to update wishlist', severity: 'error' }));
    }
  };

  if (isLoading) return <Loading message="Loading destination details & travel guides..." />;
  if (isError || !destination) {
    return <ErrorState title="Destination Not Found" message="Could not find the requested destination." onRetry={refetch} />;
  }

  return (
    <Box>
      {/* Hero Header Section */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 4,
          minHeight: { xs: 320, md: 450 },
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage: `url(${destination.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(9, 13, 22, 0.9) 0%, rgba(9, 13, 22, 0.3) 60%, transparent 100%)',
          }}
        />

        <Box sx={{ position: 'relative', p: { xs: 3, md: 5 }, width: '100%', color: '#ffffff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  icon={<LocationOnOutlinedIcon sx={{ color: '#ffffff !important' }} />}
                  label={`${destination.city ? `${destination.city}, ` : ''}${destination.country}`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#ffffff', fontWeight: 700 }}
                />
                {destination.travelTypes?.map((t, idx) => (
                  <Chip
                    key={idx}
                    label={t}
                    size="small"
                    sx={{ bgcolor: 'rgba(2, 132, 199, 0.6)', color: '#ffffff', fontWeight: 600 }}
                  />
                ))}
              </Box>

              <Typography variant="h2" fontWeight={800} sx={{ mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {destination.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarRoundedIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
                  <Typography variant="h6" fontWeight={700}>
                    {Number(destination.rating || 4.5).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ({destination.reviewCount || reviews.length} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
                  <AccessTimeOutlinedIcon fontSize="small" />
                  <Typography variant="body2">Suggested: {destination.suggestedDuration || '3-5 days'}</Typography>
                </Box>
              </Box>
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Tooltip title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}>
                <IconButton
                  onClick={handleBookmark}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    color: isSaved ? 'error.light' : '#ffffff',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.4)' },
                  }}
                >
                  {isSaved ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
                </IconButton>
              </Tooltip>

              <Button
                component={Link}
                to={`/trips?newTrip=true&dest=${encodeURIComponent(destination.name)}`}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<LuggageOutlinedIcon />}
                sx={{ px: 3, py: 1.2, fontWeight: 700, boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)' }}
              >
                Plan a Trip Here
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content & Sidebar */}
      <Grid container spacing={4}>
        {/* Left Section: Overview, Weather, Attractions, Activities, Reviews */}
        <Grid item xs={12} md={8}>
          {/* Navigation Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} variant="scrollable" scrollButtons="auto">
              <Tab label="Overview & Highlights" />
              <Tab label="Popular Attractions" />
              <Tab label="Activities & Tours" />
              <Tab label="Local Tips & Safety" />
              <Tab label={`Reviews (${reviews.length})`} />
            </Tabs>
          </Paper>

          {/* Tab 0: Overview */}
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  About {destination.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                  {destination.overview || destination.description}
                </Typography>

                {/* Best Seasons Chips */}
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Best Seasons to Visit:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {destination.bestSeasons?.map((s, idx) => (
                    <Chip key={idx} label={`🌸 ${s}`} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                  ))}
                  <Chip label={`🗓️ ${destination.bestTimeToVisit}`} sx={{ fontWeight: 600 }} />
                </Box>
              </Paper>

              {/* Gallery Grid */}
              {destination.gallery && destination.gallery.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Photo Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {destination.gallery.map((img) => (
                      <Grid item key={img.id} xs={12} sm={6}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={img.url}
                          alt={img.caption || destination.name}
                          sx={{ borderRadius: 2.5 }}
                        />
                        {img.caption && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {img.caption}
                          </Typography>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </Box>
          )}

          {/* Tab 1: Attractions */}
          {activeTab === 1 && (
            <Paper sx={{ p: 3.5, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <AttractionsOutlinedIcon color="primary" />
                <Typography variant="h5" fontWeight={700}>
                  Top Attractions in {destination.name}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {destination.popularAttractions?.map((attr, idx) => (
                  <Grid item key={idx} xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                        #{idx + 1} {attr}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Must-visit highlight showcasing the authentic essence and cultural beauty of {destination.name}.
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Tab 2: Activities */}
          {activeTab === 2 && (
            <Paper sx={{ p: 3.5, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Curated Activities & Experiences
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {destination.activities?.map((act) => (
                  <Card key={act.id} variant="outlined" sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ maxWidth: 450 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {act.name}
                        </Typography>
                        {act.category && <Chip label={act.category} size="small" variant="outlined" />}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {act.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        ⏱ Duration: {act.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">Est. Cost</Typography>
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        {formatCurrency(act.estimatedCost, destination.currency)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Paper>
          )}

          {/* Tab 3: Local Tips & Safety */}
          {activeTab === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <DirectionsTransitOutlinedIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Transportation & Getting Around
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {destination.transportationInfo || 'Public cabs, local buses, and ride sharing are accessible.'}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ShieldOutlinedIcon color="warning" />
                  <Typography variant="h6" fontWeight={700}>
                    Safety & Health Tips
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {destination.safetyTips || 'Keep emergency contacts saved and use registered transportation services.'}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <LightbulbOutlinedIcon color="secondary" />
                  <Typography variant="h6" fontWeight={700}>
                    Local Insider Advice
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {destination.localTips || 'Try local culinary specialties and explore early morning for tranquil crowd-free experiences.'}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 4 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Traveler Reviews
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Authentic experiences shared by verified community travelers
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RateReviewOutlinedIcon />}
                    onClick={() => {
                      if (!isAuthenticated) {
                        dispatch(showToast({ message: 'Please sign in to write a review', severity: 'info' }));
                        navigate('/login');
                      } else {
                        setReviewModalOpen(true);
                      }
                    }}
                  >
                    Write a Review
                  </Button>
                </Box>

                {reviews.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No reviews yet for this destination. Be the first to share your journey!
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {reviews.map((rev) => (
                      <Card key={rev.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={rev.user?.avatarUrl} sx={{ bgcolor: 'primary.main' }}>
                              {rev.user?.firstName?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {rev.user?.firstName} {rev.user?.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(rev.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                          <Rating value={rev.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          {rev.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {rev.comment}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Grid>

        {/* Right Sidebar: Key Highlights & Quick Booking recommendations */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Price & Duration Widget */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Starting Estimated Budget
              </Typography>
              <Typography variant="h3" fontWeight={800} color="primary.main" sx={{ my: 1 }}>
                {formatCurrency(destination.startingBudget, destination.currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2.5 }}>
                Estimated per person for a standard {destination.suggestedDuration} itinerary
              </Typography>

              <Button
                component={Link}
                to={`/trips?newTrip=true&dest=${encodeURIComponent(destination.name)}`}
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LuggageOutlinedIcon />}
                sx={{ py: 1.2, fontWeight: 700 }}
              >
                Start Planning Trip
              </Button>
            </Paper>

            {/* Weather Widget */}
            {destination.weatherInfo && (
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WbSunnyOutlinedIcon color="warning" />
                  <Typography variant="h6" fontWeight={700}>
                    Current Weather
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={800}>
                      {destination.weatherInfo.averageTemp}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {destination.weatherInfo.condition}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Humidity: {destination.weatherInfo.humidity}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Recommended Hotels */}
            {destination.recommendedHotels && destination.recommendedHotels.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HotelOutlinedIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Recommended Stays
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {destination.recommendedHotels.map((h, i) => (
                    <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      🏨 {h}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Recommended Restaurants */}
            {destination.recommendedRestaurants && destination.recommendedRestaurants.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <RestaurantOutlinedIcon color="secondary" />
                  <Typography variant="h6" fontWeight={700}>
                    Culinary Recommendations
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {destination.recommendedRestaurants.map((r, i) => (
                    <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      🍽️ {r}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Write Review Modal */}
      <Modal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review ${destination.name}`}
        subtitle="Share your tips and rating with travelers around the world"
      >
        <form onSubmit={reviewFormik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Your Rating:
              </Typography>
              <Rating
                name="rating"
                value={reviewFormik.values.rating}
                onChange={(_, val) => reviewFormik.setFieldValue('rating', val || 5)}
                size="large"
              />
            </Box>

            <Input
              id="title"
              name="title"
              label="Review Title"
              placeholder="e.g. Unforgettable beach vibes and great seafood"
              value={reviewFormik.values.title}
              onChange={reviewFormik.handleChange}
              onBlur={reviewFormik.handleBlur}
              error={reviewFormik.touched.title && reviewFormik.errors.title}
            />

            <Input
              id="comment"
              name="comment"
              label="Detailed Review"
              multiline
              rows={4}
              placeholder="Describe what you loved, local tips, food to try, and must-see sights..."
              value={reviewFormik.values.comment}
              onChange={reviewFormik.handleChange}
              onBlur={reviewFormik.handleBlur}
              error={reviewFormik.touched.comment && reviewFormik.errors.comment}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setReviewModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit Review
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </Box>
  );
};
export default DestinationDetailPage;
