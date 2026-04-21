import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen } from '@shared/components';
import { NeonButton } from '@shared/components/ui/NeonButton';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { useGetActiveCoaching, useGetCoachSlots, useBookSlot } from '../hooks/useCoaching';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import WeeklyCalendar from '@shared/components/ui/WeeklyCalendar';
import { BookingStepHeader } from '../components/BookingStepHeader';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
export const BookSessionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: coaching } = useGetActiveCoaching();
  const { data: slots = [], isLoading: isLoadingSlots, refetch } = useGetCoachSlots();
  const { mutate: bookSlot, isPending: isBooking } = useBookSlot();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const availableTimes = React.useMemo(() => {
    return (slots as any[]).filter((slot: any) => {
      if (!slot.date) return false;
      const slotDate = new Date(slot.date);
      const year = slotDate.getUTCFullYear();
      const month = slotDate.getUTCMonth();
      const date = slotDate.getUTCDate();
      return (
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth() &&
        date === selectedDate.getDate()
      );
    }).map((slot: any) => ({
      id: slot.id,
      label: `${slot.startTime} - ${slot.endTime}`,
      isBooked: slot.isBookedByMember
    }));
  }, [slots, selectedDate]);
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  React.useEffect(() => {
    const firstAvailable = availableTimes.find(t => !t.isBooked);
    if (firstAvailable) {
      setSelectedTime(firstAvailable.id);
    } else {
      setSelectedTime('');
    }
  }, [availableTimes]);
  const handleConfirm = () => {
    if (!selectedTime) return;
    bookSlot(selectedTime, {
      onSuccess: () => {
        setShowSuccess(true);
      }
    });
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
      isLoading={isLoadingSlots || isBooking}
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
            disabled={!selectedTime || isBooking}
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
