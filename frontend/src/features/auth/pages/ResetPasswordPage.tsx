import React from 'react';
import {
  Box,
  Typography,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';

import { resetPasswordSchema } from '../../../utils/validationSchemas';
import { authService } from '../services/authService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      token: tokenFromUrl,
      password: '',
      confirmPassword: '',
    },
    enableReinitialize: true,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setErrorMsg(null);
      setLoading(true);
      try {
        await authService.resetPassword({
          token: values.token,
          password: values.password,
        });
        dispatch(
          showToast({
            message: 'Password reset successfully! You can now log in with your new password.',
            severity: 'success',
          }),
        );
        navigate('/login');
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Set New Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your verification reset token and choose a strong new password.
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Input
            id="token"
            name="token"
            label="Verification Reset Token"
            value={formik.values.token}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.token && formik.errors.token}
          />

          <Input
            id="password"
            name="password"
            label="New Password"
            type="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
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
            startIcon={<KeyIcon />}
            sx={{ py: 1.2, mt: 1 }}
          >
            Update Password
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <MuiLink component={Link} to="/login" fontWeight={600} color="primary" underline="hover">
          Return to Sign In
        </MuiLink>
      </Box>
    </Box>
  );
};
export default ResetPasswordPage;
