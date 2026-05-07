import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth.store';
import { usePrinterStore } from '@/stores/printer.store';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  badge?: string;
  showArrow?: boolean;
}

function SettingItem({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  badge,
  showArrow = true,
}: SettingItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>{badge}</Text>
        </View>
      )}
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { device, settings } = usePrinterStore();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesion',
      'Esta seguro que desea cerrar sesion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesion',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Profile */}
        <Card padding="none" style={styles.section}>
          <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name || 'Usuario'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                {user?.email || 'email@ejemplo.com'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Business Settings */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NEGOCIO</Text>
        <Card padding="none" style={styles.section}>
          <SettingItem
            icon="calculator"
            iconColor={colors.success}
            title="Corte del Dia"
            subtitle="Ver resumen de ventas"
            onPress={() => router.push('/(main)/settings/daily-cut')}
          />
          <SettingItem
            icon="print"
            iconColor={colors.primary}
            title="Impresora"
            subtitle={device ? device.name : 'No conectada'}
            onPress={() => router.push('/(main)/settings/printer')}
            badge={device ? 'Conectada' : undefined}
          />
          <SettingItem
            icon="storefront"
            iconColor={colors.warning}
            title="Datos del Negocio"
            subtitle={settings.businessName}
            onPress={() => router.push('/(main)/settings/printer')}
          />
        </Card>

        {/* App Settings */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APLICACION</Text>
        <Card padding="none" style={styles.section}>
          <SettingItem
            icon="notifications"
            iconColor={colors.info}
            title="Notificaciones"
            subtitle="Configurar alertas"
            onPress={() => Alert.alert('Proximamente', 'Esta funcion estara disponible pronto')}
          />
          <SettingItem
            icon="moon"
            iconColor="#6366F1"
            title="Tema"
            subtitle={colorScheme === 'dark' ? 'Oscuro' : 'Claro'}
            onPress={() => Alert.alert('Tema', 'Cambia el tema desde la configuracion del sistema')}
          />
          <SettingItem
            icon="help-circle"
            iconColor={colors.textSecondary}
            title="Ayuda y Soporte"
            onPress={() => Alert.alert('Soporte', 'Contactanos en soporte@app.com')}
          />
        </Card>

        {/* Account */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CUENTA</Text>
        <Card padding="none" style={styles.section}>
          <SettingItem
            icon="log-out"
            iconColor={colors.danger}
            title="Cerrar Sesion"
            onPress={handleLogout}
            showArrow={false}
          />
        </Card>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textMuted }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
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
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: Spacing.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  version: {
    fontSize: FontSizes.sm,
  },
});
