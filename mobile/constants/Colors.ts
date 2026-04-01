// Design tokens — exact match to HomeHive web tailwind.config.js

export const Colors = {
  // Primary brand (gray-blue scale) — same as web primary.*
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b', // main button / hero bg
    900: '#0f172a',
  },

  // Neutral grays — same as web neutral.*
  neutral: {
    25: '#fefefe',
    50: '#fafafa',
    100: '#f5f5f5', // app background
    150: '#f0f0f0',
    200: '#e5e5e5', // borders / dividers
    300: '#d4d4d4',
    400: '#a3a3a3', // muted text
    500: '#737373', // secondary text
    600: '#525252',
    700: '#404040',
    800: '#262626', // primary text
    900: '#171717',
    950: '#0a0a0a',
  },

  // Accent colors
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // Semantic shortcuts (use these throughout screens)
  white: '#ffffff',
  black: '#000000',
  background: '#f5f5f5',
  card: '#ffffff',
  border: '#e5e5e5',
  text: '#262626',
  textSecondary: '#737373',
  textMuted: '#a3a3a3',
  buttonPrimary: '#1e293b',
  buttonText: '#ffffff',
  star: '#f59e0b',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};
