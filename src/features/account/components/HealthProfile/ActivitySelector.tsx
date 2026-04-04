import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ACTIVITIES } from '@shared/constants/healthConstants';
import { ThemeColors } from '@shared/constants/colors';
import { EditableCard } from './EditableCard';

interface ActivitySelectorProps {
  selectedActivities: string[];
  isEditing: boolean;
  onToggle: (id: string) => void;
  colors: ThemeColors;
  isDark: boolean;
  otherValue?: string;
  onChangeOtherText?: (text: string) => void;
}

export const ActivitySelector = ({ 
  selectedActivities, 
  isEditing, 
  onToggle, 
  colors, 
  isDark,
  otherValue,
  onChangeOtherText,
}: ActivitySelectorProps) => {
  const visibleActivities = isEditing ? ACTIVITIES : ACTIVITIES.filter(c => (selectedActivities || []).includes(c.id));

  if (visibleActivities.length === 0) {
    return <Text style={[styles.emptyText, { color: colors.textMuted }]}>No preferred activities</Text>;
  }

  return (
    <View style={styles.cardsContainer}>
      {visibleActivities.map((activity, index) => (
        <EditableCard
          key={activity.id}
          label={activity.label}
          subtitle={activity.subtitle}
          iconName={activity.icon as any}
          iconColor={colors.primary}
          isSelected={(selectedActivities || []).includes(activity.id)}
          isEditing={isEditing}
          onPress={() => onToggle(activity.id)}
          colors={colors}
          isDark={isDark}
          index={index}
          isOther={activity.id === 'other'}
          otherValue={otherValue}
          onChangeOtherText={onChangeOtherText}
          otherPlaceholder="What activity?"
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
