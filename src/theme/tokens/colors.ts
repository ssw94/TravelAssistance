// tokens/colors.ts

// tokens/colors.ts

export const primitiveColors = {
  white: '#FFFFFF',
  black: '#000000',

  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  zinc: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
    950: '#09090B',
  },

  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  pink: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
} as const;

/**
 * Light Theme
 */
export const lightColors = {
  primary: {
    main: primitiveColors.violet[600],
    hover: primitiveColors.violet[700],
    active: primitiveColors.violet[800],
    subtle: primitiveColors.violet[50],
    contrast: primitiveColors.white,
  },

  secondary: {
    main: primitiveColors.indigo[600],
    hover: primitiveColors.indigo[700],
    active: primitiveColors.indigo[800],
    subtle: primitiveColors.indigo[50],
    contrast: primitiveColors.white,
  },

  background: {
    default: primitiveColors.zinc[50],
    surface: primitiveColors.white,
    elevated: primitiveColors.white,
    subtle: primitiveColors.zinc[100],
  },

  text: {
    primary: primitiveColors.zinc[900],
    secondary: primitiveColors.zinc[600],
    tertiary: primitiveColors.zinc[500],
    disabled: primitiveColors.zinc[400],
    inverse: primitiveColors.white,
  },

  border: {
    default: primitiveColors.zinc[200],
    subtle: primitiveColors.zinc[100],
    strong: primitiveColors.zinc[300],
    focus: primitiveColors.violet[600],
  },

  status: {
    success: primitiveColors.emerald[600],
    warning: primitiveColors.amber[600],
    error: primitiveColors.red[600],
    info: primitiveColors.sky[600],
  },

  overlay: {
    light: 'rgba(24, 24, 27, 0.04)',
    medium: 'rgba(24, 24, 27, 0.08)',
    dark: 'rgba(24, 24, 27, 0.16)',
  },
} as const;

/**
 * Dark Theme
 */
export const darkColors = {
  primary: {
    main: primitiveColors.violet[400],
    hover: primitiveColors.violet[300],
    active: primitiveColors.violet[200],
    subtle: primitiveColors.violet[900],
    contrast: primitiveColors.white,
  },

  secondary: {
    main: primitiveColors.indigo[400],
    hover: primitiveColors.indigo[300],
    active: primitiveColors.indigo[200],
    subtle: primitiveColors.indigo[900],
    contrast: primitiveColors.white,
  },

  background: {
    default: primitiveColors.zinc[950],
    surface: primitiveColors.zinc[900],
    elevated: primitiveColors.zinc[800],
    subtle: primitiveColors.zinc[800],
  },

  text: {
    primary: primitiveColors.zinc[50],
    secondary: primitiveColors.zinc[300],
    tertiary: primitiveColors.zinc[400],
    disabled: primitiveColors.zinc[500],
    inverse: primitiveColors.zinc[900],
  },

  border: {
    default: primitiveColors.zinc[700],
    subtle: primitiveColors.zinc[800],
    strong: primitiveColors.zinc[600],
    focus: primitiveColors.violet[400],
  },

  status: {
    success: primitiveColors.emerald[400],
    warning: primitiveColors.amber[400],
    error: primitiveColors.red[400],
    info: primitiveColors.sky[400],
  },

  overlay: {
    light: 'rgba(255, 255, 255, 0.04)',
    medium: 'rgba(255, 255, 255, 0.08)',
    dark: 'rgba(255, 255, 255, 0.16)',
  },
} as const;
