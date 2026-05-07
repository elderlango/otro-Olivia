import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export function Badge({ children, variant = 'default', size = 'md', style }: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.successBackground;
      case 'warning':
        return colors.warningBackground;
      case 'danger':
        return colors.dangerBackground;
      case 'info':
        return colors.infoBackground;
      case 'outline':
        return 'transparent';
      default:
        return colors.backgroundSecondary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.successForeground;
      case 'warning':
        return colors.warningForeground;
      case 'danger':
        return colors.dangerForeground;
      case 'info':
        return colors.infoForeground;
      case 'outline':
        return colors.text;
      default:
        return colors.textSecondary;
    }
  };

  const getBorderColor = (): string => {
    if (variant === 'outline') return colors.border;
    return 'transparent';
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: size === 'sm' ? Spacing.xs : Spacing.xs + 2,
          paddingHorizontal: size === 'sm' ? Spacing.sm : Spacing.md,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: size === 'sm' ? FontSizes.xs : FontSizes.sm,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: FontWeights.medium,
  },
});
