export const Palette = {
  primary: {
    100: '#E8EEF8',
    200: '#8BB5F0', 
    300: '#4A7FD4',
    400: '#6E9BEC', 
    500: '#2E5FBF',
    700: '#1B3A7A', 
    900: '#0D1F4A',
  },

  semantic: {
    success: '#00C897',
    error:   '#FF3B30',
    warning: '#F4A800',
    info:    '#007AFF',
  },

  neutral: {
    0:    '#FFFFFF', 
    10:   '#E8EDF8', 
    50:   '#F4F6FB', 
    100:  '#E0E6F0', 
    200:  '#7A92C4', 
    500:  '#999999', 
    600:  '#2A3A5A', 
    800:  '#162850', 
    850:  '#0F1E3D', 
    900:  '#060D1F', 
    950:  '#0A1628', 
    1000: '#000000', 
  },

  translucent: {
    white:   (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    black:   (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
    primary: (opacity: number) => `rgba(27, 58, 122, ${opacity})`,
  },

  rose: {
    100: '#FFF0F5', 
    200: '#FFD1DC', 
    300: '#FFB6C1', 
    400: '#FF8DA1', 
    500: '#FF69B4', 
    700: '#DB7093', 
    900: '#880E4F', 
  },
  purple: {
    100: '#F3E5F5',
    200: '#E1BEE7',
    300: '#CE93D8',
    400: '#BA68C8',
    500: '#9C27B0',
    700: '#7B1FA2',
    900: '#4A148C',
  }
} as const;

export interface ThemeColors {
  background:    string;
  card:          string;
  cardSecondary: string;

  primary:      string;
  primaryMid:   string;
  primaryLight: string;
  primaryDark:  string;

  textPrimary:   string;
  textSecondary: string;
  textMuted:     string;

  success: string;
  error:   string;
  warning: string;
  info:    string;

  border:  string;
  shadow:  string;

  soloBadgeBg: string;
  courseBadgeBg: string;

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

  soloBadgeBg: '#10B981',
  courseBadgeBg: '#F97316',

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

  soloBadgeBg: '#10B981',
  courseBadgeBg: '#F97316',

  white:       Palette.neutral[0],
  black:       Palette.neutral[1000],
  transparent: 'transparent',
  overlay:     Palette.translucent.black(0.75),
};

export const RoseColors: ThemeColors = {
  ...LightColors,
  background:    '#FFF9FA', 
  cardSecondary: Palette.rose[100],

  primary:      Palette.rose[700],
  primaryMid:   Palette.rose[500],
  primaryLight: Palette.rose[300],
  primaryDark:  Palette.rose[900],

  soloBadgeBg:  Palette.rose[500],
  courseBadgeBg: '#F97316', 
  
  success:      Palette.rose[400], 
};

export const PurpleColors: ThemeColors = {
  ...LightColors,
  background:    '#FDFBFF', 
  cardSecondary: Palette.purple[100],

  primary:      Palette.purple[700],
  primaryMid:   Palette.purple[500],
  primaryLight: Palette.purple[300],
  primaryDark:  Palette.purple[900],

  soloBadgeBg:  Palette.purple[500],
  courseBadgeBg: '#F97316', 
  
  success:      Palette.purple[400], 
};

export const hexToRGBA = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export type ColorTheme = ThemeColors;
