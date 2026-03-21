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
    >
      <LinearGradient
        colors={[colors.primaryMid, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activePlanSummary}
      >
        <Text style={[styles.activePlanText, { color: colors.white }]}>
          {title}
        </Text>
        <View style={styles.activePlanFooter}>
          <Text style={[styles.activePlanSubtitle, { color: hexToRGBA(colors.white, 0.8) }]}>
            Active • Expires {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={hexToRGBA(colors.white, 0.6)} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activePlanSummary: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },
  activePlanText: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
  },
  activePlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activePlanSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});
