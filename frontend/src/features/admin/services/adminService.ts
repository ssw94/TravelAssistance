import { apiClient } from '../../../services/apiClient';

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
export default adminService;
