import { apiClient } from '../../../services/apiClient';
import { Review } from '../../../types';

export const reviewService = {
  getByDestination: async (destinationId: string): Promise<Review[]> => {
    const res: any = await apiClient.get(`/destinations/${destinationId}/reviews`);
    return res.data || res;
  },

  create: async (destinationId: string, data: any): Promise<Review> => {
    const res: any = await apiClient.post(`/destinations/${destinationId}/reviews`, data);
    return res.data || res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/reviews/${id}`);
    return res.data || res;
  },

  getAllForAdmin: async (): Promise<Review[]> => {
    const res: any = await apiClient.get('/admin/reviews');
    return res.data || res;
  },

  moderate: async (id: string, status: string): Promise<Review> => {
    const res: any = await apiClient.patch(`/admin/reviews/${id}/moderate`, { status });
    return res.data || res;
  },
};
