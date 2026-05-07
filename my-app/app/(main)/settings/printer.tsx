import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePrinterStore } from '@/stores/printer.store';
import type { PrinterDevice } from '@/types';

export default function PrinterSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    device,
    settings,
    isScanning,
    isConnecting,
    availableDevices,
    lastError,
    setSettings,
    setDevice,
    setIsScanning,
    setAvailableDevices,
    disconnect,
  } = usePrinterStore();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress || '');
  const [businessPhone, setBusinessPhone] = useState(settings.businessPhone || '');
  const [footerMessage, setFooterMessage] = useState(settings.footerMessage || '');

  const handleScanDevices = async () => {
    setIsScanning(true);
    
    // Simulate Bluetooth scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock devices for demo
    const mockDevices: PrinterDevice[] = [
      { id: '1', name: 'Impresora Termica 58mm', address: 'AA:BB:CC:DD:EE:FF', isConnected: false },
      { id: '2', name: 'Printer BT-80', address: '11:22:33:44:55:66', isConnected: false },
    ];
    
    setAvailableDevices(mockDevices);
    setIsScanning(false);
  };

  const handleConnectDevice = async (printerDevice: PrinterDevice) => {
    Alert.alert(
      'Conectar Impresora',
      `Desea conectar a "${printerDevice.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Conectar',
          onPress: async () => {
            // Simulate connection
            await new Promise(resolve => setTimeout(resolve, 1500));
            setDevice({ ...printerDevice, isConnected: true });
            Alert.alert('Exito', 'Impresora conectada');
          },
        },
      ]
    );
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Desconectar',
      'Desconectar la impresora actual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desconectar',
          style: 'destructive',
          onPress: () => {
            disconnect();
            Alert.alert('Impresora desconectada');
          },
        },
      ]
    );
  };

  const handleTestPrint = () => {
    if (!device) {
      Alert.alert('Error', 'No hay impresora conectada');
      return;
    }
    Alert.alert('Prueba de Impresion', 'Se enviaria un ticket de prueba a la impresora (funcion de demo)');
  };

  const handleSaveSettings = () => {
    setSettings({
      businessName,
      businessAddress,
      businessPhone,
      footerMessage,
    });
    Alert.alert('Guardado', 'Configuracion actualizada');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Estado de Conexion
        </Text>
        <Card>
          {device ? (
            <View style={styles.connectedDevice}>
              <View style={styles.deviceInfo}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <View>
                  <Text style={[styles.deviceName, { color: colors.text }]}>
                    {device.name}
                  </Text>
                  <Text style={[styles.deviceAddress, { color: colors.textSecondary }]}>
                    {device.address}
                  </Text>
                </View>
              </View>
              <Badge variant="success">Conectada</Badge>
            </View>
          ) : (
            <View style={styles.noDevice}>
              <Ionicons name="print-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.noDeviceText, { color: colors.textMuted }]}>
                No hay impresora conectada
              </Text>
            </View>
          )}

          <View style={styles.connectionActions}>
            {device ? (
              <>
                <Button
                  variant="outline"
                  onPress={handleTestPrint}
                  leftIcon={<Ionicons name="document-text-outline" size={18} color={colors.primary} />}
                >
                  Prueba de Impresion
                </Button>
                <Button
                  variant="danger"
                  onPress={handleDisconnect}
                >
                  Desconectar
                </Button>
              </>
            ) : (
              <Button
                onPress={handleScanDevices}
                loading={isScanning}
                fullWidth
                leftIcon={<Ionicons name="bluetooth" size={18} color={colors.primaryForeground} />}
              >
                {isScanning ? 'Buscando...' : 'Buscar Impresoras'}
              </Button>
            )}
          </View>
        </Card>
      </View>

      {/* Available Devices */}
      {!device && availableDevices.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Dispositivos Encontrados
          </Text>
          <Card padding="none">
            {availableDevices.map((printerDevice, index) => (
              <TouchableOpacity
                key={printerDevice.id}
                style={[
                  styles.deviceRow,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: index < availableDevices.length - 1 ? 1 : 0,
                  },
                ]}
                onPress={() => handleConnectDevice(printerDevice)}
              >
                <Ionicons name="print-outline" size={24} color={colors.primary} />
                <View style={styles.deviceRowInfo}>
                  <Text style={[styles.deviceRowName, { color: colors.text }]}>
                    {printerDevice.name}
                  </Text>
                  <Text style={[styles.deviceRowAddress, { color: colors.textSecondary }]}>
                    {printerDevice.address}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      )}

      {/* Business Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Datos del Negocio
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Esta informacion aparecera en los tickets
        </Text>
        
        <Card>
          <Input
            label="Nombre del Negocio"
            placeholder="Mi Negocio"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <Input
            label="Direccion (opcional)"
            placeholder="Calle y numero"
            value={businessAddress}
            onChangeText={setBusinessAddress}
          />
          <Input
            label="Telefono (opcional)"
            placeholder="55 1234 5678"
            value={businessPhone}
            onChangeText={setBusinessPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="Mensaje de pie de ticket"
            placeholder="Gracias por su compra"
            value={footerMessage}
            onChangeText={setFooterMessage}
          />
          
          <Button
            onPress={handleSaveSettings}
            fullWidth
            style={styles.saveButton}
          >
            Guardar Configuracion
          </Button>
        </Card>
      </View>

      {/* Info */}
      <Card style={[styles.infoCard, { backgroundColor: colors.infoBackground }]}>
        <View style={styles.infoContent}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.infoForeground }]}>
            La impresion Bluetooth requiere una impresora termica ESC/POS compatible.
            Asegurate de que el Bluetooth este activado en tu dispositivo.
          </Text>
        </View>
      </Card>
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  connectedDevice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  deviceName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  deviceAddress: {
    fontSize: FontSizes.sm,
  },
  noDevice: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noDeviceText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  connectionActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  deviceRowInfo: {
    flex: 1,
  },
  deviceRowName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  deviceRowAddress: {
    fontSize: FontSizes.sm,
  },
  saveButton: {
    marginTop: Spacing.md,
  },
  infoCard: {
    marginBottom: Spacing.xxl,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
