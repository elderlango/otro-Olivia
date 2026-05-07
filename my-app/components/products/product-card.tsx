import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency } from '@/utils/format';
import type { Product, StockLevel } from '@/types';
import { getStockLevel } from '@/types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  showAddButton?: boolean;
  compact?: boolean;
}

export function ProductCard({
  product,
  onPress,
  onAddToCart,
  showAddButton = false,
  compact = false,
}: ProductCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const stockLevel = getStockLevel(product.stockQuantity);

  const getStockColor = (level: StockLevel): string => {
    switch (level) {
      case 'high':
        return colors.stockHigh;
      case 'medium':
        return colors.stockMedium;
      case 'low':
        return colors.stockLow;
      case 'out':
        return colors.stockOut;
    }
  };

  const getStockLabel = (level: StockLevel): string => {
    switch (level) {
      case 'high':
        return `${product.stockQuantity} disponibles`;
      case 'medium':
        return `${product.stockQuantity} disponibles`;
      case 'low':
        return `Solo ${product.stockQuantity}`;
      case 'out':
        return 'Agotado';
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={showAddButton && product.isAvailable ? onAddToCart : onPress}
        activeOpacity={0.7}
        disabled={!product.isAvailable && showAddButton}
        style={[
          styles.compactCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            opacity: product.isAvailable ? 1 : 0.6,
          },
        ]}
      >
        <View style={styles.compactContent}>
          <Text
            style={[styles.compactName, { color: colors.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text style={[styles.compactPrice, { color: colors.primary }]}>
            {formatCurrency(product.price)}
          </Text>
        </View>
        {showAddButton && product.isAvailable && (
          <View style={[styles.addIndicator, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={16} color={colors.primaryForeground} />
          </View>
        )}
        {!product.isAvailable && (
          <View style={[styles.unavailableOverlay, { backgroundColor: colors.background }]}>
            <Text style={[styles.unavailableText, { color: colors.textMuted }]}>
              Agotado
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {product.name}
            </Text>
            {product.category && (
              <Badge variant="outline" size="sm">
                {product.category.name}
              </Badge>
            )}
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatCurrency(product.price)}
          </Text>
        </View>

        {product.description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {product.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.stockContainer}>
            <View
              style={[
                styles.stockDot,
                { backgroundColor: getStockColor(stockLevel) },
              ]}
            />
            <Text style={[styles.stockText, { color: colors.textSecondary }]}>
              {getStockLabel(stockLevel)}
            </Text>
          </View>

          {showAddButton && (
            <TouchableOpacity
              onPress={onAddToCart}
              disabled={!product.isAvailable}
              style={[
                styles.addButton,
                {
                  backgroundColor: product.isAvailable
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <Ionicons
                name="add"
                size={20}
                color={product.isAvailable ? colors.primaryForeground : colors.textMuted}
              />
            </TouchableOpacity>
          )}
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
  titleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  description: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  stockText: {
    fontSize: FontSizes.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Compact styles
  compactCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  compactContent: {
    flex: 1,
  },
  compactName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  compactPrice: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  addIndicator: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xs,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    alignItems: 'center',
  },
  unavailableText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
});
