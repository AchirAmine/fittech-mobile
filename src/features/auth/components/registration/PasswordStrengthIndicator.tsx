import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

export interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { colors } = useTheme();

  if (!password) return null;

  let label: string;
  let color: string;
  if (password.length < 8) {
    label = 'Weak';
    color = colors.error;
  } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
    label = 'Strong';
    color = colors.success;
  } else {
    label = 'Medium';
    color = colors.warning;
  }

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Strength: </Text>
      <Text style={[styles.value, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 4, marginLeft: 4 },
  label: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
  },
  value: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 12,
  },
});
