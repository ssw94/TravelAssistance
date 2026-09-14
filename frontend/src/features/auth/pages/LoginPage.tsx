import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';

import { loginSchema } from '../../../utils/validationSchemas';
import { authService } from '../services/authService';
import { useAppDispatch } from '../../../store/store';
import { setCredentials } from '../../../store/slices/authSlice';
import { showToast } from '../../../store/slices/uiSlice';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const data = await authService.login(values);
        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
          }),
        );
        dispatch(showToast({ message: `Welcome back, ${data.user.firstName}!`, severity: 'success' }));
        navigate(from, { replace: true });
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Invalid email or password');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleQuickDemoLogin = (email: string, pass: string) => {
    formik.setValues({
      email,
      password: pass,
      rememberMe: true,
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to access your planned trips, saved itineraries, and travel assistant.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Quick Demo Fill Buttons */}
      <Box sx={{ mb: 3, p: 2, bgcolor: (t) => (t.palette.mode === 'light' ? 'grey.50' : 'grey.900'), borderRadius: 3 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" gutterBottom>
          Quick Demo Credentials:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Standard User (Sachin)"
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => handleQuickDemoLogin('sachin@travelassistance.com', 'Sachin@123')}
            sx={{ cursor: 'pointer', fontWeight: 600 }}
          />
          <Chip
            label="Admin (System Admin)"
            size="small"
            color="secondary"
            variant="outlined"
            onClick={() => handleQuickDemoLogin('admin@travelassistance.com', 'Admin@123456')}
            sx={{ cursor: 'pointer', fontWeight: 600 }}
          />
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label={<Typography variant="body2">Remember me</Typography>}
            />
            <MuiLink component={Link} to="/forgot-password" variant="body2" color="primary" underline="hover">
              Forgot password?
            </MuiLink>
          </Box>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            isLoading={loading}
            startIcon={<LoginIcon />}
            sx={{ py: 1.2, mt: 1 }}
          >
            Sign In
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" align="center" color="text.secondary">
        Don&apos;t have an account yet?{' '}
        <MuiLink component={Link} to="/register" fontWeight={700} color="primary" underline="hover">
          Create Account
        </MuiLink>
      </Typography>
    </Box>
  );
};
export default LoginPage;
