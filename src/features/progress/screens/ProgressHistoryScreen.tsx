import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { ROUTES } from '@navigation/routes';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { useProgressList, useDeleteProgress } from '../hooks/useProgress';
import { progressService } from '../services/progressService';
import { ProgressHistoryItem } from '../components/ProgressHistoryItem';
import { SimpleLineChart } from '../components/SimpleLineChart';
import { ProgressRecord } from '../types/progress.types';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

export const ProgressHistoryScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [activeTab, setActiveTab] = useState<'list' | 'charts'>('list');

  const { data, isLoading, refetch } = useProgressList({ limit: 50 });
  const deleteMutation = useDeleteProgress();

  const records = data?.data.items || [];

  const handleEdit = (record: ProgressRecord) => {
    navigation.navigate(ROUTES.MAIN.ADD_PROGRESS as any, {
      progressId: record.id,
      initialData: record,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleViewFeedback = async (record: ProgressRecord) => {
    try {
      const response = await progressService.getProgressFeedback(record.id);
      const feedback = response.data;
      if (feedback.length > 0) {
        const latest = feedback[0];
        const coachName = latest.coach ? `${latest.coach.firstName} ${latest.coach.lastName}` : 'Coach';
        alert(`${coachName} said: ${latest.comment}`);
      } else {
        alert('No feedback yet.');
      }
    } catch (error: any) {
      alert(error?.message || 'Failed to load feedback.');
    }
  };

  const chartData = useMemo(() => {
    if (!records.length) return { weight: [], bmi: [] };
    
    const sorted = [...records].sort(
      (a, b) => new Date(a.progressDate).getTime() - new Date(b.progressDate).getTime(),
    );

    const weight = sorted.map((r) => ({
      label: new Date(r.progressDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: r.weightKg,
    }));

    const bmi = sorted
      .filter((r) => r.bmi)
      .map((r) => ({
        label: new Date(r.progressDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: r.bmi!,
      }));

    return { weight, bmi };
  }, [records]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.tabContainer, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && { backgroundColor: colors.primaryMid }]}
          onPress={() => setActiveTab('list')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: activeTab === 'list' ? '#fff' : colors.textMuted }]}>
            List View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'charts' && { backgroundColor: colors.primaryMid }]}
          onPress={() => setActiveTab('charts')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, { color: activeTab === 'charts' ? '#fff' : colors.textMuted }]}>
            Charts
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && !data ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primaryMid} />
        </View>
      ) : activeTab === 'list' ? (
        <Animated.FlatList
          itemLayoutAnimation={Layout.springify()}
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primaryMid} />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
              <ProgressHistoryItem
                record={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewFeedback={handleViewFeedback}
                isDeleting={deleteMutation.variables === item.id}
              />
            </Animated.View>
          )}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp} style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No progress records found.</Text>
            </Animated.View>
          }
        />
      ) : (
        <ScrollView style={styles.chartsContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>Weight Evolution</Text>
            <SimpleLineChart data={chartData.weight} unit="kg" color={colors.primaryMid} height={180} />
          </Animated.View>
          
          <View style={{ height: 32 }} />
          
          {chartData.bmi.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>BMI Evolution</Text>
              <SimpleLineChart data={chartData.bmi} color={colors.success} height={180} />
            </Animated.View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 24,
    padding: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.medium },
  chartsContent: { paddingHorizontal: 16, paddingBottom: 40 },
  chartTitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
  },
});
