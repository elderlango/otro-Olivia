import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { OrderCard } from '@/components/orders/order-card';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_ORDERS } from '@/constants/mock-data';
import type { Order, OrderStatus } from '@/types';

type TabType = 'all' | 'pending' | 'completed' | 'cancelled';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredOrders = useMemo(() => {
    let orders = [...MOCK_ORDERS];

    // Filter by status
    if (activeTab !== 'all') {
      orders = orders.filter(o => o.orderStatus === activeTab);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toString().includes(search) ||
        o.customer?.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    return orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [search, activeTab]);

  const tabs: Array<{ key: TabType; label: string; count: number }> = [
    { key: 'all', label: 'Todos', count: MOCK_ORDERS.length },
    { key: 'pending', label: 'Pendientes', count: MOCK_ORDERS.filter(o => o.orderStatus === 'pending').length },
    { key: 'completed', label: 'Completados', count: MOCK_ORDERS.filter(o => o.orderStatus === 'completed').length },
    { key: 'cancelled', label: 'Cancelados', count: MOCK_ORDERS.filter(o => o.orderStatus === 'cancelled').length },
  ];

  const handleOrderPress = (order: Order) => {
    router.push(`/(main)/orders/${order.id}`);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard order={item} onPress={() => handleOrderPress(item)} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Pedidos</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(main)/orders/create')}
        >
          <Ionicons name="add" size={24} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por numero o cliente..."
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === tab.key ? colors.primary : 'transparent',
                borderColor: activeTab === tab.key ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.key ? colors.primaryForeground : colors.text,
                },
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor: activeTab === tab.key
                    ? 'rgba(255,255,255,0.2)'
                    : colors.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  {
                    color: activeTab === tab.key ? colors.primaryForeground : colors.textSecondary,
                  },
                ]}
              >
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No hay pedidos"
            description={
              search
                ? 'No se encontraron pedidos'
                : activeTab === 'all'
                ? 'Crea tu primer pedido'
                : `No hay pedidos ${activeTab === 'pending' ? 'pendientes' : activeTab === 'completed' ? 'completados' : 'cancelados'}`
            }
            actionLabel="Nuevo Pedido"
            onAction={() => router.push('/(main)/orders/create')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  tabBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  tabBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: 0,
    flexGrow: 1,
  },
});
