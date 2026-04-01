import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

interface TimeSlot {
  id: string;
  label: string;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string;
  onSlotSelect: (id: string) => void;
}

export const TimeSlotPicker = ({ slots, selectedSlotId, onSlotSelect }: TimeSlotPickerProps) => {
  const { colors, isDark } = useTheme();

  if (slots.length === 0) {
    return <Text style={{ color: colors.textMuted, fontSize: 14 }}>No available slots for this day.</Text>;
  }

  return (
    <View style={styles.timeRow}>
      {slots.map(time => {
        const isSelected = selectedSlotId === time.id;
        return (
          <TouchableOpacity
            key={time.id}
            onPress={() => onSlotSelect(time.id)}
            style={[
              styles.timeCard,
              { backgroundColor: isSelected ? colors.primary : (isDark ? colors.card : '#FFF') },
              !isSelected && styles.shadow
            ]}
          >
            <Text style={[styles.timeText, { color: isSelected ? '#FFF' : colors.textMuted }]}>{time.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    width: '48%',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  shadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
