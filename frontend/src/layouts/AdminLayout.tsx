import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
  Container,
  Button,
} from '@mui/material';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';

const DRAWER_WIDTH = 260;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);

  const [mobileOpen, setMobileOpen] = useState(false);

  const adminMenu = [
    { label: 'Overview', path: '/admin', icon: <DashboardOutlinedIcon /> },
    { label: 'Users Management', path: '/admin/users', icon: <PeopleAltOutlinedIcon /> },
    { label: 'Destinations', path: '/admin/destinations', icon: <PublicOutlinedIcon /> },
    { label: 'Reviews Moderation', path: '/admin/reviews', icon: <RateReviewOutlinedIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
        <Box>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
            TravelAssist
          </Typography>
          <Typography variant="caption" color="primary.main" fontWeight={700}>
            Admin Console
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 2 }}>
        {adminMenu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                selected={active}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: active ? 700 : 500,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? '#ffffff' : 'text.primary',
                  '&.Mui-selected': { bgcolor: 'primary.main', color: '#ffffff' },
                  '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? '#ffffff' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          component={Link}
          to="/dashboard"
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<ExitToAppOutlinedIcon />}
          sx={{ mb: 1 }}
        >
          Back to App
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={700} noWrap component="div">
            System Administration
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
              {themeMode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>

            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              {user?.firstName?.charAt(0) || 'A'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Responsive Navigation Drawer */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 4 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '70px',
        }}
      >
        <Container maxWidth="xl" sx={{ p: '0 !important' }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
export default AdminLayout;
