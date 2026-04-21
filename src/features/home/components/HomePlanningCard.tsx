import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
interface HomePlanningCardProps {
  onPress?: () => void;
}
export const HomePlanningCard: React.FC<HomePlanningCardProps> = ({ onPress }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>WEEKLY PLANNING</Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
          }
        ]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.cardSecondary }]}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Full Schedule</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            View your full workout schedule and upcoming sessions
          </Text>
        </View>
        <View style={[styles.arrowContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 18,
    opacity: 0.8,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
