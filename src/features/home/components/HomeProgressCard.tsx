import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useLatestProgress } from '../../progress/hooks/useProgress';

interface HomeProgressCardProps {
  onPress: () => void;
}

export const HomeProgressCard: React.FC<HomeProgressCardProps> = ({ onPress }) => {
  const { colors, isDark } = useTheme();
  const { data: latestResp, isLoading } = useLatestProgress();
  const latest = latestResp?.data;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05),
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}>
            <Ionicons name="stats-chart" size={18} color={colors.primaryMid} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>PROGRESS</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>

      {isLoading ? (
        <View style={styles.content}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Loading...</Text>
        </View>
      ) : latest ? (
        <View style={styles.content}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {latest.weightKg} <Text style={styles.statUnit}>kg</Text>
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Weight</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05) }]} />

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {latest.bmi ? latest.bmi.toFixed(1) : '--'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>BMI</Text>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Start tracking your weight and BMI to see progress.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statUnit: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
  },
});
