import { apiClient } from '../../../services/apiClient';
import { Booking } from '../../../types';

export const bookingService = {
  getAll: async (tripId?: string, type?: string): Promise<Booking[]> => {
    const res: any = await apiClient.get('/bookings', { params: { tripId, type } });
    return res.data || res;
  },

  getById: async (id: string): Promise<Booking> => {
    const res: any = await apiClient.get(`/bookings/${id}`);
    return res.data || res;
  },

  create: async (data: any): Promise<Booking> => {
    const res: any = await apiClient.post('/bookings', data);
    return res.data || res;
  },

  update: async (id: string, data: any): Promise<Booking> => {
    const res: any = await apiClient.patch(`/bookings/${id}`, data);
    return res.data || res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/bookings/${id}`);
    return res.data || res;
  },
};
