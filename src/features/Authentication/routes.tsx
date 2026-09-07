import Login  from './Login';
import Register  from './Register';
import AuthLayout from "../../layouts/AuthLayout";
import { Navigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import VerifyAccount from './VerifyAccount';

export const authRoutes = [{
  path: 'auth',
  element: <AuthLayout />,
  children: [
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: 'verify-account',
      element: <VerifyAccount />,
    },

    {
      path: '',
      element: <Navigate to="/auth/login" replace />,
    }
  ]
}];
