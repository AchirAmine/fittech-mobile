import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { InfoChip } from './InfoChip';

interface CoachDetailsSectionProps {
  specialty: string;
  experience: string;
  about: string;
}

export const CoachDetailsSection = ({ specialty, experience, about }: CoachDetailsSectionProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>SPECIALTIES</Text>
          <InfoChip label={specialty} />
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>ABOUT</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          "{about}"
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoItem: {
    flex: 1,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
    letterSpacing: 1,
  },
  aboutSection: {
    gap: 12,
  },
  aboutText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
