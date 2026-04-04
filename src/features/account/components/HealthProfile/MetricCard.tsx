import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { ThemeColors } from '@shared/constants/colors';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  onChange: (val: string) => void;
  colors: ThemeColors;
  isDark: boolean;
  isEditing: boolean;
}

export const MetricCard = ({ label, value, unit, icon, onChange, colors, isDark, isEditing }: MetricCardProps) => (
  <View style={[
    styles.metricCard,
    {
      backgroundColor: isDark ? colors.card : colors.white,
      borderColor: isEditing ? colors.primary : colors.border,
      borderWidth: isEditing ? 1.5 : 1,
    },
  ]}>
    <View style={styles.metricHeader}>
      <View style={[styles.metricIconContainer, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
    <View style={styles.metricBody}>
      <TextInput
        style={[styles.metricInput, { color: colors.textPrimary }]}
        value={String(value)}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor={colors.textMuted}
        editable={isEditing}
      />
      <Text style={[styles.metricUnit, { color: colors.primaryMid }]}>{unit}</Text>
      {isEditing && (
        <View style={[
          styles.editIndicator,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]}>
          <Ionicons name="pencil" size={10} color={colors.primary} />
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  metricCard: {
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 110,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    flex: 1,
  },
  editIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  metricBody: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricInput: {
    fontSize: 28,
    fontFamily: Theme.Typography.fontFamily.bold,
    padding: 0,
    minWidth: 40,
  },
  metricUnit: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
});
