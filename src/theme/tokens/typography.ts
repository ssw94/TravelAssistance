// tokens/typography.ts

export const typography = {
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    mono: [
      '"JetBrains Mono"',
      '"Fira Code"',
      'monospace',
    ].join(','),
  },

  fontSize: {
    xs: '0.75rem',      // 12
    sm: '0.8125rem',    // 13
    md: '0.875rem',     // 14
    lg: '0.9375rem',    // 15
    xl: '1rem',         // 16
    '2xl': '1.125rem',  // 18
    '3xl': '1.25rem',   // 20
    '4xl': '1.5rem',    // 24
    '5xl': '1.875rem',  // 30
    '6xl': '2rem',      // 32
    '7xl': '2.25rem',   // 36
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;
