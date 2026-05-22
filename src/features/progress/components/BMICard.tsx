import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { getBMICategory, getBMILabel, BMICategory } from '../types/progress.types';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BMICardProps {
  bmi: number;
}

const BMI_COLORS: Record<BMICategory, string> = {
  underweight: '#60B8FF',
  normal: '#00C897',
  overweight: '#F4A800',
  obese: '#FF3B30',
};

const BMI_DESCRIPTIONS: Record<BMICategory, string> = {
  underweight: 'You are below the healthy range',
  normal: 'You are in the healthy range',
  overweight: 'You are above the healthy range',
  obese: 'Health risk — consult a doctor',
};

const BMI_MIN = 14;
const BMI_MAX = 40;

const zones = [
  { label: 'Under', range: '<18.5', color: '#60B8FF', flex: 1 },
  { label: 'Normal', range: '18.5–25', color: '#00C897', flex: 1.4 },
  { label: 'Over', range: '25–30', color: '#F4A800', flex: 1 },
  { label: 'Obese', range: '≥30', color: '#FF3B30', flex: 1 },
];

export const BMICard: React.FC<BMICardProps> = ({ bmi }) => {
  const { colors, isDark } = useTheme();
  const category = getBMICategory(bmi);
  const label = getBMILabel(category);
  const bmiColor = BMI_COLORS[category];
  const description = BMI_DESCRIPTIONS[category];

  const clampedBmi = Math.max(BMI_MIN, Math.min(BMI_MAX, bmi));
  const fillPercent = ((clampedBmi - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100;

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(600)}>
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}>
        <View style={styles.header}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>BMI INDICATOR</Text>
          <View style={[styles.badge, { backgroundColor: hexToRGBA(bmiColor, 0.15) }]}>
            <Text style={[styles.badgeText, { color: bmiColor }]}>{label}</Text>
          </View>
        </View>

        <View style={styles.valueSection}>
          <Text style={[styles.value, { color: bmiColor }]}>{bmi.toFixed(1)}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
        </View>

        <View style={styles.gaugeContainer}>
          <View style={styles.barRow}>
            {zones.map((zone, i) => (
              <View
                key={i}
                style={[
                  styles.barZone,
                  {
                    backgroundColor: isDark ? hexToRGBA(zone.color, 0.35) : hexToRGBA(zone.color, 0.55),
                    flex: zone.flex,
                  },
                  i === 0 && styles.barFirst,
                  i === zones.length - 1 && styles.barLast,
                ]}
              />
            ))}
            <View
              style={[
                styles.needle,
                {
                  left: `${fillPercent}%` as any,
                  borderColor: colors.card,
                  backgroundColor: bmiColor,
                },
              ]}
            />
          </View>

          <View style={styles.zoneLabelsRow}>
            {zones.map((z, i) => (
              <View key={i} style={[styles.zoneLabelItem, { flex: z.flex }]}>
                <Text style={[styles.zoneRange, { color: z.color }]}>{z.range}</Text>
                <Text style={[styles.zoneLabel, { color: colors.textMuted }]}>{z.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.5,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  valueSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  value: {
    fontSize: 64,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: -2,
    lineHeight: 68,
  },
  description: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginTop: 8,
    textAlign: 'center',
  },
  gaugeContainer: {},
  barRow: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'visible',
    position: 'relative',
    marginBottom: 14,
  },
  barZone: {
    height: 14,
  },
  barFirst: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  barLast: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  needle: {
    position: 'absolute',
    top: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  zoneLabelsRow: {
    flexDirection: 'row',
  },
  zoneLabelItem: {
    alignItems: 'center',
    gap: 2,
  },
  zoneRange: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  zoneLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});
