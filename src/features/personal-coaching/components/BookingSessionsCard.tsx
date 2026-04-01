import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { NeonButton } from '@shared/components/ui/NeonButton';
import { hexToRGBA } from '@shared/constants/colors';

interface BookingSessionsCardProps {
  onBookPress: () => void;
}

export const BookingSessionsCard = ({ onBookPress }: BookingSessionsCardProps) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>BOOKING SESSIONS</Text>
      <View style={[styles.bookingCard, { backgroundColor: isDark ? colors.card : '#FFF', shadowColor: colors.shadow }]}>
        <View style={[styles.emptyIconBg, { backgroundColor: isDark ? hexToRGBA(colors.textMuted, 0.1) : '#F8F9FE' }]}>
          <Ionicons name="calendar-outline" size={32} color={colors.textMuted} />
        </View>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No session booked yet.</Text>
        <NeonButton 
          title="Book a Session" 
          onPress={onBookPress} 
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  bookingCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 24,
  },
  bookBtn: {
    width: '100%',
  },
});
