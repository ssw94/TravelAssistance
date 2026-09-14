import { apiClient } from '../../../services/apiClient';
import { ItineraryDay, ItineraryItem } from '../../../types';

export const itineraryService = {
  getTripItinerary: async (tripId: string): Promise<ItineraryDay[]> => {
    const res: any = await apiClient.get(`/trips/${tripId}/itinerary`);
    return res.data || res;
  },

  addDay: async (tripId: string, data: any): Promise<ItineraryDay> => {
    const res: any = await apiClient.post(`/trips/${tripId}/itinerary/days`, data);
    return res.data || res;
  },

  removeDay: async (dayId: string) => {
    const res: any = await apiClient.delete(`/itinerary/days/${dayId}`);
    return res.data || res;
  },

  addItem: async (dayId: string, data: any): Promise<ItineraryItem> => {
    const res: any = await apiClient.post(`/itinerary/days/${dayId}/items`, data);
    return res.data || res;
  },

  updateItem: async (itemId: string, data: any): Promise<ItineraryItem> => {
    const res: any = await apiClient.patch(`/itinerary/items/${itemId}`, data);
    return res.data || res;
  },

  toggleComplete: async (itemId: string): Promise<ItineraryItem> => {
    const res: any = await apiClient.patch(`/itinerary/items/${itemId}/toggle-complete`);
    return res.data || res;
  },

  deleteItem: async (itemId: string) => {
    const res: any = await apiClient.delete(`/itinerary/items/${itemId}`);
    return res.data || res;
  },

  reorderItems: async (dayId: string, items: Array<{ id: string; orderIndex: number }>) => {
    const res: any = await apiClient.patch(`/itinerary/days/${dayId}/reorder`, { items });
    return res.data || res;
  },
};
