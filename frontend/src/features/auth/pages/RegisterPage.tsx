import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Link as MuiLink,
  Divider,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { registerSchema } from '../../../utils/validationSchemas';
import { authService } from '../services/authService';
import { useAppDispatch } from '../../../store/store';
import { setCredentials } from '../../../store/slices/authSlice';
import { showToast } from '../../../store/slices/uiSlice';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const data = await authService.register(values);
        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
          }),
        );
        dispatch(showToast({ message: '🎉 Account created successfully! Welcome to TravelAssist.', severity: 'success' }));
        navigate('/dashboard');
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to create account');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Join thousands of travelers crafting unforgettable itineraries with AI assistance.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
          </Grid>

          <Input
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
            helperText="At least 8 chars, 1 uppercase, 1 lowercase, and 1 number"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            isLoading={loading}
            startIcon={<PersonAddIcon />}
            sx={{ py: 1.2, mt: 1 }}
          >
            Create Free Account
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" align="center" color="text.secondary">
        Already have an account?{' '}
        <MuiLink component={Link} to="/login" fontWeight={700} color="primary" underline="hover">
          Sign In
        </MuiLink>
      </Typography>
    </Box>
  );
};
export default RegisterPage;
