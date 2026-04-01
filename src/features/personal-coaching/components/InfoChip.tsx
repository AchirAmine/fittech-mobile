import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface InfoChipProps {
  label: string;
}

export const InfoChip = ({ label }: InfoChipProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
      <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
