import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderCard } from '@/components/orders/order-card';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_CUSTOMERS, MOCK_ORDERS } from '@/constants/mock-data';
import { formatCurrency, formatPhone, formatTimeAgo } from '@/utils/format';
import type { Customer, Order } from '@/types';

export default function CustomerDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isNew = id === 'new';

  useEffect(() => {
    if (id && id !== 'new') {
      const found = MOCK_CUSTOMERS.find(c => c.id === id);
      if (found) {
        setCustomer(found);
        setName(found.name);
        setPhone(found.phone || '');
        setNotes(found.notes || '');
      }
    } else {
      setIsEditing(true);
    }
  }, [id]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return MOCK_ORDERS.filter(o => o.customerId === customer.id);
  }, [customer]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    Alert.alert(
      'Exito',
      isNew ? 'Cliente creado' : 'Cliente actualizado',
      [{ text: 'OK', onPress: () => isNew ? router.back() : setIsEditing(false) }]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Cliente',
      'Esta seguro que desea eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            router.back();
          },
        },
      ]
    );
  };

  if (isNew || isEditing) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <Input
            label="Nombre del cliente"
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Telefono (opcional)"
            placeholder="10 digitos"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Notas (opcional)"
            placeholder="Notas sobre el cliente..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleSave}
            loading={isLoading}
            fullWidth
            size="lg"
          >
            {isNew ? 'Crear Cliente' : 'Guardar Cambios'}
          </Button>

          {!isNew && (
            <Button
              variant="outline"
              onPress={() => setIsEditing(false)}
              fullWidth
              size="lg"
            >
              Cancelar
            </Button>
          )}
        </View>
      </ScrollView>
    );
  }

  if (!customer) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Customer Info */}
      <Card style={styles.infoCard}>
        <View style={styles.customerHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
              {customer.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={[styles.customerName, { color: colors.text }]}>
              {customer.name}
            </Text>
            {customer.phone && (
              <Text style={[styles.customerPhone, { color: colors.textSecondary }]}>
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

        {customer.notes && (
          <View style={[styles.notesBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.notesText, { color: colors.textSecondary }]}>
              {customer.notes}
            </Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total compras
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatCurrency(customer.totalPurchases)}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Ultima visita
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {customer.lastPurchaseAt ? formatTimeAgo(customer.lastPurchaseAt) : 'Nunca'}
            </Text>
          </View>
        </View>

        <Button
          variant="outline"
          onPress={() => setIsEditing(true)}
          fullWidth
        >
          Editar Cliente
        </Button>
      </Card>

      {/* Order History */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Historial de Pedidos ({customerOrders.length})
        </Text>
        
        {customerOrders.length === 0 ? (
          <Card>
            <View style={styles.emptyOrders}>
              <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Sin pedidos registrados
              </Text>
            </View>
          </Card>
        ) : (
          customerOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/(main)/orders/${order.id}`)}
            />
          ))
        )}
      </View>

      <Button
        variant="danger"
        onPress={handleDelete}
        fullWidth
        style={styles.deleteButton}
      >
        Eliminar Cliente
      </Button>
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
  form: {
    marginBottom: Spacing.xl,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actions: {
    gap: Spacing.md,
  },
  infoCard: {
    marginBottom: Spacing.lg,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  customerPhone: {
    fontSize: FontSizes.md,
    marginTop: 2,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  notesText: {
    flex: 1,
    fontSize: FontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  emptyOrders: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.sm,
  },
  deleteButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
});
