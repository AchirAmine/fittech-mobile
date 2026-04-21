import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useRewards } from '../hooks/useRewards';
interface PointsBadgeProps {
  onPress?: () => void;
  balance?: number | string;
}
export const PointsBadge: React.FC<PointsBadgeProps> = ({ onPress, balance: externalBalance }) => {
  const { colors, isDark } = useTheme();
  const isExternalProvided = externalBalance !== undefined;
  const { data, isLoading } = useRewards(!isExternalProvided);
  const balance = isExternalProvided ? externalBalance : (data?.starBalance ?? (isLoading ? '...' : 0));
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: hexToRGBA(colors.primary, 0.1),
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="star" size={16} color="#FFD700" />
      <Text style={[styles.text, { color: colors.textPrimary }]}>{balance}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  text: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
