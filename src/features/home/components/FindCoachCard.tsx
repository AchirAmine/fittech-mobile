import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface FindCoachCardProps {
  onPress?: () => void;
}

export const FindCoachCard: React.FC<FindCoachCardProps> = ({ onPress }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>MY COACHING</Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.cardContainer, 
          { 
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
          }
        ]} 
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.cardContent}>
          
          <View style={[styles.avatarWrapper, { backgroundColor: colors.cardSecondary, borderColor: hexToRGBA(colors.primaryMid, 0.2) }]}>
            <Ionicons name="person-add" size={26} color={colors.primaryMid} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.coachName, { color: colors.textPrimary }]}>Find your coach</Text>
            <Text style={[styles.planTitle, { color: colors.textSecondary }]}>Get a professional workout plan</Text>
          </View>

          <View style={[styles.actionBtn, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="add" size={24} color={colors.primaryMid} />
          </View>

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
  cardContainer: {
    borderRadius: 24,
    padding: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  coachName: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    opacity: 0.7,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
