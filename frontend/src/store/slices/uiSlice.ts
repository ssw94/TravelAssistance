import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastNotification {
  id: string;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface UiState {
  toasts: ToastNotification[];
  isChatDrawerOpen: boolean;
}

const initialState: UiState = {
  toasts: [],
  isChatDrawerOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; severity?: 'success' | 'info' | 'warning' | 'error' }>) => {
      state.toasts.push({
        id: Math.random().toString(36).substring(7),
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    toggleChatDrawer: (state) => {
      state.isChatDrawerOpen = !state.isChatDrawerOpen;
    },
    setChatDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatDrawerOpen = action.payload;
    },
  },
});

export const { showToast, removeToast, toggleChatDrawer, setChatDrawerOpen } = uiSlice.actions;
export default uiSlice.reducer;
