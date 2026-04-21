import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Coach } from '../hooks/useCoaching';
interface MyCoachingCardProps {
  coach: Coach;
  planTitle: string;
  onPress: () => void;
  onDashboardPress: () => void;
}
export const MyCoachingCard = ({ coach, planTitle, onPress, onDashboardPress }: MyCoachingCardProps) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>MY COACHING</Text>
        <TouchableOpacity style={styles.dashboardBtn} onPress={onDashboardPress} activeOpacity={0.7}>
          <Text style={[styles.dashboardText, { color: colors.primaryMid }]}>Dashboard</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primaryMid} />
        </TouchableOpacity>
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
          <View style={[styles.avatarWrapper, { borderColor: colors.primaryMid }]}>
            <Image source={coach.image} style={styles.avatar} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.coachName, { color: colors.textPrimary }]}>{coach.name.toUpperCase()}</Text>
            <Text style={[styles.planTitle, { color: colors.primaryMid }]}>{planTitle}</Text>
          </View>
          <TouchableOpacity style={[styles.chatBtn, { backgroundColor: isDark ? hexToRGBA(colors.primaryMid, 0.2) : hexToRGBA(colors.primaryMid, 0.1) }]}>
            <Ionicons name="chatbubble-ellipses" size={20} color={colors.primaryMid} />
          </TouchableOpacity>
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
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dashboardText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
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
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
  },
  chatBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
