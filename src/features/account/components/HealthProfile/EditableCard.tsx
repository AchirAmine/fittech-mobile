import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { ThemeColors } from '@shared/constants/colors';
import { Theme } from '@shared/constants/theme';
interface EditableCardProps {
  label: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  isSelected: boolean;
  isEditing: boolean;
  onPress: () => void;
  colors: ThemeColors;
  isDark: boolean;
  index?: number;
  isOther?: boolean;
  otherValue?: string;
  onChangeOtherText?: (text: string) => void;
  otherPlaceholder?: string;
}
export const EditableCard = ({ 
  label, 
  subtitle, 
  iconName, 
  iconColor, 
  isSelected, 
  isEditing, 
  onPress, 
  colors, 
  isDark,
  index = 0,
  isOther = false,
  otherValue = '',
  onChangeOtherText,
  otherPlaceholder,
}: EditableCardProps) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(isEditing ? 500 + index * 80 : 500).duration(400)}
    >
      <TouchableOpacity
        style={[
          styles.selectCard,
          {
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isSelected
              ? colors.primary + '12'
              : isDark ? colors.card : colors.white,
          },
        ]}
        onPress={onPress}
        disabled={!isEditing}
        activeOpacity={isEditing ? 0.7 : 1}
      >
        <View style={[styles.cardIcon, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.cardText}>
          <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{label}</Text>
          {isOther && isSelected ? (
            isEditing ? (
              <TextInput
                style={[styles.cardInput, { color: colors.primaryMid, marginTop: 2 }]}
                value={otherValue}
                onChangeText={onChangeOtherText}
                placeholder={otherPlaceholder || "Specify..."}
                placeholderTextColor={colors.textMuted}
                multiline={false}
              />
            ) : (
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {otherValue || "Not specified"}
              </Text>
            )
          ) : (
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
        {isEditing && (
          <View style={[
            styles.checkCircle,
            { 
              backgroundColor: isSelected ? colors.primary : 'transparent', 
              borderColor: isSelected ? colors.primary : colors.border 
            },
          ]}>
            {isSelected && <Ionicons name="checkmark" size={15} color="#fff" />}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 14,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { flex: 1 },
  cardLabel: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  cardInput: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    padding: 0,
    margin: 0,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
