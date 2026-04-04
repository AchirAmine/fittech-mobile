import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GOALS } from '@shared/constants/healthConstants';
import { ThemeColors } from '@shared/constants/colors';
import { EditableCard } from './EditableCard';

interface GoalSelectorProps {
  selectedGoals: string[];
  isEditing: boolean;
  onToggle: (id: string) => void;
  colors: ThemeColors;
  isDark: boolean;
  otherValue?: string;
  onChangeOtherText?: (text: string) => void;
}

export const GoalSelector = ({ 
  selectedGoals, 
  isEditing, 
  onToggle, 
  colors, 
  isDark,
  otherValue,
  onChangeOtherText,
}: GoalSelectorProps) => {
  const visibleGoals = isEditing ? GOALS : GOALS.filter(g => (selectedGoals || []).includes(g.id));

  if (visibleGoals.length === 0) {
    return <Text style={[styles.emptyText, { color: colors.textMuted }]}>No goal selected</Text>;
  }

  return (
    <View style={styles.cardsContainer}>
      {visibleGoals.map((goal, index) => (
        <EditableCard
          key={goal.id}
          label={goal.label}
          subtitle={goal.subtitle}
          iconName={goal.icon as any}
          iconColor={goal.color}
          isSelected={(selectedGoals || []).includes(goal.id)}
          isEditing={isEditing}
          onPress={() => onToggle(goal.id)}
          colors={colors}
          isDark={isDark}
          index={index}
          isOther={goal.id === 'other'}
          otherValue={otherValue}
          onChangeOtherText={onChangeOtherText}
          otherPlaceholder="What is your goal?"
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
