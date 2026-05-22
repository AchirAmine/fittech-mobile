import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useLatestProgress } from '../hooks/useProgress';
import { useCurrentGoal } from '../hooks/useGoal';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { GoalProgressCard } from '../components/GoalProgressCard';
import { BMICard } from '../components/BMICard';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export const ProgressDashboardScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<Nav>();

  const { data: latestResp, isLoading: latestLoading, refetch: refetchLatest } = useLatestProgress();
  const { data: goalResp, isLoading: goalLoading, refetch: refetchGoal } = useCurrentGoal();

  const isLoading = latestLoading || goalLoading;
  const latest = latestResp?.data ?? null;
  const goal = goalResp?.data ?? null;

  const refetch = useCallback(() => {
    refetchLatest();
    refetchGoal();
  }, [refetchLatest, refetchGoal]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const formattedDate = latest
    ? new Date(latest.progressDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.absoluteHeader}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerGreeting}>Your Progress</Text>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate(ROUTES.MAIN.ADD_PROGRESS as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#fff" />}
      >
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <>
            <Animated.View
              entering={FadeInUp.duration(600).springify()}
              style={[styles.heroCard, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
            >
              {latest ? (
                <View style={styles.heroContent}>
                  <View style={styles.heroRow}>
                    <View>
                      <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>CURRENT WEIGHT</Text>
                      <Text style={[styles.heroValue, { color: colors.textPrimary }]}>
                        {latest.weightKg}{' '}
                        <Text style={[styles.heroUnit, { color: colors.textMuted }]}>kg</Text>
                      </Text>
                    </View>
                    {latest.bmi ? (
                      <View style={[styles.bmiBadge, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}>
                        <Text style={[styles.bmiValue, { color: colors.primaryMid }]}>{latest.bmi.toFixed(1)}</Text>
                        <Text style={[styles.bmiLabel, { color: colors.primaryMid }]}>BMI</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.addHeightBtn, { backgroundColor: hexToRGBA(colors.warning, 0.1) }]}
                        onPress={() =>
                          navigation.navigate(ROUTES.MAIN.ADD_PROGRESS as any, {
                            progressId: latest.id,
                            initialData: latest,
                          } as any)
                        }
                      >
                        <Ionicons name="add-outline" size={16} color={colors.warning} />
                        <Text style={[styles.addHeightText, { color: colors.warning }]}>Add Height</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View
                    style={[
                      styles.heroDivider,
                      { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) },
                    ]}
                  />

                  <View style={styles.heroBottomRow}>
                    <View style={styles.heroSubItem}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                      <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                        Updated: {formattedDate}
                      </Text>
                    </View>
                    {latest.waistCm && (
                      <View style={styles.heroSubItem}>
                        <Ionicons name="body-outline" size={16} color={colors.textMuted} />
                        <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                          Waist: {latest.waistCm} cm
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.emptyHero}>
                  <View style={[styles.emptyIcon, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}>
                    <Ionicons name="scale-outline" size={32} color={colors.primaryMid} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Data Yet</Text>
                  <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                    Start tracking your weight today
                  </Text>
                  <TouchableOpacity
                    style={[styles.startBtn, { backgroundColor: colors.primaryMid }]}
                    onPress={() => navigation.navigate(ROUTES.MAIN.ADD_PROGRESS as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startBtnText}>Log First Entry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>

            {latest?.bmi && (
              <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.bmiSection}>
                <BMICard bmi={latest.bmi} />
              </Animated.View>
            )}

            <Animated.View entering={FadeInRight.delay(200).duration(500)}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, paddingHorizontal: 20 }]}>
                Quick Actions
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
                  onPress={() => navigation.navigate(ROUTES.MAIN.ADD_PROGRESS as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIconBox, { backgroundColor: hexToRGBA(colors.primaryMid, 0.15) }]}>
                    <Ionicons name="add" size={20} color={colors.primaryMid} />
                  </View>
                  <Text style={[styles.actionChipText, { color: colors.textPrimary }]}>Log Weight</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
                  onPress={() => navigation.navigate(ROUTES.MAIN.PROGRESS_HISTORY as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIconBox, { backgroundColor: hexToRGBA(colors.success, 0.15) }]}>
                    <Ionicons name="bar-chart-outline" size={20} color={colors.success} />
                  </View>
                  <Text style={[styles.actionChipText, { color: colors.textPrimary }]}>History & Charts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
                  onPress={() => navigation.navigate(ROUTES.MAIN.PROGRESS_GOAL as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIconBox, { backgroundColor: hexToRGBA(colors.warning, 0.15) }]}>
                    <Ionicons name="trophy-outline" size={20} color={colors.warning} />
                  </View>
                  <Text style={[styles.actionChipText, { color: colors.textPrimary }]}>My Goal</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.goalSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 0 }]}>
                  Current Goal
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MAIN.PROGRESS_GOAL as any)}>
                  <Text style={[styles.seeAll, { color: colors.primaryMid }]}>{goal ? 'Edit' : 'Set Goal'}</Text>
                </TouchableOpacity>
              </View>

              {goal ? (
                <GoalProgressCard goal={goal} />
              ) : (
                <TouchableOpacity
                  style={[styles.emptyGoalBox, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
                  onPress={() => navigation.navigate(ROUTES.MAIN.PROGRESS_GOAL as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.emptyGoalIconBox, { backgroundColor: hexToRGBA(colors.primaryMid, 0.08) }]}>
                    <Ionicons name="flag" size={24} color={colors.primaryMid} />
                  </View>
                  <View style={styles.emptyGoalTextWrap}>
                    <Text style={[styles.emptyGoalTitle, { color: colors.textPrimary }]}>No Active Goal</Text>
                    <Text style={[styles.emptyGoalSub, { color: colors.textSecondary }]}>
                      Tap to set your fitness target
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 270,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  headerGreeting: {
    fontSize: 28,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: '#FFF',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: { flex: 1, zIndex: 1 },
  content: { paddingBottom: 60, paddingTop: 120 },
  loader: { marginTop: 60, alignItems: 'center' },

  heroCard: {
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  heroContent: {},
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 52,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: -2,
  },
  heroUnit: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  bmiBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  bmiValue: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 26,
  },
  bmiLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  addHeightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 4,
  },
  addHeightText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  heroDivider: {
    height: 1,
    marginVertical: 20,
  },
  heroBottomRow: {
    flexDirection: 'row',
    gap: 20,
  },
  heroSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroSubText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },

  emptyHero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 24,
    textAlign: 'center',
  },
  startBtn: {
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 20,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },

  bmiSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingRight: 22,
    borderRadius: 24,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionChipText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  goalSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  emptyGoalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 28,
    gap: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyGoalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGoalTextWrap: { flex: 1 },
  emptyGoalTitle: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  emptyGoalSub: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});
