import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = (): string => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.backgroundSecondary;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      case 'danger':
        return colors.danger;
      default:
        return colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'primary':
        return colors.primaryForeground;
      case 'secondary':
        return colors.text;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.text;
      case 'danger':
        return '#FFFFFF';
      default:
        return colors.primaryForeground;
    }
  };

  const getBorderColor = (): string => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return 'transparent';
    }
  };

  const getSizeStyles = (): { paddingVertical: number; paddingHorizontal: number; fontSize: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, fontSize: FontSizes.sm };
      case 'lg':
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl, fontSize: FontSizes.lg };
      default:
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, fontSize: FontSizes.md };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: sizeStyles.fontSize,
                marginLeft: leftIcon ? Spacing.sm : 0,
                marginRight: rightIcon ? Spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
});
