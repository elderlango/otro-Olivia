import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          onPress={action.onPress}
          activeOpacity={0.7}
          style={[
            styles.action,
            { backgroundColor: colors.card },
            Shadows.sm,
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: action.color + '15' },
            ]}
          >
            <Ionicons name={action.icon} size={24} color={action.color} />
          </View>
          <Text style={[styles.label, { color: colors.text }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  action: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
});
