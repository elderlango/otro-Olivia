import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { CustomerCard } from '@/components/customers/customer-card';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_CUSTOMERS } from '@/constants/mock-data';
import type { Customer } from '@/types';

export default function CustomersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return MOCK_CUSTOMERS;
    
    const searchLower = search.toLowerCase();
    return MOCK_CUSTOMERS.filter(customer => 
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(search)
    );
  }, [search]);

  const handleCustomerPress = (customer: Customer) => {
    router.push(`/(main)/customers/${customer.id}`);
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <CustomerCard
      customer={item}
      onPress={() => handleCustomerPress(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Clientes</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(main)/customers/new')}
        >
          <Ionicons name="add" size={24} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre o telefono..."
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No hay clientes"
            description={search ? 'No se encontraron clientes con ese nombre' : 'Agrega tu primer cliente'}
            actionLabel="Agregar Cliente"
            onAction={() => router.push('/(main)/customers/new')}
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
  listContent: {
    padding: Spacing.lg,
    paddingTop: 0,
    flexGrow: 1,
  },
});
