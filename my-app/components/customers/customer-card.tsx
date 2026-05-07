import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency, formatPhone, formatTimeAgo } from '@/utils/format';
import type { Customer } from '@/types';

interface CustomerCardProps {
  customer: Customer;
  onPress?: () => void;
  compact?: boolean;
}

export function CustomerCard({ customer, onPress, compact = false }: CustomerCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (compact) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.compactContainer,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {customer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>
            {customer.name}
          </Text>
          {customer.debtAmount > 0 && (
            <Badge variant="warning" size="sm">
              Debe {formatCurrency(customer.debtAmount)}
            </Badge>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
              {customer.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{customer.name}</Text>
            {customer.phone && (
              <Text style={[styles.phone, { color: colors.textSecondary }]}>
                {formatPhone(customer.phone)}
              </Text>
            )}
          </View>
          {customer.debtAmount > 0 && (
            <Badge variant="warning">
              Debe {formatCurrency(customer.debtAmount)}
            </Badge>
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total compras
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatCurrency(customer.totalPurchases)}
            </Text>
          </View>
          {customer.lastPurchaseAt && (
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Ultima visita
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatTimeAgo(customer.lastPurchaseAt)}
              </Text>
            </View>
          )}
        </View>

        {customer.notes && (
          <View style={[styles.notesContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.notes, { color: colors.textSecondary }]}>
              {customer.notes}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Ver historial de pedidos
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  phone: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: 6,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  notes: {
    fontSize: FontSizes.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerText: {
    fontSize: FontSizes.sm,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  compactInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  compactName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
});
