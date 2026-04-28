import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

interface CheckInOptionCardProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  onPress: () => void;
  disabled?: boolean;
}

export const CheckInOptionCard = ({
  title,
  subtitle,
  iconName,
  iconColor,
  iconBgColor,
  onPress,
  disabled,
}: CheckInOptionCardProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.optionCard, { backgroundColor: colors.card }]}
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? undefined : onPress}
    >
      <View style={[styles.optionIconContainer, { backgroundColor: iconBgColor, borderRadius: 14 }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <View style={[styles.checkInBtn, { backgroundColor: colors.primaryMid, opacity: disabled ? 0.4 : 1 }]}>
        <Text style={styles.checkInBtnText}>Check In</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    marginBottom: 12,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  checkInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkInBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
