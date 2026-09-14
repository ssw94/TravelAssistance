import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Loading from '../components/Loading';

// Lazy loaded page components
const DestinationDiscoveryPage = lazy(() => import('../features/destinations/pages/DestinationDiscoveryPage'));
const DestinationDetailPage = lazy(() => import('../features/destinations/pages/DestinationDetailPage'));
const SavedDestinationsPage = lazy(() => import('../features/destinations/pages/SavedDestinationsPage'));

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const TripsListPage = lazy(() => import('../features/trips/pages/TripsListPage'));
const TripDetailPage = lazy(() => import('../features/trips/pages/TripDetailPage'));
const BookingsPage = lazy(() => import('../features/bookings/pages/BookingsPage'));
const ExpensesPage = lazy(() => import('../features/expenses/pages/ExpensesPage'));
const AIAssistantPage = lazy(() => import('../features/assistant/pages/AIAssistantPage'));
const NotificationsPage = lazy(() => import('../features/notifications/pages/NotificationsPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));

const AdminDashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('../features/admin/pages/AdminUsersPage'));
const AdminDestinationsPage = lazy(() => import('../features/admin/pages/AdminDestinationsPage'));
const AdminReviewsPage = lazy(() => import('../features/admin/pages/AdminReviewsPage'));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<Loading message="Loading view..." minHeight="60vh" />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Auth Layout Routes
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
          },
          {
            path: 'register',
            element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
          },
          {
            path: 'forgot-password',
            element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
          },
          {
            path: 'reset-password',
            element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>,
          },
        ],
      },

      // Main App Layout Routes
      {
        element: <MainLayout />,
        children: [
          // Public Routes
          {
            index: true,
            element: <SuspenseWrapper><DestinationDiscoveryPage /></SuspenseWrapper>,
          },
          {
            path: 'destinations',
            element: <SuspenseWrapper><DestinationDiscoveryPage /></SuspenseWrapper>,
          },
          {
            path: 'destinations/:id',
            element: <SuspenseWrapper><DestinationDetailPage /></SuspenseWrapper>,
          },
          {
            path: 'assistant',
            element: <SuspenseWrapper><AIAssistantPage /></SuspenseWrapper>,
          },

          // Protected User Routes
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: 'dashboard',
                element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
              },
              {
                path: 'trips',
                element: <SuspenseWrapper><TripsListPage /></SuspenseWrapper>,
              },
              {
                path: 'trips/:id',
                element: <SuspenseWrapper><TripDetailPage /></SuspenseWrapper>,
              },
              {
                path: 'bookings',
                element: <SuspenseWrapper><BookingsPage /></SuspenseWrapper>,
              },
              {
                path: 'expenses',
                element: <SuspenseWrapper><ExpensesPage /></SuspenseWrapper>,
              },
              {
                path: 'saved',
                element: <SuspenseWrapper><SavedDestinationsPage /></SuspenseWrapper>,
              },
              {
                path: 'notifications',
                element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper>,
              },
              {
                path: 'profile',
                element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
              },
            ],
          },
        ],
      },

      // Admin Layout Routes
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>,
              },
              {
                path: 'users',
                element: <SuspenseWrapper><AdminUsersPage /></SuspenseWrapper>,
              },
              {
                path: 'destinations',
                element: <SuspenseWrapper><AdminDestinationsPage /></SuspenseWrapper>,
              },
              {
                path: 'reviews',
                element: <SuspenseWrapper><AdminReviewsPage /></SuspenseWrapper>,
              },
            ],
          },
        ],
      },

      // 404 Fallback
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
