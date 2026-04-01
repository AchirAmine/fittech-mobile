import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen } from '@shared/components';
import { NeonButton } from '@shared/components/ui/NeonButton';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { useGetActiveCoaching } from '../hooks/useCoaching';
import { useNavigation } from '@react-navigation/native';
import WeeklyCalendar from '@shared/components/ui/WeeklyCalendar';
import { BookingStepHeader } from '../components/BookingStepHeader';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { BookingSummaryCard } from '../components/BookingSummaryCard';

const ALL_TIME_SLOTS: Record<number, { id: string; label: string }[]> = {
  1: [
    { id: 'm1', label: '10:00 - 12:00' },
    { id: 'm2', label: '13:00 - 14:00' },
    { id: 'm3', label: '16:00 - 17:00' },
  ],
  2: [
    { id: 't1', label: '16:00 - 18:00' },
  ],
  3: [
    { id: 'w1', label: '09:00 - 11:00' },
    { id: 'w2', label: '14:00 - 15:00' },
  ],
  4: [
    { id: 'th1', label: '11:00 - 13:00' },
    { id: 'th2', label: '15:00 - 17:00' },
  ],
  5: [
    { id: 'f1', label: '08:00 - 10:00' },
    { id: 'f2', label: '13:00 - 16:00' },
  ],
  6: [
    { id: 's1', label: '10:00 - 12:00' },
  ],
  0: []
};

export const BookSessionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: coaching } = useGetActiveCoaching();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const availableTimes = React.useMemo(() => {
    const day = selectedDate.getDay();
    return ALL_TIME_SLOTS[day] || [];
  }, [selectedDate]);

  const [selectedTime, setSelectedTime] = useState(availableTimes[0]?.id || '');
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (availableTimes.length > 0) {
      setSelectedTime(availableTimes[0].id);
    } else {
      setSelectedTime('');
    }
  }, [availableTimes]);

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  const timeLabel = availableTimes.find(t => t.id === selectedTime);

  const formattedDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <AppScreen 
      safeArea={false} 
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <BookingStepHeader step={1} title="Select a Day" />
          <WeeklyCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </View>

        <View style={styles.section}>
          <BookingStepHeader step={2} title="Pick a Time" />
          <TimeSlotPicker 
            slots={availableTimes}
            selectedSlotId={selectedTime}
            onSlotSelect={setSelectedTime}
          />
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          <BookingStepHeader step={3} title="Confirm Session" />
          {coaching && (
            <BookingSummaryCard 
              coach={coaching.coach}
              date={formattedDate}
              timeSlot={timeLabel?.label || ''}
            />
          )}
        </View>

        <View style={styles.footer}>
          <NeonButton 
            title="Confirm Booking" 
            onPress={handleConfirm}
            icon="checkmark-circle-outline"
            disabled={!selectedTime}
          />
        </View>
      </ScrollView>

      <StatusModal
        visible={showSuccess}
        type="success"
        title="Booking Confirmed!"
        message="Your training session has been successfully scheduled. You can view it in your dashboard."
        onConfirm={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        onClose={() => setShowSuccess(false)}
        confirmText="Back to Dashboard"
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 40,
  },
  section: {
    marginBottom: 32,
  },
  footer: {
    marginTop: 20,
  },
});
