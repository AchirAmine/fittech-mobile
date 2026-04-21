import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
interface TimeSlot {
  id: string,
  label: string;
  isBooked?: boolean;
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
        const isBooked = time.isBooked;
        return (
          <TouchableOpacity
            key={time.id}
            onPress={() => !isBooked && onSlotSelect(time.id)}
            disabled={isBooked}
            style={[
              styles.timeCard,
              { 
                backgroundColor: isSelected 
                  ? colors.primary 
                  : isBooked 
                    ? (isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5')
                    : (isDark ? colors.card : '#FFF') 
              },
              (!isSelected && !isBooked) && styles.shadow,
              isBooked && { opacity: 0.6 }
            ]}
          >
            <Text style={[
              styles.timeText, 
              { color: isSelected ? '#FFF' : isBooked ? colors.textMuted : colors.textPrimary }
            ]}>
              {time.label}
            </Text>
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
