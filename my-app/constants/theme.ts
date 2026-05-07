/**
 * Extended theme for POS application with status colors and semantic tokens
 */

import { Platform } from 'react-native';

// Brand colors
const primaryColor = '#0066CC';
const primaryColorDark = '#4DA3FF';

export const Colors = {
  light: {
    // Base
    text: '#11181C',
    textSecondary: '#687076',
    textMuted: '#9BA1A6',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    border: '#E6E8EB',
    
    // Brand
    primary: primaryColor,
    primaryForeground: '#FFFFFF',
    
    // Tint (navigation)
    tint: primaryColor,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryColor,
    
    // Status colors
    success: '#10B981',
    successBackground: '#ECFDF5',
    successForeground: '#065F46',
    
    warning: '#F59E0B',
    warningBackground: '#FFFBEB',
    warningForeground: '#92400E',
    
    danger: '#EF4444',
    dangerBackground: '#FEF2F2',
    dangerForeground: '#991B1B',
    
    info: '#3B82F6',
    infoBackground: '#EFF6FF',
    infoForeground: '#1E40AF',
    
    // Stock indicators
    stockHigh: '#10B981',
    stockMedium: '#F59E0B',
    stockLow: '#EF4444',
    stockOut: '#6B7280',
    
    // Payment status
    paid: '#10B981',
    paidBackground: '#ECFDF5',
    pending: '#F59E0B',
    pendingBackground: '#FFFBEB',
    
    // Order status
    orderPending: '#3B82F6',
    orderCompleted: '#10B981',
    orderCancelled: '#EF4444',
    
    // Card
    card: '#FFFFFF',
    cardBorder: '#E6E8EB',
  },
  dark: {
    // Base
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textMuted: '#687076',
    background: '#0A0A0B',
    backgroundSecondary: '#151718',
    border: '#2E3235',
    
    // Brand
    primary: primaryColorDark,
    primaryForeground: '#000000',
    
    // Tint (navigation)
    tint: primaryColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryColorDark,
    
    // Status colors
    success: '#34D399',
    successBackground: '#064E3B',
    successForeground: '#A7F3D0',
    
    warning: '#FBBF24',
    warningBackground: '#78350F',
    warningForeground: '#FDE68A',
    
    danger: '#F87171',
    dangerBackground: '#7F1D1D',
    dangerForeground: '#FECACA',
    
    info: '#60A5FA',
    infoBackground: '#1E3A5F',
    infoForeground: '#BFDBFE',
    
    // Stock indicators
    stockHigh: '#34D399',
    stockMedium: '#FBBF24',
    stockLow: '#F87171',
    stockOut: '#9CA3AF',
    
    // Payment status
    paid: '#34D399',
    paidBackground: '#064E3B',
    pending: '#FBBF24',
    pendingBackground: '#78350F',
    
    // Order status
    orderPending: '#60A5FA',
    orderCompleted: '#34D399',
    orderCancelled: '#F87171',
    
    // Card
    card: '#151718',
    cardBorder: '#2E3235',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    mono: 'monospace',
  },
});

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
