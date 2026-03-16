import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { HEALTH_CONCERNS } from '@shared/constants/healthConstants';
import { ThemeColors } from '@shared/constants/colors';

interface RestrictionSelectorProps {
  selectedRestrictions: string[];
  isEditing: boolean;
  onToggle: (id: string) => void;
  colors: ThemeColors;
  isDark: boolean;
}

export const RestrictionSelector = ({ selectedRestrictions, isEditing, onToggle, colors, isDark }: RestrictionSelectorProps) => {
  const visibleConcerns = isEditing ? HEALTH_CONCERNS : HEALTH_CONCERNS.filter(c => (selectedRestrictions || []).includes(c.id));

  if (visibleConcerns.length === 0) {
    return <Text style={[styles.emptyText, { color: colors.textMuted }]}>None reported</Text>;
  }

  return (
    <View style={styles.cardsContainer}>
      {visibleConcerns.map((concern, index) => {
        const isSelected = (selectedRestrictions || []).includes(concern.id);
        return (
          <Animated.View
            key={concern.id}
            entering={FadeInRight.delay(isEditing ? 500 + index * 80 : 500).duration(400)}
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
              onPress={() => onToggle(concern.id)}
              activeOpacity={isEditing ? 0.7 : 1}
            >
              <View style={[styles.cardIcon, { backgroundColor: concern.color + '20' }]}>
                <Ionicons name={concern.icon as keyof typeof Ionicons.glyphMap} size={24} color={concern.color} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{concern.label}</Text>
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
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
