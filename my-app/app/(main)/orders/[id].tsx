import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_ORDERS } from '@/constants/mock-data';
import { formatCurrency, formatRelativeDate, formatOrderNumber, formatQuantity } from '@/utils/format';
import type { Order } from '@/types';

export default function OrderDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const found = MOCK_ORDERS.find(o => o.id === id);
      setOrder(found || null);
    }
  }, [id]);

  const getStatusVariant = (): 'info' | 'success' | 'danger' => {
    if (!order) return 'info';
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
    if (!order) return '';
    switch (order.orderStatus) {
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  };

  const handleComplete = () => {
    Alert.alert(
      'Completar Pedido',
      'Marcar este pedido como completado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsLoading(false);
            Alert.alert('Exito', 'Pedido completado');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Pedido',
      'Esta seguro que desea cancelar este pedido?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Si, cancelar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsLoading(false);
            Alert.alert('Pedido cancelado');
          },
        },
      ]
    );
  };

  const handlePrint = () => {
    Alert.alert('Imprimir', 'La funcion de impresion estara disponible cuando conectes una impresora en Ajustes.');
  };

  const handleShare = () => {
    Alert.alert('Compartir', 'Compartir por WhatsApp o como imagen (proximamente)');
  };

  const handleRepeat = () => {
    Alert.alert('Repetir Pedido', 'Se creara un nuevo pedido con los mismos productos (proximamente)');
  };

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.textMuted }]}>
            Pedido no encontrado
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header Info */}
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.orderNumber, { color: colors.text }]}>
              {formatOrderNumber(order.orderNumber)}
            </Text>
            <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
              {formatRelativeDate(order.createdAt)}
            </Text>
          </View>
          <View style={styles.statusBadges}>
            <Badge variant={getStatusVariant()}>{getStatusLabel()}</Badge>
            <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
              {order.paymentStatus === 'paid' ? 'Pagado' : 'Por cobrar'}
            </Badge>
          </View>
        </View>

        {order.customer && (
          <TouchableOpacity
            style={[styles.customerRow, { borderTopColor: colors.border }]}
            onPress={() => router.push(`/(main)/customers/${order.customer?.id}`)}
          >
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.customerName, { color: colors.text }]}>
              {order.customer.name}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </Card>

      {/* Items */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Productos ({order.items.length})
        </Text>
        <Card padding="none">
          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: index < order.items.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.productName}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                  {formatCurrency(item.unitPrice)} x {formatQuantity(item.quantity)}
                </Text>
              </View>
              <Text style={[styles.itemSubtotal, { color: colors.text }]}>
                {formatCurrency(item.subtotal)}
              </Text>
            </View>
          ))}
          <View style={[styles.totalRow, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {formatCurrency(order.total)}
            </Text>
          </View>
        </Card>
      </View>

      {/* Notes */}
      {order.adminNotes && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notas</Text>
          <Card>
            <View style={styles.notesContent}>
              <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.notesText, { color: colors.text }]}>
                {order.adminNotes}
              </Text>
            </View>
          </Card>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Acciones</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handlePrint}
          >
            <Ionicons name="print-outline" size={24} color={colors.primary} />
            <Text style={[styles.actionLabel, { color: colors.text }]}>Imprimir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={colors.success} />
            <Text style={[styles.actionLabel, { color: colors.text }]}>Compartir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleRepeat}
          >
            <Ionicons name="copy-outline" size={24} color={colors.info} />
            <Text style={[styles.actionLabel, { color: colors.text }]}>Repetir</Text>
          </TouchableOpacity>
        </View>

        {order.orderStatus === 'pending' && (
          <View style={styles.primaryActions}>
            <Button
              onPress={handleComplete}
              loading={isLoading}
              fullWidth
              size="lg"
            >
              Marcar como Completado
            </Button>
            <Button
              variant="danger"
              onPress={handleCancel}
              fullWidth
            >
              Cancelar Pedido
            </Button>
          </View>
        )}
      </View>
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  headerCard: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  orderDate: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  customerName: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  itemPrice: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  totalValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  notesContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  notesText: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  actionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  primaryActions: {
    gap: Spacing.md,
  },
});
