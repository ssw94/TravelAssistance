import React, { useState } from 'react';
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
  IconButton,
  Button,
  Avatar,
  Pagination,
  Grid,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { destinationService } from '../../destinations/services/destinationService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { formatCurrency } from '../../../utils/formatters';
import Heading, { SubHeading } from '../../../components/Heading';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const AdminDestinationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminDestinations', page],
    queryFn: () => destinationService.getAll({ page, limit: 10 }),
  });

  const deleteDestMutation = useMutation({
    mutationFn: (id: string) => destinationService.delete(id),
    onSuccess: () => {
      dispatch(showToast({ message: 'Destination removed from catalog', severity: 'info' }));
      queryClient.invalidateQueries({ queryKey: ['adminDestinations'] });
      setDeleteDialogOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      country: 'India',
      state: '',
      city: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      startingBudget: 15000,
      currency: 'INR',
      suggestedDuration: '4-6 days',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Destination name is required'),
      country: Yup.string().required('Country is required'),
      description: Yup.string().required('Description is required'),
      startingBudget: Yup.number().min(0),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await destinationService.create(values);
        dispatch(showToast({ message: 'Destination added to catalog! 🌴', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['adminDestinations'] });
        resetForm();
        setCreateModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to create destination', severity: 'error' }));
      }
    },
  });

  if (isLoading) return <Loading message="Loading destination catalog..." />;
  if (isError) return <ErrorState title="Failed to load destinations" onRetry={refetch} />;

  const destinations = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Heading badge={`${data?.meta?.total || 0} Total`}>Destination Catalog</Heading>
          <SubHeading>
            Publish, edit, and organize travel destinations, photo galleries, and itineraries.
          </SubHeading>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Add New Destination
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3.5 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Destination</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Starting Budget</TableCell>
              <TableCell>Suggested Days</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {destinations.map((dest) => (
              <TableRow key={dest.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={dest.coverImage} variant="rounded" sx={{ width: 44, height: 44 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800}>
                        {dest.name}
                      </Typography>
                      {dest.isTrending && <Chip label="Trending" color="secondary" size="small" sx={{ fontSize: '0.65rem', height: 18 }} />}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{dest.city ? `${dest.city}, ` : ''}{dest.country}</TableCell>
                <TableCell>★ {Number(dest.rating || 4.5).toFixed(1)} ({dest.reviewCount || 0})</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatCurrency(dest.startingBudget, dest.currency)}
                </TableCell>
                <TableCell>{dest.suggestedDuration || '3-5 days'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setSelectedDestId(dest.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>

      {/* Create Destination Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Destination to Catalog"
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input
              id="name"
              name="name"
              label="Destination Name"
              placeholder="e.g. Manali"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="country"
                  name="country"
                  label="Country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="city"
                  name="city"
                  label="City / Region"
                  placeholder="e.g. Kullu Valley"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="startingBudget"
                  name="startingBudget"
                  label="Starting Budget"
                  type="number"
                  value={formik.values.startingBudget}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="suggestedDuration"
                  name="suggestedDuration"
                  label="Suggested Duration"
                  placeholder="4-6 days"
                  value={formik.values.suggestedDuration}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Input
              id="coverImage"
              name="coverImage"
              label="Cover Image URL"
              value={formik.values.coverImage}
              onChange={formik.handleChange}
            />

            <Input
              id="description"
              name="description"
              label="Destination Overview Description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setCreateModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Destination
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Destination?"
        message="Are you sure you want to remove this destination from the public catalog?"
        confirmText="Delete"
        onConfirm={() => selectedDestId && deleteDestMutation.mutate(selectedDestId)}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};
export default AdminDestinationsPage;
