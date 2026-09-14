import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Rating,
  Button,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { reviewService } from '../../reviews/services/reviewService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { formatDate } from '../../../utils/formatters';
import { ReviewStatus } from '../../../types';
import Heading, { SubHeading } from '../../../components/Heading';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';

export const AdminReviewsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: () => reviewService.getAllForAdmin(),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      reviewService.moderate(id, status),
    onSuccess: (_, variables) => {
      dispatch(
        showToast({
          message: `Review marked as ${variables.status.toLowerCase()}`,
          severity: 'info',
        }),
      );
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
  });

  if (isLoading) return <Loading message="Loading submitted reviews for moderation..." />;
  if (isError) return <ErrorState title="Failed to load reviews" onRetry={refetch} />;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Heading badge={`${reviews.length} Total`}>Review Moderation</Heading>
        <SubHeading>
          Review community feedback, maintain travel review quality, and approve or reject flagged submissions.
        </SubHeading>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3.5 }}>
        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No reviews pending moderation.
          </Typography>
        ) : (
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Destination</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Review</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Moderation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((rev) => (
                <TableRow key={rev.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{rev.destination?.name || 'Destination'}</TableCell>
                  <TableCell>{rev.user?.firstName} {rev.user?.lastName}</TableCell>
                  <TableCell>
                    <Rating value={rev.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {rev.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {rev.comment}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={rev.status}
                      size="small"
                      color={rev.status === ReviewStatus.APPROVED ? 'success' : (rev.status === ReviewStatus.REJECTED ? 'error' : 'warning')}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(rev.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {rev.status !== ReviewStatus.APPROVED && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleOutlineIcon />}
                          onClick={() => moderateMutation.mutate({ id: rev.id, status: ReviewStatus.APPROVED })}
                        >
                          Approve
                        </Button>
                      )}
                      {rev.status !== ReviewStatus.REJECTED && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<HighlightOffIcon />}
                          onClick={() => moderateMutation.mutate({ id: rev.id, status: ReviewStatus.REJECTED })}
                        >
                          Reject
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};
export default AdminReviewsPage;
