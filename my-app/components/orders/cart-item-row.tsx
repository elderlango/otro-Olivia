import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency } from '@/utils/format';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const subtotal = item.product.price * item.quantity;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={[styles.price, { color: colors.textSecondary }]}>
          {formatCurrency(item.product.price)} c/u
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={onDecrement}
          style={[styles.quantityButton, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons
            name={item.quantity === 1 ? 'trash-outline' : 'remove'}
            size={18}
            color={item.quantity === 1 ? colors.danger : colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.quantity, { color: colors.text }]}>
          {item.quantity}
        </Text>

        <TouchableOpacity
          onPress={onIncrement}
          style={[styles.quantityButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={18} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtotal, { color: colors.text }]}>
        {formatCurrency(subtotal)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    marginBottom: 2,
  },
  price: {
    fontSize: FontSizes.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    minWidth: 32,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    minWidth: 80,
    textAlign: 'right',
  },
});
