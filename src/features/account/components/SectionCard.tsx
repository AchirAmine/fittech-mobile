import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { ThemeColors } from '@shared/constants/colors';

interface SectionCardProps {
  title: string;
  colors: ThemeColors;
  isDark: boolean;
  children: React.ReactNode;
}

export const SectionCard = ({ title, colors, isDark, children }: SectionCardProps) => (
  <View style={[styles.card, { backgroundColor: isDark ? colors.card : '#fff', borderColor: colors.border }]}>
    <Text style={[styles.cardTitle, { color: colors.primaryMid }]}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
});
