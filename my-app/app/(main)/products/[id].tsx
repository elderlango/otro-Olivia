import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/constants/mock-data';
import { formatCurrency } from '@/utils/format';
import { getStockLevel } from '@/types';
import type { Product } from '@/types';

export default function ProductDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const found = MOCK_PRODUCTS.find(p => p.id === id);
      if (found) {
        setProduct(found);
        setName(found.name);
        setPrice(found.price.toString());
        setStock(found.stockQuantity.toString());
        setDescription(found.description || '');
      }
    }
  }, [id]);

  const isNew = id === 'new';

  const handleSave = async () => {
    if (!name.trim() || !price) {
      Alert.alert('Error', 'Nombre y precio son requeridos');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    Alert.alert(
      'Exito',
      isNew ? 'Producto creado' : 'Producto actualizado',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Producto',
      'Esta seguro que desea eliminar este producto?',
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

  const stockLevel = product ? getStockLevel(product.stockQuantity) : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {!isNew && product && (
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Precio actual
            </Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>
              {formatCurrency(product.price)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Stock
            </Text>
            <Badge
              variant={
                stockLevel === 'high' ? 'success' :
                stockLevel === 'medium' ? 'warning' :
                'danger'
              }
            >
              {product.stockQuantity} unidades
            </Badge>
          </View>
          {product.category && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Categoria
              </Text>
              <Badge variant="outline">{product.category.name}</Badge>
            </View>
          )}
        </Card>
      )}

      <View style={styles.form}>
        <Input
          label="Nombre del producto"
          placeholder="Ej: Taco de Asada"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Precio"
          placeholder="0.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Input
          label="Stock disponible"
          placeholder="0"
          value={stock}
          onChangeText={setStock}
          keyboardType="number-pad"
        />

        <Input
          label="Descripcion (opcional)"
          placeholder="Describe el producto..."
          value={description}
          onChangeText={setDescription}
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
          {isNew ? 'Crear Producto' : 'Guardar Cambios'}
        </Button>

        {!isNew && (
          <Button
            variant="danger"
            onPress={handleDelete}
            fullWidth
            size="lg"
            style={styles.deleteButton}
          >
            Eliminar Producto
          </Button>
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
  infoCard: {
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.md,
  },
  infoValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
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
  deleteButton: {
    marginTop: Spacing.sm,
  },
});
