import { apiClient } from '../../../services/apiClient';
import { Expense } from '../../../types';

export const expenseService = {
  getAll: async (tripId?: string, category?: string): Promise<Expense[]> => {
    const res: any = await apiClient.get('/expenses', { params: { tripId, category } });
    return res.data || res;
  },

  getTripBreakdown: async (tripId: string) => {
    const res: any = await apiClient.get(`/expenses/trip/${tripId}/breakdown`);
    return res.data || res;
  },

  create: async (data: any): Promise<Expense> => {
    const res: any = await apiClient.post('/expenses', data);
    return res.data || res;
  },

  update: async (id: string, data: any): Promise<Expense> => {
    const res: any = await apiClient.patch(`/expenses/${id}`, data);
    return res.data || res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/expenses/${id}`);
    return res.data || res;
  },
};
