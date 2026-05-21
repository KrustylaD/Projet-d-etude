/**
 * AGRISCAN.AI — DESIGN TOKENS v1.0
 * Direction : SYNAPSE — Dark Tech Cinématique × Nature
 */

export const Colors = {
  // Couleurs Principales
  black: '#050D07',
  forest: '#0A1B0E',
  cream: '#F9F9F2',
  lime: '#D4FF50',
  slate: '#2D3A2F',

  // Couleurs Sémantiques
  success: '#3AE086',
  error: '#FF4E5C',
  warning: '#FFB443',
  info: '#4DAAFF',

  // Opacités Cream
  cream70: 'rgba(249, 249, 242, 0.70)',
  cream50: 'rgba(249, 249, 242, 0.50)',
  cream40: 'rgba(249, 249, 242, 0.40)',
  cream30: 'rgba(249, 249, 242, 0.30)',
  cream25: 'rgba(249, 249, 242, 0.25)',
  cream20: 'rgba(249, 249, 242, 0.20)',
  cream15: 'rgba(249, 249, 242, 0.15)',
  cream10: 'rgba(249, 249, 242, 0.10)',
  cream08: 'rgba(249, 249, 242, 0.08)',
  cream06: 'rgba(249, 249, 242, 0.06)',
  cream04: 'rgba(249, 249, 242, 0.04)',

  // Aliases pour les ecrans
  card: 'rgba(249, 249, 242, 0.04)',
  border: 'rgba(249, 249, 242, 0.06)',
  creamLow: 'rgba(249, 249, 242, 0.45)',

  // Opacités Lime
  lime60: 'rgba(212, 255, 80, 0.60)',
  lime50: 'rgba(212, 255, 80, 0.50)',
  lime40: 'rgba(212, 255, 80, 0.40)',
  lime25: 'rgba(212, 255, 80, 0.25)',
  lime15: 'rgba(212, 255, 80, 0.15)',
  lime12: 'rgba(212, 255, 80, 0.12)',
  lime10: 'rgba(212, 255, 80, 0.10)',
  lime08: 'rgba(212, 255, 80, 0.08)',

  // Opacités Forest
  forest80: 'rgba(10, 27, 14, 0.80)',
  forest60: 'rgba(10, 27, 14, 0.60)',
  forest50: 'rgba(10, 27, 14, 0.50)',
  forest40: 'rgba(10, 27, 14, 0.40)',

  // Opacités Slate
  slate40: 'rgba(45, 58, 47, 0.40)',

  // Opacités Sémantiques
  success15: 'rgba(58, 224, 134, 0.15)',
  success12: 'rgba(58, 224, 134, 0.12)',
  success10: 'rgba(58, 224, 134, 0.10)',
  error15: 'rgba(255, 78, 92, 0.15)',
  error12: 'rgba(255, 78, 92, 0.12)',
  error10: 'rgba(255, 78, 92, 0.10)',
  warning15: 'rgba(255, 180, 67, 0.15)',
  warning12: 'rgba(255, 180, 67, 0.12)',
  warning10: 'rgba(255, 180, 67, 0.10)',
  warning06: 'rgba(255, 180, 67, 0.06)',
  info15: 'rgba(77, 170, 255, 0.15)',
  info12: 'rgba(77, 170, 255, 0.12)',
  info10: 'rgba(77, 170, 255, 0.10)',
} as const;

export const Typography = {
  // Font Families
  display: 'System', // Plus Jakarta Sans not available, using system bold
  bodyFamily: 'System',
  mono: 'Courier', // JetBrains Mono alternative

  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,

  // Font Sizes
  displayXL: 48,
  displayL: 36,
  h1: 28,
  h2: 22,
  h3: 18,
  h4: 16,
  bodyLarge: 17,
  body: 15,
  bodySmall: 13,
  label: 11,
  caption: 10,
  dataDisplay: 32,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  squircle: 28,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.30,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 12,
    elevation: 8,
  },
  glowMedium: {
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  glowIntense: {
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
} as const;
