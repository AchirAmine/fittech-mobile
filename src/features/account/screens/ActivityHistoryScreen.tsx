import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { ActivityFilter, FilterOption } from '../components/ActivityFilter';
import { ActivityItem } from '../components/ActivityItem';
import { useActivityHistory } from '../hooks/useActivityHistory';
import { Palette } from '@shared/constants/colors';

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'courses', label: 'Courses', color: Palette.primary[500] },
  { id: 'attendance', label: 'Attendance', color: Palette.semantic.success },
  { id: 'rewards', label: 'Rewards', color: Palette.semantic.warning },
  { id: 'payments', label: 'Payments', color: Palette.semantic.info },
  { id: 'personal', label: 'Personal', color: Palette.primary[500] },
];

export const ActivityHistoryScreen = () => {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useActivityHistory(selectedFilter);

  const activities = data?.pages.flatMap((page) => page.logs) || [];

  const handleSelectFilter = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No activity found.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ActivityFilter
        options={FILTER_OPTIONS}
        selectedFilter={selectedFilter}
        onSelectFilter={handleSelectFilter}
      />
      
      {isLoading && !activities.length ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.error }]}>
            Error loading activity history.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem activity={item} />}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.xl,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
  },
});
