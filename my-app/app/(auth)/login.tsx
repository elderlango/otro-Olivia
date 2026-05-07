import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo invalido';
    }

    if (!password) {
      newErrors.password = 'La contrasena es requerida';
    } else if (password.length < 4) {
      newErrors.password = 'Minimo 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="storefront" size={48} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Punto de Venta
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Inicia sesion para continuar
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Correo electronico"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              }
            />

            <Input
              label="Contrasena"
              placeholder="Tu contrasena"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              }
              rightIcon={
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.loginButton}
            >
              Iniciar Sesion
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Demo: usa cualquier correo y contrasena
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
  },
  form: {
    marginBottom: Spacing.xxl,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.sm,
  },
});
