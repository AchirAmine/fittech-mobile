import React, { memo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

export interface Category {
  id: string;
  label: string;
  emoji?: string;
}

interface Props {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  containerStyle?: any;
}

const CategoryFilters: React.FC<Props> = ({ categories, selectedId, onSelect, containerStyle }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
      >
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => onSelect(cat.id)}
              style={[
                styles.chip,
                { 
                  backgroundColor: isSelected ? colors.primary : (isDark ? colors.card : hexToRGBA(colors.black, 0.03)),
                  borderColor: isSelected ? colors.primary : (isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05)),
                },
                isSelected && styles.activeChipShift
              ]}
            >
              {cat.emoji && <Text style={styles.emoji}>{cat.emoji}</Text>}
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? colors.white : colors.textPrimary },
                ]}
              >
                {cat.label}
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
    marginBottom: 20,
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: 18,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  activeChipShift: {
    transform: [{ translateY: -1 }],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  emoji: {
    fontSize: 14,
    marginRight: 8,
  },
  label: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default memo(CategoryFilters);
