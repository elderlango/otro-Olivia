import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const isSelected = (categoryId: string | null): boolean => {
    return selectedCategory === categoryId;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        onPress={() => onSelectCategory(null)}
        style={[
          styles.chip,
          {
            backgroundColor: isSelected(null)
              ? colors.primary
              : colors.backgroundSecondary,
            borderColor: isSelected(null) ? colors.primary : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: isSelected(null) ? colors.primaryForeground : colors.text,
            },
          ]}
        >
          Todos
        </Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          style={[
            styles.chip,
            {
              backgroundColor: isSelected(category.id)
                ? colors.primary
                : colors.backgroundSecondary,
              borderColor: isSelected(category.id)
                ? colors.primary
                : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: isSelected(category.id)
                  ? colors.primaryForeground
                  : colors.text,
              },
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
});
