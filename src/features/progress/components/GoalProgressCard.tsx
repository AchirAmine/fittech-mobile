import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Goal, GOAL_TYPE_LABELS, GOAL_TYPE_ICONS } from '../types/progress.types';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface GoalProgressCardProps {
  goal: Goal;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal }) => {
  const { colors, isDark } = useTheme();
  const hasProgressPercentage = typeof goal.progressPercentage === 'number';
  const progress = hasProgressPercentage
    ? Math.min(100, Math.max(0, goal.progressPercentage ?? 0))
    : 0;
  const iconName = GOAL_TYPE_ICONS[goal.goalType] as any;

  const daysLeft = goal.targetDate
    ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86_400_000))
    : null;

  const isCompleted = hasProgressPercentage && progress >= 100;
  const accentColor = isCompleted ? colors.success : colors.primaryMid;
  const accentColorDark = isCompleted ? '#00A07A' : colors.primary;

  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withDelay(
      300,
      withTiming(progress, { duration: 1200, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress, animatedWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%` as any,
  }));

  return (
    <Animated.View entering={FadeInDown.duration(500)}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: hexToRGBA(accentColor, isDark ? 0.24 : 0.16),
            shadowColor: colors.textPrimary,
          },
        ]}
      >
        <View style={styles.row}>
          <LinearGradient colors={[accentColor, accentColorDark]} style={styles.iconWrap}>
            <Ionicons name={isCompleted ? 'trophy' : iconName} size={22} color="#fff" />
          </LinearGradient>

          <View style={styles.textBlock}>
            <Text style={[styles.goalType, { color: colors.textPrimary }]}>
              {GOAL_TYPE_LABELS[goal.goalType]}
            </Text>
            {goal.targetWeightKg ? (
              <Text style={[styles.sub, { color: colors.textSecondary }]}>
                {goal.currentWeightKg ? `${goal.currentWeightKg} kg to ` : ''}
                <Text style={{ color: accentColor, fontFamily: Theme.Typography.fontFamily.bold }}>
                  {goal.targetWeightKg} kg
                </Text>
              </Text>
            ) : (
              <Text style={[styles.sub, { color: colors.textSecondary }]}>Active goal</Text>
            )}
          </View>

          <View
            style={[
              hasProgressPercentage ? styles.percentCircle : styles.statusPill,
              {
                borderColor: hexToRGBA(accentColor, 0.3),
                backgroundColor: hexToRGBA(accentColor, 0.1),
              },
            ]}
          >
            {hasProgressPercentage ? (
              <>
                <Text style={[styles.percent, { color: accentColor }]}>{Math.round(progress)}</Text>
                <Text style={[styles.percentSign, { color: accentColor }]}>%</Text>
              </>
            ) : (
              <Text style={[styles.statusText, { color: accentColor }]}>Active</Text>
            )}
          </View>
        </View>

        {hasProgressPercentage ? (
          <View style={[styles.barBg, { backgroundColor: hexToRGBA(accentColor, 0.15) }]}>
            <Animated.View style={[styles.barFillWrap, progressStyle]}>
              <LinearGradient
                colors={[accentColor, accentColorDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barFill}
              />
            </Animated.View>
          </View>
        ) : null}

        <View style={styles.footer}>
          {daysLeft !== null ? (
            <View style={styles.footerItem}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                {daysLeft === 0 ? 'Target date reached' : `${daysLeft} days left`}
              </Text>
            </View>
          ) : null}

          {goal.startDate ? (
            <View style={styles.footerItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                Since {new Date(goal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: { flex: 1 },
  goalType: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 5,
  },
  sub: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 18,
  },
  percentCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPill: {
    minWidth: 68,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  percent: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 22,
  },
  percentSign: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 14,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  barBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFillWrap: {
    height: '100%',
    minWidth: 10,
  },
  barFill: {
    flex: 1,
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});
