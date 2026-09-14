import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

import { authService } from '../../auth/services/authService';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { updateUserProfile, logout } from '../../../store/slices/authSlice';
import { showToast } from '../../../store/slices/uiSlice';
import { TravelStyle } from '../../../types';
import Heading, { SubHeading } from '../../../components/Heading';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import ConfirmDialog from '../../../components/ConfirmDialog';

const TRAVEL_STYLES = [
  { value: TravelStyle.BUDGET, label: 'Budget' },
  { value: TravelStyle.STANDARD, label: 'Standard' },
  { value: TravelStyle.LUXURY, label: 'Luxury' },
  { value: TravelStyle.ADVENTURE, label: 'Adventure' },
  { value: TravelStyle.FAMILY, label: 'Family' },
  { value: TravelStyle.COUPLE, label: 'Couple' },
  { value: TravelStyle.SOLO, label: 'Solo' },
  { value: TravelStyle.BUSINESS, label: 'Business' },
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile Formik
  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.profile?.phoneNumber || '',
      dateOfBirth: user?.profile?.dateOfBirth || '',
      preferredCurrency: user?.profile?.preferredCurrency || 'INR',
      preferredTravelStyle: user?.profile?.preferredTravelStyle || TravelStyle.STANDARD,
      bio: user?.profile?.bio || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedUser = await authService.updateProfile(values);
        dispatch(updateUserProfile(updatedUser));
        dispatch(showToast({ message: 'Profile updated successfully! ✨', severity: 'success' }));
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to update profile', severity: 'error' }));
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Password Formik
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object().shape({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 'Must contain uppercase, lowercase, and number/symbol')
        .required('New password is required'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm new password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setPasswordLoading(true);
      try {
        await authService.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        dispatch(showToast({ message: 'Password changed successfully! 🔐', severity: 'success' }));
        resetForm();
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to change password', severity: 'error' }));
      } finally {
        setPasswordLoading(false);
      }
    },
  });

  const handleLogoutAll = async () => {
    try {
      await authService.logoutAll();
      dispatch(logout());
      navigate('/login');
      dispatch(showToast({ message: 'Logged out of all active sessions', severity: 'info' }));
    } catch {
      dispatch(showToast({ message: 'Failed to logout from all devices', severity: 'error' }));
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Heading badge={user?.role || 'USER'}>Account & Profile</Heading>
        <SubHeading>
          Manage your personal preferences, preferred currency, security credentials, and travel style.
        </SubHeading>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Avatar & Quick Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3.5, borderRadius: 3.5, textAlign: 'center', mb: 3 }}>
            <Avatar
              src={user?.avatarUrl}
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.main',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>

            <Typography variant="h6" fontWeight={800}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>

            <Chip
              label={`Role: ${user?.role}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 700, mt: 1, mb: 2.5 }}
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Preferred Currency: <strong>{user?.profile?.preferredCurrency || 'INR'}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Travel Style: <strong>{user?.profile?.preferredTravelStyle || 'Standard'}</strong>
              </Typography>
            </Box>
          </Paper>

          {/* Session Management Card */}
          <Paper sx={{ p: 3, borderRadius: 3.5 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Device Sessions
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Sign out from all web and mobile browsers connected to your account.
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              fullWidth
              startIcon={<ExitToAppIcon />}
              onClick={handleLogoutAll}
            >
              Logout All Devices
            </Button>
          </Paper>
        </Grid>

        {/* Right Column: Edit Profile & Change Password Forms */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Edit Profile Info */}
            <Paper sx={{ p: 3.5, borderRadius: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PersonOutlineIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Personal Information
                </Typography>
              </Box>

              <form onSubmit={profileFormik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Input
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        value={profileFormik.values.firstName}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        error={profileFormik.touched.firstName && profileFormik.errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        value={profileFormik.values.lastName}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        error={profileFormik.touched.lastName && profileFormik.errors.lastName}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        value={profileFormik.values.phoneNumber}
                        onChange={profileFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={profileFormik.values.dateOfBirth}
                        onChange={profileFormik.handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Select
                        id="preferredCurrency"
                        name="preferredCurrency"
                        label="Preferred Currency"
                        options={[
                          { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                          { value: 'USD', label: 'USD ($) - US Dollar' },
                          { value: 'EUR', label: 'EUR (€) - Euro' },
                          { value: 'JPY', label: 'JPY (¥) - Japanese Yen' },
                        ]}
                        value={profileFormik.values.preferredCurrency}
                        onChange={profileFormik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Select
                        id="preferredTravelStyle"
                        name="preferredTravelStyle"
                        label="Preferred Travel Style"
                        options={TRAVEL_STYLES}
                        value={profileFormik.values.preferredTravelStyle}
                        onChange={profileFormik.handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Input
                    id="bio"
                    name="bio"
                    label="About Me / Bio"
                    multiline
                    rows={2.5}
                    placeholder="Tell us about your favorite travel styles, destinations, and interests..."
                    value={profileFormik.values.bio}
                    onChange={profileFormik.handleChange}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={profileFormik.isSubmitting}
                      sx={{ px: 3, fontWeight: 700 }}
                    >
                      Save Profile
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>

            {/* Change Password */}
            <Paper sx={{ p: 3.5, borderRadius: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <LockResetIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Change Password
                </Typography>
              </Box>

              <form onSubmit={passwordFormik.handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        type="password"
                        value={passwordFormik.values.newPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        error={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        type="password"
                        value={passwordFormik.values.confirmNewPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        error={passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      isLoading={passwordLoading}
                      sx={{ px: 3, fontWeight: 700 }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProfilePage;
