import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Container,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';
import { toggleChatDrawer } from '../store/slices/uiSlice';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '../features/notifications/services/notificationService';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, role } = useAppSelector((state) => state.auth);
  const themeMode = useAppSelector((state) => state.theme.mode);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { data: unreadData } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { label: 'Discover', path: '/destinations', icon: <ExploreOutlinedIcon fontSize="small" /> },
    ...(isAuthenticated
      ? [
          { label: 'My Trips', path: '/trips', icon: <LuggageOutlinedIcon fontSize="small" /> },
          { label: 'Bookings', path: '/bookings', icon: <ConfirmationNumberOutlinedIcon fontSize="small" /> },
          { label: 'Budget', path: '/expenses', icon: <AccountBalanceWalletOutlinedIcon fontSize="small" /> },
          { label: 'Saved', path: '/saved', icon: <BookmarkBorderOutlinedIcon fontSize="small" /> },
        ]
      : []),
    { label: 'AI Assistant', path: '/assistant', icon: <SmartToyOutlinedIcon fontSize="small" /> },
    ...(role === UserRole.ADMIN
      ? [{ label: 'Admin', path: '/admin', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" /> }]
      : []),
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 70 }}>
          {/* Logo */}
          <Box
            component={Link}
            to={isAuthenticated ? '/dashboard' : '/'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
              }}
            >
              <FlightTakeoffIcon />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #0284c7 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TravelAssist
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => {
              const active = isActivePath(link.path);
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  startIcon={link.icon}
                  variant={active ? 'contained' : 'text'}
                  color={active ? 'primary' : 'inherit'}
                  sx={{
                    px: 2,
                    py: 0.8,
                    fontWeight: active ? 700 : 500,
                    borderRadius: 2.5,
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? '#ffffff' : 'text.primary',
                    '&:hover': {
                      bgcolor: active ? 'primary.dark' : (theme) => (theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'),
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          {/* Action Icons & User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            {/* Quick AI Drawer Toggle */}
            <Tooltip title="Ask AI Travel Assistant">
              <IconButton
                onClick={() => dispatch(toggleChatDrawer())}
                sx={{
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? 'rgba(2,132,199,0.08)' : 'rgba(2,132,199,0.2)'),
                  color: 'primary.main',
                }}
              >
                <SmartToyOutlinedIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            {isAuthenticated && (
              <Tooltip title="Notifications">
                <IconButton component={Link} to="/notifications" color="inherit">
                  <Badge badgeContent={unreadData?.unreadCount || 0} color="error">
                    <NotificationsNoneOutlinedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* Dark / Light Mode Switch */}
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}>
              <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
                {themeMode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
              </IconButton>
            </Tooltip>

            {/* User Profile or Login/Register */}
            {isAuthenticated ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, ml: 1 }}>
                    <Avatar
                      alt={user?.firstName}
                      src={user?.avatarUrl}
                      sx={{
                        width: 38,
                        height: 38,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user?.firstName?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: { width: 220, borderRadius: 3, p: 1 },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <ListItemIcon><PersonOutlineOutlinedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Profile & Settings</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/trips'); }}>
                    <ListItemIcon><LuggageOutlinedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>My Trips</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/saved'); }}>
                    <ListItemIcon><BookmarkBorderOutlinedIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Saved Wishlist</ListItemText>
                  </MenuItem>
                  {role === UserRole.ADMIN && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin'); }}>
                      <ListItemIcon><AdminPanelSettingsOutlinedIcon fontSize="small" color="primary" /></ListItemIcon>
                      <ListItemText primaryTypographyProps={{ color: 'primary', fontWeight: 600 }}>Admin Panel</ListItemText>
                    </MenuItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><LogoutOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button component={Link} to="/login" variant="text" color="inherit">
                  Log in
                </Button>
                <Button component={Link} to="/register" variant="contained" color="primary">
                  Sign up
                </Button>
              </Box>
            )}

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ display: { md: 'none' }, ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, p: 2 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <FlightTakeoffIcon color="primary" />
          <Typography variant="h6" fontWeight={800}>TravelAssist</Typography>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={() => setMobileDrawerOpen(false)}
                selected={isActivePath(link.path)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};
export default Navbar;
