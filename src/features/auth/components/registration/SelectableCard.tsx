import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

export interface SelectableCardProps {
  label: string;
  subtitle?: string;
  emoji?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  subtitle,
  emoji,
  iconName,
  isSelected,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primaryMid : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconWrapper, { backgroundColor: isSelected ? colors.primaryMid : colors.cardSecondary }]}>
          {emoji ? (
            <Text style={styles.emoji}>{emoji}</Text>
          ) : iconName ? (
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isSelected ? colors.white : colors.primaryMid} 
            />
          ) : null}
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.label,
              { color: isSelected ? colors.primaryMid : colors.textPrimary },
            ]}
          >
            {label}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.checkCircle,
          {
            backgroundColor: isSelected ? colors.primaryMid : 'transparent',
            borderColor: isSelected ? colors.primaryMid : colors.textSecondary,
          },
        ]}
      >
        {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Theme.Radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    width: '100%',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Theme.Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: Theme.Typography.fontFamily.semiBold,
    fontSize: 16,
  },
  subtitle: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
