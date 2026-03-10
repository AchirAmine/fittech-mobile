// Note: Colors are now managed dynamically via ThemeContext and useTheme hook.
// Do not use these static colors in components.

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  fontSize: {
    h1: 40,
    h2: 32,
    h3: 24,
    h4: 20,
    h5: 16,
    body1: 16,
    body2: 14,
    caption: 12,
    micro: 10,
  },
} as const;

export const Theme = {
  Spacing,
  Radius,
  Typography,
} as const;
