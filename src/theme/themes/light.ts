// themes/light.ts

import { createTheme } from '@mui/material/styles';

import {
  lightColors,
  typography,
  radius,
  shadows,
  breakpoints,
} from '../tokens';
import { components } from '../components';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: lightColors.primary.main,
      light: lightColors.primary.hover,
      dark: lightColors.primary.active,
      contrastText: lightColors.primary.contrast,
    },

    secondary: {
      main: lightColors.secondary.main,
      light: lightColors.secondary.hover,
      dark: lightColors.secondary.active,
      contrastText: lightColors.secondary.contrast,
    },

    background: {
      default: lightColors.background.default,
      paper: lightColors.background.surface,
    },

    text: {
      primary: lightColors.text.primary,
      secondary: lightColors.text.secondary,
      disabled: lightColors.text.disabled,
    },

    divider: lightColors.border.default,

    success: {
      main: lightColors.status.success,
    },

    warning: {
      main: lightColors.status.warning,
    },

    error: {
      main: lightColors.status.error,
    },

    info: {
      main: lightColors.status.info,
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
  components,
});
