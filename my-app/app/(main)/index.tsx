import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '@/components/dashboard/stat-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth.store';
import { getMockDailyStats, MOCK_PRODUCTS, MOCK_ORDERS } from '@/constants/mock-data';
import { formatCurrency, formatDateFull } from '@/utils/format';
import { getStockLevel } from '@/types';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const stats = useMemo(() => getMockDailyStats(), []);
  
  const lowStockProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const level = getStockLevel(p.stockQuantity);
      return level === 'low' || level === 'out';
    });
  }, []);

  const pendingOrders = useMemo(() => {
    return MOCK_ORDERS.filter(o => o.orderStatus === 'pending');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const quickActions = [
    {
      id: 'new-order',
      label: 'Nuevo Pedido',
      icon: 'add-circle' as const,
      color: colors.primary,
      onPress: () => router.push('/(main)/orders/create'),
    },
    {
      id: 'customers',
      label: 'Clientes',
      icon: 'people' as const,
      color: colors.info,
      onPress: () => router.push('/(main)/customers'),
    },
    {
      id: 'products',
      label: 'Productos',
      icon: 'pricetag' as const,
      color: colors.success,
      onPress: () => router.push('/(main)/products'),
    },
    {
      id: 'daily-cut',
      label: 'Corte',
      icon: 'calculator' as const,
      color: colors.warning,
      onPress: () => router.push('/(main)/settings/daily-cut'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Bienvenido,
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'Usuario'}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {formatDateFull(new Date())}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <QuickActions actions={quickActions} />
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Resumen del Dia
          </Text>
          <View style={styles.statsRow}>
            <StatCard
              title="Ventas Totales"
              value={stats.totalSales}
              icon="cash"
              iconColor={colors.success}
            />
            <StatCard
              title="Por Cobrar"
              value={stats.totalPending}
              icon="time"
              iconColor={colors.warning}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Pedidos"
              value={`${stats.ordersCompleted}`}
              subtitle="Completados hoy"
              icon="checkmark-circle"
              iconColor={colors.success}
            />
            <StatCard
              title="Pendientes"
              value={`${pendingOrders.length}`}
              subtitle="Por entregar"
              icon="hourglass"
              iconColor={colors.info}
            />
          </View>
        </View>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Stock Bajo
              </Text>
              <Badge variant="warning" size="sm">
                {lowStockProducts.length} productos
              </Badge>
            </View>
            <Card>
              {lowStockProducts.slice(0, 5).map((product, index) => (
                <View
                  key={product.id}
                  style={[
                    styles.stockItem,
                    index < lowStockProducts.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.stockItemInfo}>
                    <Text style={[styles.stockItemName, { color: colors.text }]}>
                      {product.name}
                    </Text>
                    <Text style={[styles.stockItemCategory, { color: colors.textSecondary }]}>
                      {product.category?.name}
                    </Text>
                  </View>
                  <View style={styles.stockItemQuantity}>
                    <Ionicons
                      name="alert-circle"
                      size={16}
                      color={product.stockQuantity === 0 ? colors.danger : colors.warning}
                    />
                    <Text
                      style={[
                        styles.stockQuantityText,
                        {
                          color: product.stockQuantity === 0 ? colors.danger : colors.warning,
                        },
                      ]}
                    >
                      {product.stockQuantity === 0 ? 'Agotado' : `${product.stockQuantity} uds`}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Productos Mas Vendidos
          </Text>
          <Card>
            {stats.topProducts.map((product, index) => (
              <View
                key={product.productId}
                style={[
                  styles.topProductItem,
                  index < stats.topProducts.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.rankBadge, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.rankText, { color: colors.primary }]}>
                    #{index + 1}
                  </Text>
                </View>
                <View style={styles.topProductInfo}>
                  <Text style={[styles.topProductName, { color: colors.text }]}>
                    {product.productName}
                  </Text>
                  <Text style={[styles.topProductQuantity, { color: colors.textSecondary }]}>
                    {product.quantity} vendidos
                  </Text>
                </View>
                <Text style={[styles.topProductRevenue, { color: colors.success }]}>
                  {formatCurrency(product.revenue)}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.md,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  date: {
    fontSize: FontSizes.sm,
    textAlign: 'right',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  stockItemInfo: {
    flex: 1,
  },
  stockItemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  stockItemCategory: {
    fontSize: FontSizes.sm,
  },
  stockItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stockQuantityText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  topProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rankText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  topProductQuantity: {
    fontSize: FontSizes.sm,
  },
  topProductRevenue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
});
