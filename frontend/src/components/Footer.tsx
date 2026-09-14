import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink, IconButton, Divider } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'light' ? '#ffffff' : '#0b111e'),
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        pt: 6,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <FlightTakeoffIcon fontSize="small" />
              </Box>
              <Typography variant="h6" fontWeight={800} color="text.primary">
                TravelAssist
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 2 }}>
              Smart AI-driven travel planning, day-by-day itineraries, transparent budget tracking, and real-time assistance for world explorers.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="inherit"><GitHubIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="inherit"><TwitterIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="inherit"><InstagramIcon fontSize="small" /></IconButton>
              <IconButton size="small" color="inherit"><LinkedInIcon fontSize="small" /></IconButton>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom>
              Discover
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/destinations" color="text.secondary" underline="hover" variant="body2">
                All Destinations
              </MuiLink>
              <MuiLink component={Link} to="/destinations?trendingOnly=true" color="text.secondary" underline="hover" variant="body2">
                Trending Places
              </MuiLink>
              <MuiLink component={Link} to="/destinations?travelType=Beach" color="text.secondary" underline="hover" variant="body2">
                Beach Getaways
              </MuiLink>
              <MuiLink component={Link} to="/destinations?travelType=Heritage" color="text.secondary" underline="hover" variant="body2">
                Heritage Sites
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom>
              Planning Tools
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/assistant" color="text.secondary" underline="hover" variant="body2">
                AI Travel Assistant
              </MuiLink>
              <MuiLink component={Link} to="/trips" color="text.secondary" underline="hover" variant="body2">
                Itinerary Builder
              </MuiLink>
              <MuiLink component={Link} to="/expenses" color="text.secondary" underline="hover" variant="body2">
                Budget Calculator
              </MuiLink>
              <MuiLink component={Link} to="/bookings" color="text.secondary" underline="hover" variant="body2">
                Bookings Manager
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom>
              24/7 Smart Travel Help
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Have questions about visa guidelines, local weather, or packing tips? Our AI Travel Assistant is ready to help anytime.
            </Typography>
            <MuiLink
              component={Link}
              to="/assistant"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              Start Chat with AI →
            </MuiLink>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} TravelAssist Application. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink href="#" color="text.secondary" underline="hover" variant="caption">
              Privacy Policy
            </MuiLink>
            <MuiLink href="#" color="text.secondary" underline="hover" variant="caption">
              Terms of Service
            </MuiLink>
            <MuiLink href="#" color="text.secondary" underline="hover" variant="caption">
              Safety Guidelines
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
