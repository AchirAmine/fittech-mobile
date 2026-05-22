import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_W } = Dimensions.get('window');

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  color?: string;
  unit?: string;
  title?: string;
  height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  color,
  unit = '',
  title,
  height = 180,
}) => {
  const { colors, isDark } = useTheme();
  const chartColor = color ?? colors.primaryMid;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.empty, { height, backgroundColor: colors.card, shadowColor: colors.textPrimary }]}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No data yet</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = (maxVal - minVal) * 1.25 || 1;

  const displayData = data.slice(-7);

  const trend = displayData.length >= 2
    ? displayData[displayData.length - 1].value - displayData[0].value
    : 0;

  const isPositiveTrend = trend >= 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}
    >
      {(title || displayData.length > 0) && (
        <View style={styles.chartHeader}>
          {title && (
            <Text style={[styles.chartTitle, { color: colors.textMuted }]}>{title.toUpperCase()}</Text>
          )}
          {displayData.length >= 2 && (
            <View style={[styles.trendBadge, { backgroundColor: hexToRGBA(trend === 0 ? colors.textMuted : isPositiveTrend ? colors.success : '#FF6B6B', 0.1) }]}>
              <Text style={[styles.trendText, { color: trend === 0 ? colors.textMuted : isPositiveTrend ? colors.success : '#FF6B6B' }]}>
                {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(1)}{unit}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>MIN</Text>
          <Text style={[styles.statValue, { color: colors.textSecondary }]}>{minVal.toFixed(1)}{unit}</Text>
        </View>
        <View style={styles.statItemCenter}>
          <Text style={[styles.statValueLarge, { color: chartColor }]}>
            {displayData[displayData.length - 1].value.toFixed(1)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>LATEST</Text>
        </View>
        <View style={[styles.statItem, { alignItems: 'flex-end' }]}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>MAX</Text>
          <Text style={[styles.statValue, { color: colors.textSecondary }]}>{maxVal.toFixed(1)}{unit}</Text>
        </View>
      </View>

      <View style={[styles.chartArea, { height }]}>
        {[0.25, 0.5, 0.75].map((frac) => (
          <View
            key={frac}
            style={[
              styles.gridLine,
              {
                bottom: `${frac * 100}%` as any,
                backgroundColor: isDark ? hexToRGBA(colors.white, 0.04) : hexToRGBA(colors.black, 0.04),
              },
            ]}
          />
        ))}

        {displayData.map((point, i) => {
          const normalized = maxVal === minVal ? 0.7 : (point.value - minVal) / range;
          const barHeight = Math.max(16, normalized * (height - 36));
          const isLast = i === displayData.length - 1;

          return (
            <View key={i} style={styles.barWrapper}>
              <Animated.View
                entering={FadeInUp.delay(i * 80).duration(500)}
                style={[styles.barContainer, { height: barHeight }]}
              >
                {isLast ? (
                  <LinearGradient
                    colors={[chartColor, hexToRGBA(chartColor, 0.6)]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.barFill}
                  />
                ) : (
                  <View style={[styles.barFill, { backgroundColor: hexToRGBA(chartColor, 0.2) }]} />
                )}
              </Animated.View>
              <Text style={[styles.barLabel, { color: isLast ? chartColor : colors.textMuted }]} numberOfLines={1}>
                {point.label}
              </Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.4,
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  trendText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  statItem: {
    gap: 4,
  },
  statItemCenter: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statValueLarge: {
    fontSize: 28,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: -0.5,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    gap: 6,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barContainer: {
    width: '75%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  barLabel: {
    fontSize: 9,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginTop: 8,
    textAlign: 'center',
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});
