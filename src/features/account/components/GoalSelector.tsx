import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { GOALS } from '@shared/constants/healthConstants';

interface GoalSelectorProps {
  selectedGoal: string;
  isEditing: boolean;
  onSelect: (id: string) => void;
  colors: any;
  isDark: boolean;
}

export const GoalSelector = ({ selectedGoal, isEditing, onSelect, colors, isDark }: GoalSelectorProps) => {
  const visibleGoals = isEditing ? GOALS : GOALS.filter(g => g.id === selectedGoal);

  if (visibleGoals.length === 0) {
    return <Text style={[styles.emptyText, { color: colors.textMuted }]}>No goal selected</Text>;
  }

  return (
    <View style={styles.cardsContainer}>
      {visibleGoals.map((goal, index) => {
        const isSelected = selectedGoal === goal.id;
        return (
          <Animated.View
            key={goal.id}
            entering={FadeInRight.delay(isEditing ? 300 + index * 80 : 300).duration(400)}
          >
            <TouchableOpacity
              style={[
                styles.selectCard,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected
                    ? colors.primary + '12'
                    : isDark ? colors.card : '#fff',
                },
              ]}
              onPress={() => isEditing && onSelect(goal.id)}
              activeOpacity={isEditing ? 0.7 : 1}
            >
              <View style={[styles.cardIcon, { backgroundColor: goal.color + '20' }]}>
                <Ionicons name={goal.icon as any} size={24} color={goal.color} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{goal.label}</Text>
                <Text style={[styles.cardSub, { color: colors.textSecondary }]}>{goal.subtitle}</Text>
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
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 14,
    fontFamily: 'Regular', // Simplified for now, will use Theme.Typography if available or generic
    fontStyle: 'italic',
    marginLeft: 4,
  },
  cardsContainer: { gap: 10 },
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
    fontWeight: '600',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
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
