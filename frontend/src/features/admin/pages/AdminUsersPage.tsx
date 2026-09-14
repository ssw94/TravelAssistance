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
  Tooltip,
  Pagination,
  Button,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

import { adminService } from '../services/adminService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { UserRole } from '../../../types';
import { formatDate } from '../../../utils/formatters';
import Heading, { SubHeading } from '../../../components/Heading';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import ConfirmDialog from '../../../components/ConfirmDialog';

export const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminService.getUsers({ page, limit: 10 }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => adminService.updateUserRole(id, role),
    onSuccess: () => {
      dispatch(showToast({ message: 'User role updated successfully', severity: 'success' }));
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleUserActive(id),
    onSuccess: () => {
      dispatch(showToast({ message: 'User account status updated', severity: 'info' }));
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      dispatch(showToast({ message: 'User deleted from system', severity: 'info' }));
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setDeleteDialogOpen(false);
    },
  });

  if (isLoading) return <Loading message="Loading registered users..." />;
  if (isError) return <ErrorState title="Failed to load users" onRetry={refetch} />;

  const users = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Heading badge="User Management">All Registered Users</Heading>
        <SubHeading>
          Manage user accounts, assign administrative privileges, toggle account statuses, or remove users.
        </SubHeading>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3.5 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>
                  {u.firstName} {u.lastName}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip
                    label={u.role}
                    color={u.role === UserRole.ADMIN ? 'secondary' : 'default'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={u.isActive ? 'Active' : 'Inactive'}
                    color={u.isActive ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(u.createdAt)}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title={u.role === UserRole.ADMIN ? 'Downgrade to Standard User' : 'Promote to Admin'}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          updateRoleMutation.mutate({
                            id: u.id,
                            role: u.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN,
                          })
                        }
                      >
                        {u.role === UserRole.ADMIN ? (
                          <PersonOutlineOutlinedIcon fontSize="small" />
                        ) : (
                          <AdminPanelSettingsOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={u.isActive ? 'Deactivate User' : 'Activate User'}>
                      <IconButton
                        size="small"
                        color={u.isActive ? 'success' : 'default'}
                        onClick={() => toggleStatusMutation.mutate(u.id)}
                      >
                        {u.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedUserId(u.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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

      {/* Delete User Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User Account?"
        message="Are you sure you want to permanently delete this user account? All associated trips, bookings, and reviews will be removed."
        confirmText="Delete User"
        onConfirm={() => selectedUserId && deleteUserMutation.mutate(selectedUserId)}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};
export default AdminUsersPage;
