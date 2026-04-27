export const colors = {
  primary: '#066CF4',
  primaryDark: '#0556C2',
  primaryLight: '#E5EFFE',

  accent: '#7B5CFF',
  accentLight: '#EFE9FF',

  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  bg: '#FFFFFF',
  bgSoft: '#F5F7FA',
  bgCard: '#FFFFFF',

  text: '#0B1220',
  textSecondary: '#5B6478',
  textMuted: '#94A0B5',

  border: '#E6EAF1',
  divider: '#EEF1F6',

  blob1: '#066CF4',
  blob2: '#7B5CFF',
  blob3: '#22C55E',
  blob4: '#FFB020',

  bubbleAi: '#F1F4FA',
  bubbleUser: '#066CF4',
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const fontFamily = {
  display: 'PlusJakartaSans_700Bold',
  displayMedium: 'PlusJakartaSans_600SemiBold',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemibold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

export const typography = {
  hero: { fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38, color: colors.text },
  h1: { fontFamily: fontFamily.display, fontSize: 26, lineHeight: 32, color: colors.text },
  h2: { fontFamily: fontFamily.displayMedium, fontSize: 20, lineHeight: 26, color: colors.text },
  h3: { fontFamily: fontFamily.bodyBold, fontSize: 17, lineHeight: 22, color: colors.text },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.text },
  bodySmall: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  label: { fontFamily: fontFamily.bodySemibold, fontSize: 13, lineHeight: 16, color: colors.text },
  caption: { fontFamily: fontFamily.bodyMedium, fontSize: 11, lineHeight: 14, color: colors.textMuted, letterSpacing: 0.5 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  cardLarge: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 6,
  },
  fab: {
    shadowColor: '#066CF4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
