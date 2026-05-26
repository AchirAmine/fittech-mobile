import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AppScreen } from '@shared/components';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { nutritionService } from '../services/nutritionService';
import { hexToRGBA } from '@shared/constants/colors';

type FoodDetailsRouteProp = RouteProp<HomeStackParamList, typeof ROUTES.MAIN.FOOD_DETAILS>;

export const FoodDetailsScreen = () => {
  const { colors, isDark } = useTheme();
  const route = useRoute<FoodDetailsRouteProp>();
  const { fdcId, foodName, foodData } = route.params;

  const [foodDetails, setFoodDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await nutritionService.getFoodDetails(fdcId);
        if (details) {
          setFoodDetails(details);
        } else if (foodData) {
          setFoodDetails(JSON.parse(foodData));
        } else {
          setError('Food not found.');
        }
      } catch (err: any) {
        if (foodData) {
          setFoodDetails(JSON.parse(foodData));
        } else {
          setError('Failed to load food details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [fdcId]);

  if (isLoading) {
    return (
      <AppScreen safeArea={false} scrollable={false} backgroundColor={colors.background}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading nutrition data...</Text>
        </View>
      </AppScreen>
    );
  }

  if (error || !foodDetails) {
    return (
      <AppScreen safeArea={false} backgroundColor={colors.background}>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error || 'Food not found'}</Text>
        </View>
      </AppScreen>
    );
  }

  const getNutrientAmount = (nutrientNames: string[]) => {
    const n = foodDetails.foodNutrients?.find((n: any) => {
      const name = (n.nutrient?.name || n.name || n.nutrientName || '').toLowerCase();
      return nutrientNames.some(searchName => name.includes(searchName.toLowerCase()));
    });
    const val = n ? (n.amount ?? n.value) : null;
    return val != null ? `${Math.round(val)} ${n.nutrient?.unitName || n.unitName || 'g'}` : '-';
  };

  const calories = getNutrientAmount(['Energy', 'Calories']);
  const protein = getNutrientAmount(['Protein']);
  const carbs = getNutrientAmount(['Carbohydrate', 'Carbs']);
  const fat = getNutrientAmount(['Total lipid (fat)', 'Fat', 'Lipid']);

  return (
    <AppScreen safeArea={false} backgroundColor={colors.background}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.headerSection}>
          {(foodDetails.brandOwner || foodDetails.brandName) && (
            <Text style={[styles.brandName, { color: colors.textSecondary }]}>
              {foodDetails.brandName ? `${foodDetails.brandName} - ` : ''}{foodDetails.brandOwner}
            </Text>
          )}
          <Text style={[styles.portion, { color: colors.textMuted }]}>
            {foodDetails.servingSize ? `Serving size: ${foodDetails.servingSize} ${foodDetails.servingSizeUnit}` : 'Per 100g / 100ml'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Macronutrients</Text>

          <View style={styles.macroGrid}>
            <View style={[styles.macroBox, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
              <Text style={[styles.macroValue, { color: colors.primary }]}>{calories}</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Calories</Text>
            </View>
            <View style={[styles.macroBox, { backgroundColor: hexToRGBA(colors.success, 0.1) }]}>
              <Text style={[styles.macroValue, { color: colors.success }]}>{protein}</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Protein</Text>
            </View>
            <View style={[styles.macroBox, { backgroundColor: hexToRGBA(colors.warning, 0.1) }]}>
              <Text style={[styles.macroValue, { color: colors.warning }]}>{carbs}</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Carbs</Text>
            </View>
            <View style={[styles.macroBox, { backgroundColor: hexToRGBA(colors.error, 0.1) }]}>
              <Text style={[styles.macroValue, { color: colors.error }]}>{fat}</Text>
              <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Fat</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Detailed Nutrients</Text>

          {foodDetails.foodNutrients
            ?.filter((n: any) => {
              const val = n.amount ?? n.value;
              return val != null && val > 0;
            })
            .map((n: any, index: number) => {
              const name = n.nutrient?.name || n.nutrientName || n.name || 'Unknown';
              const val = n.amount ?? n.value;
              const unit = n.nutrient?.unitName || n.unitName || 'g';
              return (
                <View key={index} style={[styles.nutrientRow, { borderBottomColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) }]}>
                  <Text style={[styles.nutrientName, { color: colors.textPrimary }]}>{name}</Text>
                  <Text style={[styles.nutrientAmount, { color: colors.textSecondary }]}>
                    {Math.round(val)} {unit}
                  </Text>
                </View>
              );
            })
          }
        </View>

        <View style={styles.sourceFooter}>
          <Text style={[styles.sourceText, { color: colors.textMuted }]}>
            Data provided by U.S. Department of Agriculture, Agricultural Research Service. FoodData Central.
          </Text>
        </View>

      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  errorText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
  },

  headerSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 4,
  },
  portion: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  macroBox: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  nutrientName: {
    flex: 1,
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    paddingRight: 16,
  },
  nutrientAmount: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  sourceFooter: {
    marginTop: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sourceText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 16,
  },
});
