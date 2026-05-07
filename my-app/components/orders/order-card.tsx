import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency, formatRelativeDate, formatOrderNumber } from '@/utils/format';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getStatusVariant = (): 'info' | 'success' | 'danger' => {
    switch (order.orderStatus) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (): string => {
    switch (order.orderStatus) {
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  };

  const getPaymentVariant = (): 'success' | 'warning' => {
    return order.paymentStatus === 'paid' ? 'success' : 'warning';
  };

  const getPaymentLabel = (): string => {
    return order.paymentStatus === 'paid' ? 'Pagado' : 'Por cobrar';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.orderInfo}>
            <Text style={[styles.orderNumber, { color: colors.text }]}>
              {formatOrderNumber(order.orderNumber)}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {formatRelativeDate(order.createdAt)}
            </Text>
          </View>
          <View style={styles.badges}>
            <Badge variant={getStatusVariant()} size="sm">
              {getStatusLabel()}
            </Badge>
            <Badge variant={getPaymentVariant()} size="sm">
              {getPaymentLabel()}
            </Badge>
          </View>
        </View>

        {order.customer && (
          <View style={styles.customerRow}>
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.customerName, { color: colors.text }]}>
              {order.customer.name}
            </Text>
          </View>
        )}

        <View style={styles.itemsList}>
          {order.items.slice(0, 3).map((item, index) => (
            <Text
              key={item.id}
              style={[styles.itemText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.quantity}x {item.productName}
            </Text>
          ))}
          {order.items.length > 3 && (
            <Text style={[styles.moreItems, { color: colors.textMuted }]}>
              +{order.items.length - 3} mas...
            </Text>
          )}
        </View>

        {order.adminNotes && (
          <View style={[styles.notesContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
            <Text
              style={[styles.notes, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {order.adminNotes}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={[styles.total, { color: colors.text }]}>
            Total: <Text style={{ color: colors.primary }}>{formatCurrency(order.total)}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  date: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  customerName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  itemsList: {
    marginBottom: Spacing.sm,
  },
  itemText: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: 6,
    marginBottom: Spacing.sm,
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
  total: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
});
