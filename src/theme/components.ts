import type { Components } from "@mui/material/styles";

export const components: Components = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },

    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: "10px 24px",
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      fullWidth: true,
      variant: "outlined",
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
      },
    },
  },
};
