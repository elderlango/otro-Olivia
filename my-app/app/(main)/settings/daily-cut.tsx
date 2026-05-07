import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMockDailyStats, MOCK_ORDERS } from '@/constants/mock-data';
import { formatCurrency, formatDateFull } from '@/utils/format';

export default function DailyCutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const stats = useMemo(() => getMockDailyStats(), []);

  const pendingOrders = MOCK_ORDERS.filter(o => o.orderStatus === 'pending');
  const completedOrders = MOCK_ORDERS.filter(o => o.orderStatus === 'completed');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Ionicons name="calendar" size={24} color={colors.primary} />
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatDateFull(new Date())}
        </Text>
      </View>

      {/* Main Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <StatCard
            title="Ventas Totales"
            value={stats.totalSales}
            icon="cash"
            iconColor={colors.success}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Cobrado"
            value={stats.totalPaid}
            icon="checkmark-circle"
            iconColor={colors.success}
          />
          <StatCard
            title="Por Cobrar"
            value={stats.totalPending}
            icon="time"
            iconColor={colors.warning}
          />
        </View>
      </View>

      {/* Orders Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Resumen de Pedidos
        </Text>
        <Card>
          <View style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.successBackground }]}>
                <Ionicons name="checkmark" size={20} color={colors.success} />
              </View>
              <View>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {stats.ordersCompleted}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Completados
                </Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.infoBackground }]}>
                <Ionicons name="hourglass" size={20} color={colors.info} />
              </View>
              <View>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {pendingOrders.length}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Pendientes
                </Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.dangerBackground }]}>
                <Ionicons name="close" size={20} color={colors.danger} />
              </View>
              <View>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {stats.ordersCancelled}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Cancelados
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

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
                styles.productRow,
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
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.text }]}>
                  {product.productName}
                </Text>
                <Text style={[styles.productQuantity, { color: colors.textSecondary }]}>
                  {product.quantity} unidades vendidas
                </Text>
              </View>
              <Text style={[styles.productRevenue, { color: colors.success }]}>
                {formatCurrency(product.revenue)}
              </Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Pending Orders Alert */}
      {pendingOrders.length > 0 && (
        <View style={styles.section}>
          <Card style={{ backgroundColor: colors.warningBackground }}>
            <View style={styles.alertContent}>
              <Ionicons name="alert-circle" size={24} color={colors.warning} />
              <View style={styles.alertText}>
                <Text style={[styles.alertTitle, { color: colors.warningForeground }]}>
                  Pedidos Pendientes
                </Text>
                <Text style={[styles.alertSubtitle, { color: colors.warningForeground }]}>
                  Tienes {pendingOrders.length} pedidos por completar con un total de{' '}
                  {formatCurrency(pendingOrders.reduce((sum, o) => sum + o.total, 0))}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    textTransform: 'capitalize',
  },
  statsSection: {
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  productRow: {
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  productQuantity: {
    fontSize: FontSizes.sm,
  },
  productRevenue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: FontSizes.sm,
  },
});
