import { apiClient } from '../../../services/apiClient';
import { Trip } from '../../../types';

export const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const res: any = await apiClient.get('/trips');
    return res.data || res;
  },

  getById: async (id: string): Promise<Trip> => {
    const res: any = await apiClient.get(`/trips/${id}`);
    return res.data || res;
  },

  getSummary: async (id: string) => {
    const res: any = await apiClient.get(`/trips/${id}/summary`);
    return res.data || res;
  },

  create: async (data: any): Promise<Trip> => {
    const res: any = await apiClient.post('/trips', data);
    return res.data || res;
  },

  update: async (id: string, data: any): Promise<Trip> => {
    const res: any = await apiClient.patch(`/trips/${id}`, data);
    return res.data || res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/trips/${id}`);
    return res.data || res;
  },
};
