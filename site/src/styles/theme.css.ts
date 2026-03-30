import { createGlobalTheme } from '@vanilla-extract/css'

export const vars = createGlobalTheme(':root', {
  color: {
    // Navy (Authority)
    navy50: '#F0F4F8',
    navy100: '#D9E2EC',
    navy200: '#BCCCDC',
    navy300: '#9FB3C8',
    navy400: '#627D98',
    navy500: '#3E6B89',
    navy600: '#1B3B5E',
    navy700: '#152E4A',
    navy800: '#102437',
    navy900: '#0A1A28',
    navy950: '#060F18',

    // Green (Transformation)
    green50: '#F2F9EE',
    green100: '#E1F0D5',
    green200: '#C3E1AB',
    green300: '#9ECD79',
    green400: '#7DB94E',
    green500: '#5EA03C',
    green600: '#4A8030',
    green700: '#3A6426',
    green800: '#2E4F1F',
    green900: '#243D18',

    // Amber (Conversion)
    amber50: '#FFF8EB',
    amber100: '#FEECC0',
    amber200: '#FDD889',
    amber300: '#FCBF49',
    amber400: '#F5A623',
    amber500: '#E8920A',
    amber600: '#C27708',
    amber700: '#9A5D06',

    // Teal (Bridge)
    teal50: '#EEF8F7',
    teal100: '#D0EDEA',
    teal200: '#9DD5D0',
    teal300: '#5FB8B2',
    teal400: '#3A9E97',
    teal500: '#2A7B78',
    teal600: '#216260',
    teal700: '#194A48',

    // Slate (Neutral)
    slate50: '#F8FAFB',
    slate100: '#F1F4F8',
    slate200: '#E3E8EF',
    slate300: '#CDD5DF',
    slate400: '#9AA5B4',
    slate500: '#697686',
    slate600: '#4B5563',
    slate700: '#364152',
    slate800: '#1E293B',
    slate900: '#0F172A',

    // Semantic
    textPrimary: '#1B3B5E',
    textBody: '#3E6B89',
    textMuted: '#697686',
    bgPage: '#F8FAFB',
    bgSurface: '#FFFFFF',
    bgAlt: '#F0F4F8',
    border: '#E3E8EF',
    link: '#2A7B78',
    linkHover: '#216260',
    ctaPrimaryBg: '#946106',
    ctaPrimaryText: '#FFFFFF',
    ctaPrimaryHover: '#F5A623',
    ctaPrimaryActive: '#C27708',
    ctaSecondaryBg: '#1B3B5E',
    ctaSecondaryText: '#FFFFFF',
    ctaSecondaryHover: '#3E6B89',
    success: '#5EA03C',
    error: '#DC2626',
    errorBg: '#FEF2F2',
    warning: '#E8920A',
    info: '#2A7B78',
    white: '#FFFFFF',
  },

  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadow: {
    sm: '0 1px 2px rgba(10, 26, 40, 0.05)',
    md: '0 4px 6px rgba(10, 26, 40, 0.07), 0 1px 3px rgba(10, 26, 40, 0.05)',
    lg: '0 10px 15px rgba(10, 26, 40, 0.08), 0 4px 6px rgba(10, 26, 40, 0.04)',
    focus: '0 0 0 3px rgba(42, 123, 120, 0.4)',
  },

  font: {
    serif: '"Fraunces Variable", Georgia, "Times New Roman", serif',
    sans: '"Space Grotesk Variable", system-ui, -apple-system, sans-serif',
  },
})
