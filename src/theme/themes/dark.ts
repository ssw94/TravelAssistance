// themes/dark.ts

import { createTheme } from '@mui/material/styles';

import {
  darkColors,
  typography,
  radius,
  shadows,
  breakpoints,
} from '../tokens';
import { components } from '../components';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: darkColors.primary.main,
      light: darkColors.primary.hover,
      dark: darkColors.primary.active,
      contrastText: darkColors.primary.contrast,
    },

    secondary: {
      main: darkColors.secondary.main,
      light: darkColors.secondary.hover,
      dark: darkColors.secondary.active,
      contrastText: darkColors.secondary.contrast,
    },

    background: {
      default: darkColors.background.default,
      paper: darkColors.background.surface,
    },

    text: {
      primary: darkColors.text.primary,
      secondary: darkColors.text.secondary,
      disabled: darkColors.text.disabled,
    },

    divider: darkColors.border.default,

    success: {
      main: darkColors.status.success,
    },

    warning: {
      main: darkColors.status.warning,
    },

    error: {
      main: darkColors.status.error,
    },

    info: {
      main: darkColors.status.info,
    },
  },

  typography: {
    fontFamily: typography.fontFamily.sans,

    h1: {
      fontSize: typography.fontSize['6xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },

    h2: {
      fontSize: typography.fontSize['5xl'],
      fontWeight: typography.fontWeight.bold,
    },

    h3: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.semibold,
    },

    h4: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
    },

    body1: {
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.normal,
    },

    body2: {
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.normal,
    },

    button: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semibold,
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: radius.md,
  },

  shadows: [
    shadows.none,
    shadows.xs,
    shadows.sm,
    shadows.sm,
    shadows.md,
    shadows.md,
    shadows.md,
    shadows.lg,
    shadows.lg,
    shadows.lg,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
    shadows.xl,
  ],

  breakpoints: {
    values: breakpoints,
  },
  components
});
