import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  IconButton,
  Chip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import { Link } from 'react-router-dom';

import { notificationService } from '../services/notificationService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { formatDate, formatFromNow } from '../../../utils/formatters';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import Heading, { SubHeading } from '../../../components/Heading';

export const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      dispatch(showToast({ message: 'All notifications marked as read', severity: 'success' }));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Heading badge={`${notifications.length} Alerts`}>Notifications</Heading>
          <SubHeading>
            Real-time updates regarding your upcoming trips, booking vouchers, and itinerary reminders.
          </SubHeading>
        </Box>
        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DoneAllIcon />}
            onClick={() => markAllReadMutation.mutate()}
          >
            Mark All as Read
          </Button>
        )}
      </Box>

      {isLoading && <Loading message="Loading notifications..." />}

      {isError && (
        <ErrorState
          title="Could not load notifications"
          message="Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <EmptyState
          icon={<NotificationsNoneOutlinedIcon sx={{ fontSize: 40 }} />}
          title="No Notifications"
          description="You are all caught up! Trip alerts and booking confirmations will appear here."
        />
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                bgcolor: notif.isRead
                  ? 'background.paper'
                  : (t) => (t.palette.mode === 'light' ? '#f0f9ff' : 'rgba(2, 132, 199, 0.1)'),
                borderColor: notif.isRead ? 'divider' : 'primary.light',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  {!notif.isRead && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  )}
                  <Typography variant="subtitle1" fontWeight={700}>
                    {notif.title}
                  </Typography>
                  <Chip label={notif.type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {notif.message}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatFromNow(notif.createdAt)} ({formatDate(notif.createdAt, 'DD MMM, hh:mm A')})
                  </Typography>
                  {notif.actionLink && (
                    <Button component={Link} to={notif.actionLink} size="small" color="primary" sx={{ p: 0, minWidth: 0, fontWeight: 700 }}>
                      View Details →
                    </Button>
                  )}
                </Box>
              </Box>

              {!notif.isRead && (
                <IconButton
                  size="small"
                  color="primary"
                  title="Mark as read"
                  onClick={() => markReadMutation.mutate(notif.id)}
                >
                  <MarkChatReadOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
export default NotificationsPage;
