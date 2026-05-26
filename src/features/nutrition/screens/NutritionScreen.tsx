import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen } from '@shared/components';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { nutritionService, FoodSearchResult } from '../services/nutritionService';
import { FoodListItem } from '../components/FoodListItem';
import { hexToRGBA } from '@shared/constants/colors';

export const NutritionScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadDefaultFoods();
  }, []);

  const loadDefaultFoods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const gymFoods = await nutritionService.getGymFoods();
      setFoods(gymFoods);
    } catch (err) {
      setError('Failed to load initial foods.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await nutritionService.searchFoods({
        query: searchQuery,
        dataType: ['Branded', 'Foundation', 'SR Legacy'],
      });
      setFoods(response.foods);
    } catch (err) {
      setError('Failed to fetch food data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodPress = (food: FoodSearchResult) => {
    navigation.navigate(ROUTES.MAIN.FOOD_DETAILS as any, {
      fdcId: food.fdcId.toString(),
      foodName: food.description,
      foodData: JSON.stringify(food),
    });
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="warning-outline" size={48} color={colors.error} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{error}</Text>
        </View>
      );
    }

    if (hasSearched && foods.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No foods found for "{searchQuery}"
          </Text>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Search for foods to see their nutritional values.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <AppScreen safeArea={false} scrollable={false} backgroundColor={colors.background}>
      <View style={styles.container}>
        <View style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
            borderColor: isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05),
            shadowColor: colors.shadow,
          }
        ]}>
          <Ionicons name="search" size={22} color={colors.primary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search foods (e.g., Chicken)"
            placeholderTextColor={colors.textMuted || colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={22}
              color={colors.textSecondary}
              onPress={() => {
                setSearchQuery('');
                setHasSearched(false);
                loadDefaultFoods();
              }}
              style={styles.clearIcon}
            />
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching foods...</Text>
          </View>
        ) : (
          <FlatList
            data={foods}
            keyExtractor={(item) => item.fdcId.toString()}
            renderItem={({ item }) => (
              <FoodListItem food={item} onPress={() => handleFoodPress(item)} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
    height: '100%',
    paddingTop: 0,
    paddingBottom: 0,
  },
  clearIcon: {
    padding: 4,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
  },
});
