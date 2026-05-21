import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Input, CategoryFilters, Category } from '@shared/components';
import { useExercisesQuery, useSearchExercisesQuery } from '../hooks/useExercises';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseModal } from './ExerciseModal';
import { Exercise } from '../services/exerciseService';

const BODY_PART_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: (c) => <Ionicons name="grid-outline" size={18} color={c} /> },
  { id: 'chest', label: 'Chest', icon: (c) => <MaterialCommunityIcons name="chess-rook" size={18} color={c} /> },
  { id: 'back', label: 'Back', icon: (c) => <MaterialCommunityIcons name="human-handsdown" size={18} color={c} /> },
  { id: 'shoulders', label: 'Shoulders', icon: (c) => <MaterialCommunityIcons name="dumbbell" size={18} color={c} /> },
  { id: 'cardio', label: 'Cardio', icon: (c) => <MaterialCommunityIcons name="run-fast" size={18} color={c} /> },
  { id: 'waist', label: 'Waist (Abs)', icon: (c) => <MaterialCommunityIcons name="human-male" size={18} color={c} /> },
  { id: 'upper arms', label: 'Upper Arms', icon: (c) => <MaterialCommunityIcons name="arm-flex" size={18} color={c} /> },
  { id: 'lower arms', label: 'Forearms', icon: (c) => <MaterialCommunityIcons name="hand-back-right-outline" size={18} color={c} /> },
  { id: 'upper legs', label: 'Thighs', icon: (c) => <MaterialCommunityIcons name="human-male-height" size={18} color={c} /> },
  { id: 'lower legs', label: 'Calves', icon: (c) => <MaterialCommunityIcons name="shoe-print" size={18} color={c} /> },
  { id: 'neck', label: 'Neck', icon: (c) => <MaterialCommunityIcons name="human" size={18} color={c} /> },
];

export const ExerciseSection: React.FC = () => {
  const { colors, isDark } = useTheme();

  // Search State
  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pagination Cursors State
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [beforeCursor, setBeforeCursor] = useState<string | undefined>(undefined);

  // Detail Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [selectedInitialExercise, setSelectedInitialExercise] = useState<Exercise | null>(null);

  // Search Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchVal]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setAfterCursor(undefined);
    setBeforeCursor(undefined);
  };

  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      setAfterCursor(undefined);
      setBeforeCursor(undefined);
    }
  }, [debouncedSearch]);

  const isSearching = debouncedSearch.trim().length > 0;

  const bodyParts = selectedCategory === 'all' ? undefined : selectedCategory;
  const {
    data: listData,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useExercisesQuery({
    bodyParts,
    limit: 10,
    after: afterCursor,
    before: beforeCursor,
  });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchExercisesQuery(debouncedSearch, isSearching);

  const handleCardPress = (exercise: Exercise) => {
    setSelectedExerciseId(exercise.exerciseId);
    setSelectedInitialExercise(exercise);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedExerciseId(null);
    setSelectedInitialExercise(null);
  };

  const handleNextPage = () => {
    if (listData?.meta?.nextCursor) {
      setAfterCursor(listData.meta.nextCursor);
      setBeforeCursor(undefined);
    }
  };

  const handlePrevPage = () => {
    if (listData?.meta?.previousCursor) {
      setBeforeCursor(listData.meta.previousCursor);
      setAfterCursor(undefined);
    }
  };

  const handleClearSearch = () => {
    setSearchVal('');
    setDebouncedSearch('');
  };

  const isLoading = isSearching ? isSearchLoading : isListLoading;
  const isFetching = isSearching ? isSearchFetching : isListFetching;
  const exercises = isSearching
    ? (searchData?.data as Exercise[] || [])
    : (listData?.data || []);

  const hasNextPage = !isSearching && !!listData?.meta?.hasNextPage;
  const hasPrevPage = !isSearching && !!listData?.meta?.hasPreviousPage;

  return (
    <View style={styles.sectionContainer}>

      {/* Debounced Search Input */}
      <Input
        placeholder="Search 1,500+ exercises..."
        value={searchVal}
        onChangeText={setSearchVal}
        icon="search-outline"
        rightIcon={searchVal.length > 0 ? 'close-circle-outline' : undefined}
        onRightIconPress={handleClearSearch}
        containerStyle={styles.searchBar}
      />

      {!isSearching && (
        <CategoryFilters
          categories={BODY_PART_CATEGORIES}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
          containerStyle={styles.filterContainer}
        />
      )}

      {isSearching && (
        <View style={styles.searchStatusHeader}>
          <Text style={[styles.searchStatusText, { color: colors.textSecondary }]}>
            Showing results for "{debouncedSearch}"
          </Text>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={[styles.clearSearchLink, { color: colors.primaryMid }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primaryMid} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading exercises...
            </Text>
          </View>
        ) : exercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Exercises Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try refining your query or resetting filters.
            </Text>
            {isSearching && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={[styles.resetButton, { backgroundColor: colors.primaryMid }]}
              >
                <Text style={styles.resetButtonText}>Reset Search</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={[styles.cardsList, isFetching && styles.fetchingOpacity]}>
              {exercises.map((item) => (
                <ExerciseCard
                  key={item.exerciseId}
                  exercise={item}
                  onPress={handleCardPress}
                />
              ))}
            </View>

            {!isSearching && (hasNextPage || hasPrevPage) && (
              <View style={styles.paginationRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={!hasPrevPage || isFetching}
                  onPress={handlePrevPage}
                  style={[
                    styles.pageButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: isDark ? hexToRGBA(colors.white, 0.08) : hexToRGBA(colors.black, 0.05),
                      opacity: hasPrevPage ? 1 : 0.4,
                    },
                  ]}
                >
                  <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                  <Text style={[styles.pageButtonText, { color: colors.textPrimary }]}>PREV</Text>
                </TouchableOpacity>

                {isFetching && <ActivityIndicator size="small" color={colors.primaryMid} />}

                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={!hasNextPage || isFetching}
                  onPress={handleNextPage}
                  style={[
                    styles.pageButton,
                    {
                      backgroundColor: colors.card,
                      borderColor: isDark ? hexToRGBA(colors.white, 0.08) : hexToRGBA(colors.black, 0.05),
                      opacity: hasNextPage ? 1 : 0.4,
                    },
                  ]}
                >
                  <Text style={[styles.pageButtonText, { color: colors.textPrimary }]}>NEXT</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      <ExerciseModal
        visible={modalVisible}
        onClose={handleCloseModal}
        exerciseId={selectedExerciseId}
        initialExercise={selectedInitialExercise}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 12,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 12,
    marginTop: 0,
  },
  searchStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  searchStatusText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  clearSearchLink: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  listContainer: {
    minHeight: 180,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  cardsList: {
    gap: 4,
  },
  fetchingOpacity: {
    opacity: 0.6,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  pageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    elevation: 1,
  },
  pageButtonText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
