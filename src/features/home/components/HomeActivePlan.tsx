import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface HomeActivePlanProps {
  title: string;
  endDate?: string;
  onPress: () => void;
}

export const HomeActivePlan: React.FC<HomeActivePlanProps> = ({ title, endDate, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 24,
      }}
    >
      <LinearGradient
        colors={[colors.primaryMid, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activePlanSummary}
      >
        <View style={styles.watermarkContainer}>
          <Ionicons name="fitness" size={160} color={hexToRGBA(colors.white, 0.1)} />
        </View>

        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: hexToRGBA(colors.white, 0.2) }]}>
            <Ionicons name="star" size={12} color={colors.white} />
            <Text style={styles.badgeText}>MEMBERSHIP</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.statusText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.activePlanText, { color: colors.white }]} numberOfLines={2}>
            {title.toUpperCase()}
          </Text>
        </View>

        <View style={styles.activePlanFooter}>
          <View>
            <Text style={[styles.footerLabel, { color: hexToRGBA(colors.white, 0.7) }]}>Expires On</Text>
            <Text style={[styles.activePlanSubtitle, { color: colors.white }]}>
              {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          
          <View style={[styles.arrowContainer, { backgroundColor: hexToRGBA(colors.white, 0.2) }]}>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activePlanSummary: {
    padding: 20,
    borderRadius: 28,
    height: 220,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    transform: [{ rotate: '-15deg' }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  activePlanText: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 30,
    marginBottom: 0,
  },
  activePlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 2,
  },
  activePlanSubtitle: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  arrowContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
