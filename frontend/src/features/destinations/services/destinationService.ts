import { apiClient } from '../../../services/apiClient';
import { Destination, PaginatedResult } from '../../../types';

export interface DestinationFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  state?: string;
  city?: string;
  minBudget?: number;
  maxBudget?: number;
  travelType?: string;
  season?: string;
  minRating?: number;
  trendingOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export const destinationService = {
  getAll: async (params?: DestinationFilterParams): Promise<PaginatedResult<Destination>> => {
    const res: any = await apiClient.get('/destinations', { params });
    return res.data || res;
  },

  getTrending: async (limit = 6): Promise<Destination[]> => {
    const res: any = await apiClient.get('/destinations/trending', { params: { limit } });
    return res.data || res;
  },

  getRecommended: async (limit = 6): Promise<Destination[]> => {
    const res: any = await apiClient.get('/destinations/recommended', { params: { limit } });
    return res.data || res;
  },

  getById: async (id: string): Promise<Destination> => {
    const res: any = await apiClient.get(`/destinations/${id}`);
    return res.data || res;
  },

  saveDestination: async (id: string) => {
    const res: any = await apiClient.post(`/destinations/${id}/save`);
    return res.data || res;
  },

  unsaveDestination: async (id: string) => {
    const res: any = await apiClient.delete(`/destinations/${id}/save`);
    return res.data || res;
  },

  getSaved: async (): Promise<Destination[]> => {
    const res: any = await apiClient.get('/destinations/saved/me');
    return res.data || res;
  },

  create: async (data: any): Promise<Destination> => {
    const res: any = await apiClient.post('/destinations', data);
    return res.data || res;
  },

  update: async (id: string, data: any): Promise<Destination> => {
    const res: any = await apiClient.patch(`/destinations/${id}`, data);
    return res.data || res;
  },

  delete: async (id: string) => {
    const res: any = await apiClient.delete(`/destinations/${id}`);
    return res.data || res;
  },
};
