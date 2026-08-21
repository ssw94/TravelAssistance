import Login  from './Login';
import Register  from './Register';
import AuthLayout from "../../layouts/AuthLayout";
import { Navigate } from 'react-router-dom';

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
      path: '',
      element: <Navigate to="/auth/login" replace />,
    }
  ]
}];
