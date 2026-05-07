import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Colors, Spacing, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency } from '@/utils/format';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  trend,
}: StatCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: (iconColor || colors.primary) + '15' },
          ]}
        >
          <Ionicons
            name={icon}
            size={24}
            color={iconColor || colors.primary}
          />
        </View>
        {trend && (
          <View
            style={[
              styles.trendContainer,
              {
                backgroundColor: trend.isPositive
                  ? colors.successBackground
                  : colors.dangerBackground,
              },
            ]}
          >
            <Ionicons
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={14}
              color={trend.isPositive ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.trendText,
                {
                  color: trend.isPositive ? colors.success : colors.danger,
                },
              ]}
            >
              {trend.value}%
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: colors.text }]}>{formattedValue}</Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    gap: 2,
  },
  trendText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  value: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
});
