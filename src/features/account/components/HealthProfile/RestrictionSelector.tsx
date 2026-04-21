import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HEALTH_CONCERNS } from '@shared/constants/healthConstants';
import { ThemeColors } from '@shared/constants/colors';
import { EditableCard } from './EditableCard';
interface RestrictionSelectorProps {
  selectedRestrictions: string[];
  isEditing: boolean;
  onToggle: (id: string) => void;
  colors: ThemeColors;
  isDark: boolean;
  otherValue?: string;
  onChangeOtherText?: (text: string) => void;
}
export const RestrictionSelector = ({ 
  selectedRestrictions, 
  isEditing, 
  onToggle, 
  colors, 
  isDark,
  otherValue,
  onChangeOtherText,
}: RestrictionSelectorProps) => {
  const visibleConcerns = isEditing ? HEALTH_CONCERNS : HEALTH_CONCERNS.filter(c => (selectedRestrictions || []).includes(c.id));
  if (visibleConcerns.length === 0) {
    return <Text style={[styles.emptyText, { color: colors.textMuted }]}>None reported</Text>;
  }
  return (
    <View style={styles.cardsContainer}>
      {visibleConcerns.map((concern, index) => (
        <EditableCard
          key={concern.id}
          label={concern.label}
          subtitle={concern.subtitle}
          iconName={concern.icon as any}
          iconColor={concern.color}
          isSelected={(selectedRestrictions || []).includes(concern.id)}
          isEditing={isEditing}
          onPress={() => onToggle(concern.id)}
          colors={colors}
          isDark={isDark}
          index={index}
          isOther={concern.id === 'other'}
          otherValue={otherValue}
          onChangeOtherText={onChangeOtherText}
          otherPlaceholder="Describe your concern"
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  cardsContainer: { gap: 10 },
});
