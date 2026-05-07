import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { SearchBar } from '@/components/ui/search-bar';
import { ProductCard } from '@/components/products/product-card';
import { CategoryFilter } from '@/components/products/category-filter';
import { CartItemRow } from '@/components/orders/cart-item-row';
import { CustomerCard } from '@/components/customers/customer-card';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCartStore } from '@/stores/cart.store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_CUSTOMERS } from '@/constants/mock-data';
import { QUICK_NOTES } from '@/constants/quick-notes';
import { formatCurrency } from '@/utils/format';
import type { Product, Customer, PaymentStatus } from '@/types';

export default function CreateOrderScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const {
    items,
    customer,
    paymentStatus,
    adminNotes,
    addItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    setCustomer,
    setPaymentStatus,
    setAdminNotes,
    appendNote,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory && product.isAvailable;
    });
  }, [search, selectedCategory]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return MOCK_CUSTOMERS;
    const searchLower = customerSearch.toLowerCase();
    return MOCK_CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.phone?.includes(customerSearch)
    );
  }, [customerSearch]);

  const total = getTotal();
  const itemCount = getItemCount();

  const handleAddProduct = (product: Product) => {
    addItem(product);
  };

  const handleSelectCustomer = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    setShowCustomerModal(false);
    setCustomerSearch('');
  };

  const handleQuickNote = (noteText: string) => {
    appendNote(noteText);
  };

  const handleSaveOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    Alert.alert(
      'Pedido Guardado',
      'El pedido se ha creado exitosamente',
      [
        {
          text: 'Ver Pedido',
          onPress: () => {
            clearCart();
            router.back();
          },
        },
      ]
    );
  };

  const handleSaveAndPrint = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Agrega al menos un producto');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    Alert.alert(
      'Pedido Guardado',
      'Pedido creado. La impresion estara disponible cuando conectes una impresora.',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            router.back();
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productGridItem}>
      <ProductCard
        product={item}
        compact
        showAddButton
        onAddToCart={() => handleAddProduct(item)}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.mainContent}>
          {/* Products Section */}
          <View style={styles.productsSection}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar producto..."
              style={styles.searchBar}
            />
            
            <CategoryFilter
              categories={MOCK_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productsGrid}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Cart Section */}
          <View style={[styles.cartSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cartHeader}>
              <Text style={[styles.cartTitle, { color: colors.text }]}>
                Carrito ({itemCount})
              </Text>
              {items.length > 0 && (
                <TouchableOpacity onPress={clearCart}>
                  <Text style={[styles.clearText, { color: colors.danger }]}>Limpiar</Text>
                </TouchableOpacity>
              )}
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyCartText, { color: colors.textMuted }]}>
                  Carrito vacio
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
                {items.map((item) => (
                  <CartItemRow
                    key={item.product.id}
                    item={item}
                    onIncrement={() => incrementQuantity(item.product.id)}
                    onDecrement={() => decrementQuantity(item.product.id)}
                    onRemove={() => removeItem(item.product.id)}
                  />
                ))}
              </ScrollView>
            )}

            {/* Customer Selection */}
            <TouchableOpacity
              style={[styles.customerSelector, { borderColor: colors.border }]}
              onPress={() => setShowCustomerModal(true)}
            >
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
              <Text
                style={[
                  styles.customerText,
                  { color: customer ? colors.text : colors.textMuted },
                ]}
              >
                {customer ? customer.name : 'Seleccionar cliente (opcional)'}
              </Text>
              {customer ? (
                <TouchableOpacity onPress={() => setCustomer(null)}>
                  <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              )}
            </TouchableOpacity>

            {/* Payment Status */}
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: colors.textSecondary }]}>
                Estado de pago:
              </Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: paymentStatus === 'pending' ? colors.warningBackground : colors.backgroundSecondary,
                      borderColor: paymentStatus === 'pending' ? colors.warning : colors.border,
                    },
                  ]}
                  onPress={() => setPaymentStatus('pending')}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      { color: paymentStatus === 'pending' ? colors.warningForeground : colors.text },
                    ]}
                  >
                    Por cobrar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: paymentStatus === 'paid' ? colors.successBackground : colors.backgroundSecondary,
                      borderColor: paymentStatus === 'paid' ? colors.success : colors.border,
                    },
                  ]}
                  onPress={() => setPaymentStatus('paid')}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      { color: paymentStatus === 'paid' ? colors.successForeground : colors.text },
                    ]}
                  >
                    Pagado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Notes */}
            <View style={styles.quickNotes}>
              <Text style={[styles.quickNotesLabel, { color: colors.textSecondary }]}>
                Notas rapidas:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickNotesRow}>
                  {QUICK_NOTES.slice(0, 6).map((note) => (
                    <TouchableOpacity
                      key={note.id}
                      style={[styles.quickNoteChip, { backgroundColor: colors.backgroundSecondary }]}
                      onPress={() => handleQuickNote(note.text)}
                    >
                      <Text style={[styles.quickNoteText, { color: colors.text }]}>
                        {note.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Notes Input */}
            <Input
              placeholder="Agregar notas al pedido..."
              value={adminNotes}
              onChangeText={setAdminNotes}
              multiline
              numberOfLines={2}
              containerStyle={styles.notesInput}
            />

            {/* Total and Actions */}
            <View style={[styles.cartFooter, { borderTopColor: colors.border }]}>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.primary }]}>
                  {formatCurrency(total)}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  variant="outline"
                  onPress={handleSaveOrder}
                  loading={isLoading}
                  style={styles.actionButton}
                >
                  Guardar
                </Button>
                <Button
                  onPress={handleSaveAndPrint}
                  loading={isLoading}
                  style={styles.actionButton}
                  leftIcon={<Ionicons name="print-outline" size={18} color={colors.primaryForeground} />}
                >
                  Guardar e Imprimir
                </Button>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Selection Modal */}
        <Modal
          visible={showCustomerModal}
          onClose={() => setShowCustomerModal(false)}
          title="Seleccionar Cliente"
        >
          <SearchBar
            value={customerSearch}
            onChangeText={setCustomerSearch}
            placeholder="Buscar cliente..."
            style={styles.modalSearch}
          />
          <ScrollView style={styles.customerList}>
            {filteredCustomers.map((c) => (
              <CustomerCard
                key={c.id}
                customer={c}
                compact
                onPress={() => handleSelectCustomer(c)}
              />
            ))}
          </ScrollView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  productsSection: {
    flex: 1,
    padding: Spacing.md,
  },
  searchBar: {
    marginBottom: Spacing.sm,
  },
  productsGrid: {
    paddingTop: Spacing.sm,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productGridItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  cartSection: {
    width: 340,
    borderLeftWidth: 1,
    padding: Spacing.md,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cartTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  clearText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
  },
  cartItems: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  customerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  customerText: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  paymentRow: {
    marginBottom: Spacing.md,
  },
  paymentLabel: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  quickNotes: {
    marginBottom: Spacing.md,
  },
  quickNotesLabel: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  quickNotesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  quickNoteChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  quickNoteText: {
    fontSize: FontSizes.xs,
  },
  notesInput: {
    marginBottom: Spacing.md,
  },
  cartFooter: {
    borderTopWidth: 1,
    paddingTop: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  totalValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  modalSearch: {
    marginBottom: Spacing.md,
  },
  customerList: {
    maxHeight: 300,
  },
});
