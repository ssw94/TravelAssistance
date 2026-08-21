import type { Components, Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
  // =====================================================
  // Button
  // =====================================================

  MuiButton: {
    defaultProps: {
      variant: 'contained',
      size: 'medium',
      disableElevation: true,
    },

    styleOverrides: {
      root: {
        minHeight: 40,
        borderRadius: 8,
        padding: '0 16px',
        textTransform: 'none',
        fontWeight: 600,
      },

      sizeSmall: {
        minHeight: 32,
        padding: '0 12px',
      },

      sizeLarge: {
        minHeight: 44,
        padding: '0 20px',
      },
    },
  },

  // =====================================================
  // TextField
  // =====================================================

  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
    },
  },

  // =====================================================
  // Select
  // =====================================================

  MuiSelect: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
    },
  },

  // =====================================================
  // Checkbox
  // =====================================================

  MuiCheckbox: {
    defaultProps: {
      size: 'medium',
    },

    styleOverrides: {
      root: {
        padding: 8,
      },
    },
  },

  // =====================================================
  // Radio
  // =====================================================

  MuiRadio: {
    defaultProps: {
      size: 'medium',
    },

    styleOverrides: {
      root: {
        padding: 8,
      },
    },
  },

  // =====================================================
  // Switch
  // =====================================================

  MuiSwitch: {
    defaultProps: {
      size: 'medium',
    },
  },

  // =====================================================
  // Autocomplete
  // =====================================================

  MuiAutocomplete: {
    defaultProps: {
      size: 'medium',
    },
  },
};
