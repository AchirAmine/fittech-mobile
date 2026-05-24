import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface FilterOption {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

interface ActivityFilterProps {
  options: FilterOption[];
  selectedFilter: string;
  onSelectFilter: (id: string) => void;
}

export const ActivityFilter: React.FC<ActivityFilterProps> = ({ options, selectedFilter, onSelectFilter }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isSelected = selectedFilter === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.primary + '15',
                  borderColor: isSelected ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => onSelectFilter(option.id)}
            >
              {option.icon && (
                <View style={[styles.iconDot, { backgroundColor: option.color || colors.primary }]} />
              )}
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? colors.white : colors.textSecondary },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Theme.Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Theme.Spacing.lg,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
});
