const Palette = {
  // Brand Colors (Deep Blue)
  primary: {
    100: '#E8EEF8',
    200: '#8BB5F0', // primaryLight (dark)
    300: '#4A7FD4',
    400: '#6E9BEC', // primaryMid (dark)
    500: '#2E5FBF',
    700: '#1B3A7A', // Primary Brand
    900: '#0D1F4A',
  },

  // Functional/Status Colors
  semantic: {
    success: '#00C897',
    error:   '#FF3B30',
    warning: '#F4A800',
    info:    '#007AFF',
  },

  // Neutrals/Base Colors
  neutral: {
    0:    '#FFFFFF', // pureWhite
    10:   '#E8EDF8', // textPrimary (dark)
    50:   '#F4F6FB', // lightBackground
    100:  '#E0E6F0', // lightBorder
    200:  '#7A92C4', // textSecondary
    500:  '#999999', // textMuted (light)
    600:  '#2A3A5A', // textMuted (dark)
    800:  '#162850', // cardSecondary (dark)
    850:  '#0F1E3D', // card (dark)
    900:  '#060D1F', // darkBackground
    950:  '#0A1628', // textPrimary (light)
    1000: '#000000', // pureBlack
  },

  // Translucent/Overlays
  translucent: {
    white:   (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    black:   (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
    primary: (opacity: number) => `rgba(27, 58, 122, ${opacity})`,
  },
} as const;

/**
 * Interface definition for the application theme colors.
 * Ensures Light and Dark modes remain synchronized.
 */
export interface ThemeColors {
  // Backgrounds
  background:    string;
  card:          string;
  cardSecondary: string;

  // Primary
  primary:      string;
  primaryMid:   string;
  primaryLight: string;
  primaryDark:  string;

  // Text
  textPrimary:   string;
  textSecondary: string;
  textMuted:     string;

  // Status
  success: string;
  error:   string;
  warning: string;
  info:    string;

  // UI Elements
  border:  string;
  shadow:  string;

  // Base
  white:       string;
  black:       string;
  transparent: 'transparent';
  overlay:     string;
}

export const LightColors: ThemeColors = {
  background:    Palette.neutral[50],
  card:          Palette.neutral[0],
  cardSecondary: Palette.primary[100],

  primary:      Palette.primary[700],
  primaryMid:   Palette.primary[500],
  primaryLight: Palette.primary[300],
  primaryDark:  Palette.primary[900],

  textPrimary:   Palette.neutral[950],
  textSecondary: Palette.neutral[200],
  textMuted:     Palette.neutral[500],

  success: Palette.semantic.success,
  error:   Palette.semantic.error,
  warning: Palette.semantic.warning,
  info:    Palette.semantic.info,

  border:  Palette.neutral[100],
  shadow:  Palette.translucent.black(0.1),

  white:       Palette.neutral[0],
  black:       Palette.neutral[1000],
  transparent: 'transparent',
  overlay:     Palette.translucent.black(0.5),
};

export const DarkColors: ThemeColors = {
  background:    Palette.neutral[900],
  card:          Palette.neutral[850],
  cardSecondary: Palette.neutral[800],

  primary:      Palette.primary[300],
  primaryMid:   Palette.primary[400],
  primaryLight: Palette.primary[200],
  primaryDark:  Palette.primary[700],

  textPrimary:   Palette.neutral[10],
  textSecondary: Palette.neutral[200],
  textMuted:     Palette.neutral[600],

  success: Palette.semantic.success,
  error:   Palette.semantic.error,
  warning: Palette.semantic.warning,
  info:    Palette.semantic.info,

  border:  Palette.neutral[850],
  shadow:  Palette.translucent.black(0.3),

  white:       Palette.neutral[0],
  black:       Palette.neutral[1000],
  transparent: 'transparent',
  overlay:     Palette.translucent.black(0.75),
};

export const hexToRGBA = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export type ColorTheme = ThemeColors;
