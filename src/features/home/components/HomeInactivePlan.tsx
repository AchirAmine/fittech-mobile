import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { hexToRGBA } from '@shared/constants/colors';

interface HomeInactivePlanProps {
  onBrowsePlans: () => void;
}

export const HomeInactivePlan: React.FC<HomeInactivePlanProps> = ({ onBrowsePlans }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryMid, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { shadowColor: colors.shadow }]}
      >
        {/* Background decorative elements would go here if needed */}
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: hexToRGBA(colors.white, 0.15) }]}>
            <Ionicons name="basket-outline" size={32} color={colors.white} />
          </View>
          
          <Text style={[styles.title, { color: colors.white }]}>NO ACTIVE PLANS YET</Text>
          <Text style={[styles.description, { color: hexToRGBA(colors.white, 0.8) }]}>
            You're not enrolled in any training plan. Pick a sport package and start your journey today.
          </Text>

          <View style={styles.chipsContainer}>
            <View style={[styles.chip, { backgroundColor: hexToRGBA(colors.white, 0.1), borderColor: hexToRGBA(colors.white, 0.15) }]}>
              <Text style={[styles.chipText, { color: colors.white }]}>🥊 Multi-Sport</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: hexToRGBA(colors.white, 0.1), borderColor: hexToRGBA(colors.white, 0.15) }]}>
              <Text style={[styles.chipText, { color: colors.white }]}>📅 Flexible</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: hexToRGBA(colors.white, 0.1), borderColor: hexToRGBA(colors.white, 0.15) }]}>
              <Text style={[styles.chipText, { color: colors.white }]}>💪 Progress</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.browseButton, { backgroundColor: colors.primary }]} 
            onPress={onBrowsePlans}
            activeOpacity={0.8}
          >
            <Text style={[styles.browseButtonText, { color: colors.white }]}>Browse Plans</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  gradient: {
    padding: 24,
    minHeight: 280,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  browseButton: {
    backgroundColor: '#3B82F6', // Matching the screenshot's vibrant blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
    width: '100%',
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
