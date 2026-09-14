import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  isLoading: boolean;
}

const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem('travel_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem('travel_access_token');
const initialUser = getInitialUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken && !!initialUser,
  role: initialUser ? initialUser.role : UserRole.GUEST,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.role = user.role;
      localStorage.setItem('travel_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('travel_refresh_token', refreshToken);
      }
      localStorage.setItem('travel_user', JSON.stringify(user));
    },
    updateUserProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('travel_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = UserRole.GUEST;
      localStorage.removeItem('travel_access_token');
      localStorage.removeItem('travel_refresh_token');
      localStorage.removeItem('travel_user');
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUserProfile, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
