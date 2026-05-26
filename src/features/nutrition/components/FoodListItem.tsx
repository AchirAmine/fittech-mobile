import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { FoodSearchResult } from '../services/nutritionService';

interface FoodListItemProps {
  food: FoodSearchResult;
  onPress: () => void;
}

export const FoodListItem: React.FC<FoodListItemProps> = ({ food, onPress }) => {
  const { colors, isDark } = useTheme();

  const getNutrient = (nutrientNames: string[]) => {
    if (!food.foodNutrients) return '-';
    const nutrient = food.foodNutrients.find(
      (n: any) => {
        const name = (n.nutrientName || n.name || n.nutrient?.name || '').toLowerCase();
        return nutrientNames.some(searchName => name.includes(searchName.toLowerCase()));
      }
    );
    const value = nutrient ? (nutrient.value ?? nutrient.amount) : null;
    return value != null ? `${Math.round(value)}${nutrient?.unitName || 'g'}` : '-';
  };

  const calories = getNutrient(['Energy', 'Calories']);
  const protein = getNutrient(['Protein']);
  const carbs = getNutrient(['Carbohydrate', 'Carbs']);
  const fat = getNutrient(['Total lipid (fat)', 'Fat', 'Lipid']);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {food.description}
          </Text>
          {(food.brandName || food.brandOwner) && (
            <Text style={[styles.brand, { color: colors.textSecondary }]} numberOfLines={1}>
              {food.brandName || food.brandOwner}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>

      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, { color: colors.primary }]}>{calories}</Text>
          <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Cal</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, { color: colors.textPrimary }]}>{protein}</Text>
          <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Protein</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, { color: colors.textPrimary }]}>{carbs}</Text>
          <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Carbs</Text>
        </View>
        <View style={styles.macroDivider} />
        <View style={styles.macroItem}>
          <Text style={[styles.macroValue, { color: colors.textPrimary }]}>{fat}</Text>
          <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Fat</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    marginBottom: 4,
  },
  brand: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  macroDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
});
