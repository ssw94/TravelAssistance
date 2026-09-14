import { apiClient } from '../../../services/apiClient';
import { User } from '../../../types';

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const res: any = await apiClient.post('/auth/login', credentials);
    return res.data || res;
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const res: any = await apiClient.post('/auth/register', userData);
    return res.data || res;
  },

  forgotPassword: async (data: { email: string }) => {
    const res: any = await apiClient.post('/auth/forgot-password', data);
    return res.data || res;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const res: any = await apiClient.post('/auth/reset-password', data);
    return res.data || res;
  },

  logout: async (refreshToken?: string) => {
    const res: any = await apiClient.post('/auth/logout', { refreshToken });
    return res.data || res;
  },

  logoutAll: async () => {
    const res: any = await apiClient.post('/auth/logout-all');
    return res.data || res;
  },

  getProfile: async (): Promise<User> => {
    const res: any = await apiClient.get('/users/me');
    return res.data || res;
  },

  updateProfile: async (data: any): Promise<User> => {
    const res: any = await apiClient.patch('/users/me', data);
    return res.data || res;
  },

  changePassword: async (data: any) => {
    const res: any = await apiClient.patch('/users/change-password', data);
    return res.data || res;
  },
};
