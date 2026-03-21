import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

interface SportChipProps {
  title: string;
  emoji: string;
  onPress?: () => void;
}

export const SportChip: React.FC<SportChipProps> = ({ title, emoji, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.cardSecondary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.text, { color: colors.textPrimary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
