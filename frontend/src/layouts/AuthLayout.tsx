import React from 'react';
import { Box, Paper, Grid, Typography, IconButton } from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleTheme } from '../store/slices/themeSlice';

export const AuthLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Visual Brand Side */}
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(9, 13, 22, 0.85) 0%, rgba(2, 132, 199, 0.4) 100%)',
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#ffffff',
            }}
          >
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: '#ffffff' }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FlightTakeoffIcon />
              </Box>
              <Typography variant="h5" fontWeight={800}>
                TravelAssist
              </Typography>
            </Box>

            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>
                Plan smarter, <br />
                travel deeper.
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 460 }}>
                Build detailed day-by-day itineraries, estimate dynamic travel budgets, track reservations, and explore with a dedicated AI assistant.
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Photo from Unsplash • Coastal paradise
            </Typography>
          </Box>
        </Grid>

        {/* Auth Form Side */}
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={0}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, sm: 6, md: 8 },
            position: 'relative',
          }}
        >
          {/* Top Bar for theme toggle */}
          <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
              {themeMode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Box>

          <Box sx={{ maxWidth: 460, width: '100%', mx: 'auto' }}>
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default AuthLayout;
