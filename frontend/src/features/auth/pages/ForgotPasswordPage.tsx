import React from 'react';
import {
  Box,
  Typography,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { forgotPasswordSchema } from '../../../utils/validationSchemas';
import { authService } from '../services/authService';
import Button from '../../../components/Button';
import Input from '../../../components/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [devToken, setDevToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = await authService.forgotPassword(values);
        setSuccessMsg(data.message);
        if (data.devResetToken) {
          setDevToken(data.devResetToken);
        }
      } catch {
        setSuccessMsg('If this email is registered, a password reset instruction has been sent.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your account email, and we will send you a secure verification link to choose a new password.
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          {successMsg}
          {devToken && (
            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" fontWeight={700} display="block">
                Development Quick Reset Link:
              </Typography>
              <MuiLink
                component={Link}
                to={`/reset-password?token=${devToken}`}
                sx={{ wordBreak: 'break-all', fontWeight: 600 }}
              >
                Click here to reset with development token
              </MuiLink>
            </Box>
          )}
        </Alert>
      )}

      {!successMsg && (
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Input
              id="email"
              name="email"
              label="Account Email Address"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              isLoading={loading}
              startIcon={<LockResetIcon />}
              sx={{ py: 1.2, mt: 1 }}
            >
              Send Reset Link
            </Button>
          </Box>
        </form>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <MuiLink
          component={Link}
          to="/login"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
          underline="hover"
        >
          <ArrowBackIcon fontSize="small" /> Back to Sign In
        </MuiLink>
      </Box>
    </Box>
  );
};
export default ForgotPasswordPage;
