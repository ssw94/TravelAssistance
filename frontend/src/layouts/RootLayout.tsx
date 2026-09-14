import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { store, useAppDispatch, useAppSelector } from '../store/store';
import { queryClient } from '../app/queryClient';
import { getAppTheme } from '../app/theme';
import { removeToast } from '../store/slices/uiSlice';

const AppThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = React.useMemo(() => getAppTheme(mode), [mode]);
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={4500}
          onClose={() => dispatch(removeToast(toast.id))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => dispatch(removeToast(toast.id))}
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: 2.5, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ThemeProvider>
  );
};

export const RootLayout: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppThemeWrapper>
          <Outlet />
        </AppThemeWrapper>
      </QueryClientProvider>
    </Provider>
  );
};
export default RootLayout;
