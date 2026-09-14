import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { expenseService } from '../services/expenseService';
import { tripService } from '../../trips/services/tripService';
import { useAppDispatch } from '../../../store/store';
import { showToast } from '../../../store/slices/uiSlice';
import { ExpenseCategory } from '../../../types';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import Loading from '../../../components/Loading';
import ErrorState from '../../../components/ErrorState';
import EmptyState from '../../../components/EmptyState';
import Heading, { SubHeading } from '../../../components/Heading';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useFormik } from 'formik';
import { expenseSchema } from '../../../utils/validationSchemas';

export const ExpensesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: expenses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['expenses', selectedCategory],
    queryFn: () => expenseService.getAll(undefined, selectedCategory === 'ALL' ? undefined : selectedCategory),
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getAll(),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      dispatch(showToast({ message: 'Expense deleted', severity: 'info' }));
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setDeleteDialogOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      amount: 1200,
      category: ExpenseCategory.FOOD,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      tripId: '',
      notes: '',
    },
    validationSchema: expenseSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await expenseService.create(values);
        dispatch(showToast({ message: 'Expense logged successfully! 💰', severity: 'success' }));
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        resetForm();
        setAddModalOpen(false);
      } catch (err: any) {
        dispatch(showToast({ message: err.response?.data?.message || 'Failed to log expense', severity: 'error' }));
      }
    },
  });

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);
  const remaining = Math.max(0, totalBudget - totalSpent);

  // Category Aggregates
  const categoryTotals: Record<string, number> = {};
  Object.values(ExpenseCategory).forEach((cat) => {
    categoryTotals[cat] = 0;
  });
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Heading badge="Financial Overview">Budget & Expense Tracker</Heading>
          <SubHeading>
            Monitor expenditures across flights, stays, food, and activities to keep your travel on budget.
          </SubHeading>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Log Expense
        </Button>
      </Box>

      {/* Top 3 KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, borderRadius: 3.5, background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff' }}>
            <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700 }}>
              TOTAL PLANNED BUDGET
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ my: 0.5 }}>
              {formatCurrency(totalBudget)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Across {trips.length} planned vacations
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, borderRadius: 3.5, bgcolor: (t) => (t.palette.mode === 'light' ? '#ffffff' : '#111827') }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              TOTAL SPENT TO DATE
            </Typography>
            <Typography variant="h4" fontWeight={800} color="error.main" sx={{ my: 0.5 }}>
              {formatCurrency(totalSpent)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {expenses.length} recorded transactions
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, borderRadius: 3.5, bgcolor: (t) => (t.palette.mode === 'light' ? '#ffffff' : '#111827') }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              REMAINING BALANCE
            </Typography>
            <Typography variant="h4" fontWeight={800} color="success.main" sx={{ my: 0.5 }}>
              {formatCurrency(remaining)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Available safe spending limit
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Spending Breakdown by Category */}
      <Paper sx={{ p: 3.5, borderRadius: 3.5, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Category Spending Breakdown
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
            return (
              <Grid item key={cat} xs={12} sm={6} md={3}>
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'background.default', border: (t) => `1px solid ${t.palette.divider}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      {cat}
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {pct}%
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {formatCurrency(amount)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{ height: 5, borderRadius: 2.5, mt: 1 }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Category Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Chip
          label="All Categories"
          onClick={() => setSelectedCategory('ALL')}
          color={selectedCategory === 'ALL' ? 'primary' : 'default'}
          sx={{ fontWeight: 700 }}
        />
        {Object.values(ExpenseCategory).map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => setSelectedCategory(cat)}
            color={selectedCategory === cat ? 'primary' : 'default'}
            variant={selectedCategory === cat ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>

      {/* Expenses List */}
      {isLoading && <Loading message="Loading expenses..." />}

      {isError && (
        <ErrorState
          title="Could not load expenses"
          message="Please check your network connection."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && expenses.length === 0 && (
        <EmptyState
          icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 40 }} />}
          title="No Expenses Recorded"
          description="Log receipts, dining bills, and transport costs to track spending against your travel budget."
          actionText="Log First Expense"
          onAction={() => setAddModalOpen(true)}
        />
      )}

      {!isLoading && !isError && expenses.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {expenses.map((exp) => (
            <Card key={exp.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                  <Chip label={exp.category} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {exp.title}
                  </Typography>
                  {exp.trip && (
                    <Chip label={`Trip: ${exp.trip.name}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  📅 {formatDate(exp.date)} {exp.paymentMethod ? `• Paid via ${exp.paymentMethod}` : ''} {exp.notes ? `• "${exp.notes}"` : ''}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" fontWeight={800} color="error.main">
                  -{formatCurrency(exp.amount, exp.currency)}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedExpenseId(exp.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Log Expense Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Log New Travel Expense"
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input
              id="title"
              name="title"
              label="Expense Description"
              placeholder="e.g. Seafood Dinner at Martin's Corner"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="amount"
                  name="amount"
                  label="Amount"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              <Grid item xs={6}>
                <Select
                  id="category"
                  name="category"
                  label="Expense Category"
                  options={Object.values(ExpenseCategory).map((c) => ({ value: c, label: c }))}
                  value={formik.values.category}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  id="date"
                  name="date"
                  label="Expense Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  id="paymentMethod"
                  name="paymentMethod"
                  label="Payment Method"
                  placeholder="e.g. Credit Card / UPI / Cash"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            {trips.length > 0 && (
              <Select
                id="tripId"
                name="tripId"
                label="Assign to Trip (Optional)"
                options={[{ value: '', label: 'General / Unassigned' }, ...trips.map((t) => ({ value: t.id, label: t.name }))]}
                value={formik.values.tripId}
                onChange={formik.handleChange}
              />
            )}

            <Input
              id="notes"
              name="notes"
              label="Notes"
              multiline
              rows={2}
              placeholder="Add details, receipt notes, or tips..."
              value={formik.values.notes}
              onChange={formik.handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
              <Button onClick={() => setAddModalOpen(false)} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Log Expense
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Expense Record?"
        message="Are you sure you want to delete this expense record? This will adjust your budget balance."
        confirmText="Delete"
        onConfirm={() => selectedExpenseId && deleteExpenseMutation.mutate(selectedExpenseId)}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};
export default ExpensesPage;
