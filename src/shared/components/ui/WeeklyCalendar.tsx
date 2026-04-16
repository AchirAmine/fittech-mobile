import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface Props {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const WeeklyCalendar: React.FC<Props> = ({ 
  selectedDate, 
  onDateSelect, 
}) => {
  const { colors, isDark } = useTheme();
  
  const [viewDate, setViewDate] = React.useState(new Date(selectedDate));

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(viewDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + i);
      days.push(nextDay);
    }
    return days;
  }, [viewDate]);

  const weekRangeText = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const startDate = start.getDate();
    const endDate = end.getDate();

    const today = new Date();
    today.setHours(0,0,0,0);
    const isThisWeek = weekDays.some(day => day.getTime() === today.getTime());
    const label = isThisWeek ? 'This Week' : 'Selected Week';

    return `${label} · ${startMonth} ${startDate} – ${endMonth} ${endDate}`;
  }, [weekDays]);

  const handlePrevWeek = () => {
    const prev = new Date(viewDate);
    prev.setDate(prev.getDate() - 7);
    setViewDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(viewDate);
    next.setDate(next.getDate() + 7);
    setViewDate(next);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.weekNavigator, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : colors.card }]}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <Text style={[styles.weekRange, { color: colors.textPrimary }]}>
          {weekRangeText}
        </Text>

        <TouchableOpacity onPress={handleNextWeek} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {weekDays.map((day, index) => {
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
          const dateNum = day.getDate();

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = day.getTime() < today.getTime();

          return (
            <TouchableOpacity 
              key={index}
              onPress={() => !isPast && onDateSelect(day)}
              disabled={isPast}
              style={[
                styles.dayCard,
                { backgroundColor: isDark ? hexToRGBA(colors.white, 0.03) : colors.card },
                isSelected && { backgroundColor: colors.primary },
                isPast && { opacity: 0.3 }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayName, 
                { color: colors.textMuted },
                isSelected && { color: hexToRGBA(colors.white, 0.8) }
              ]}>
                {dayName}
              </Text>
              <Text style={[
                styles.dateNum, 
                { color: colors.textPrimary },
                isSelected && { color: colors.white }
              ]}>
                {dateNum}
              </Text>
              {isSelected && <View style={[styles.activeDot, { backgroundColor: colors.white }]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  weekNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  navBtn: {
    padding: 4,
  },
  weekRange: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 15,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayCard: {
    flex: 1,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayName: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 10,
    marginBottom: 4,
  },
  dateNum: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 18,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 6,
  },
});

export default WeeklyCalendar;
