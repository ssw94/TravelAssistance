import { apiClient } from '../../../services/apiClient';
import { Notification, AssistantResponse } from '../../../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res: any = await apiClient.get('/notifications');
    return res.data || res;
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const res: any = await apiClient.get('/notifications/unread-count');
    return res.data || res;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const res: any = await apiClient.patch(`/notifications/${id}/read`);
    return res.data || res;
  },

  markAllAsRead: async () => {
    const res: any = await apiClient.patch('/notifications/read-all');
    return res.data || res;
  },
};

export const assistantService = {
  chat: async (
    message: string,
    history?: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<AssistantResponse> => {
    const res: any = await apiClient.post('/assistant/chat', { message, history });
    return res.data || res;
  },
};

export const adminService = {
  getMetrics: async () => {
    const res: any = await apiClient.get('/admin/metrics');
    return res.data || res;
  },

  getUsers: async (params?: any) => {
    const res: any = await apiClient.get('/users', { params });
    return res.data || res;
  },

  updateUserRole: async (id: string, role: string) => {
    const res: any = await apiClient.patch(`/users/${id}/role`, { role });
    return res.data || res;
  },

  toggleUserActive: async (id: string) => {
    const res: any = await apiClient.patch(`/users/${id}/toggle-status`);
    return res.data || res;
  },

  deleteUser: async (id: string) => {
    const res: any = await apiClient.delete(`/users/${id}`);
    return res.data || res;
  },
};
