// Theme derived from Airwave production app (wa-app-ios)
// Source: src/utilities/colors.js + src/utilities/Fonts.js

export const colors = {
  // Brand
  primary: '#165BC3',        // COLORS.purple / blurplePrimary
  primaryMedium: '#ADCEFF',
  primaryLight: '#165BC314',  // blurpleLight 8%
  primaryLight15: 'rgba(22, 91, 195, 0.15)',
  primaryDark: '#032962',
  lavender: '#d6e5fb',
  wavePurple: '#3C3A99',
  polyPurple: '#2D81FF',

  // Semantic
  danger: '#FF3B30',          // crimsonRed / errorRed
  dangerLight: '#FEF2F2',     // coralRed
  success: '#49AE7B',         // successGreen
  successLight: '#DFFFEF',    // brandGreenLight
  warning: '#FF933B',         // brandOrangePrimary
  warningLight: '#FFECDC',    // brandOrangeLight
  brandRedLight: '#FFDBE4',
  brandGreenText: '#106C3E',
  brandOrangeText: '#B14F00',
  brandRedText: '#A12A48',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  almostBlack: '#1A1A1A',
  crystalGray: '#111729',     // neutral900
  paperGray: '#364153',
  cloudBlack: '#20293A',
  smokeGray: '#525A64',
  coolText: '#677489',        // neutral text
  neutral: '#677489',
  neutral400: '#97A3B6',      // gray
  neutral500: '#525252',
  lightNeutral: '#959595',    // spanishGray
  linkBlack: '#A3A3A3',
  stoneGray: '#D4D4D6',
  rearBlack: '#CDD5E0',
  neutralGray: '#E3E8EF',     // neutral200
  neutral250: '#DAE3EE',
  neutral225: '#DFDFDF',
  neutral150: '#E7E7E7',
  coolMedium: '#E5EAF0',
  linkGray: '#E9E9EB',
  settingsGray: '#EDEDED',
  coolLight: '#F2F5F9',       // neutral100
  neutral300: '#F7F9FC',
  cloudGray: '#F6F6F6',
  coolGray: '#F5F5F5',
  borderGray: '#F0F1F5',
  divider: '#f2f2f2',

  // Transparency
  lightBlack: '#3C3C43',
  smokeBlack: '#3C3C43CC',
  secondaryGray: '#3C3C4399',
  lightGrey: '#3C3C435C',
  rearGray: '#3C3C432E',
  lightGray: '#00000030',
  dimBackground: 'rgba(0,0,0,0.8)',
  darkTransparent: 'rgba(0,0,0,0.3)',
  semiTransparent: 'rgba(255,255,255,0.5)',
  placeholderColor: 'rgba(0, 0, 0, 0.4)',
  modalGray: '#F5F5F5B2',
  transparentWhite: '#F2F2F2CC',
  transparent: 'transparent',

  // Jarvis / AI
  jarvisBackground: '#ebf1fa',

  // Skeleton
  skeletonFirstColor: '#ecf1f8',
  skeletonSecondColor: '#f3f5f8',

  // Status
  redStatus: '#D64949',
  cellRipple: '#E5EAF0',
  blurpleLightSolid: '#e5eaf2',

  // Aliases matching the prototype's original API
  background: '#FFFFFF',
  surface: '#F6F6F6',
  border: '#F0F1F5',
  textPrimary: '#1A1A1A',     // almostBlack
  textSecondary: '#677489',   // coolText
  textTertiary: '#97A3B6',    // neutral400 / gray
  overlay: 'rgba(0,0,0,0.4)',
  gray50: '#F7F9FC',
  gray100: '#F6F6F6',
  gray200: '#E3E8EF',
  gray300: '#CDD5E0',
  gray400: '#97A3B6',
  gray500: '#677489',
  gray600: '#525A64',
  gray700: '#364153',
  gray800: '#20293A',
  gray900: '#111729',
}

export const fonts = {
  family: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  size: {
    xs: '10px',    // tiny_medium (10)
    sm: '12px',    // small (12)
    md: '14px',    // regular (14)
    lg: '16px',    // medium (16)
    xl: '18px',    // extra_medium (18)
    xxl: '20px',   // large (20)
    xxxl: '24px',  // very_large (24)
    mega: '32px',  // big_title (32)
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
}

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '20px',
  pill: '61px',   // FilledButton borderRadius
  full: '9999px',
}
