import React, { useMemo, memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import SessionItem from './SessionItem';
import { Session } from '@appTypes/planning';
interface Props {
  sessions: Session[];
}
const SessionList: React.FC<Props> = ({ sessions }) => {
  const { colors } = useTheme();
  const { grouped, sortedTimes } = useMemo(() => {
    const acc = sessions.reduce((acc, session) => {
      const time = session.time;
      if (!acc[time]) acc[time] = [];
      acc[time].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
    return {
      grouped: acc,
      sortedTimes: Object.keys(acc).sort(),
    };
  }, [sessions]);
  if (sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconWrap, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
          <Ionicons name="calendar-outline" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Sessions Found</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          There are no classes or training sessions scheduled for this day/category.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {sortedTimes.map((time) => (
        <View key={time} style={styles.timeGroup}>
          <Text style={[styles.groupHeader, { color: colors.textSecondary }]}>
            {`${time} ${parseInt(time.split(':')[0]) < 12 ? 'AM' : 'PM'}`}
          </Text>
          <View style={styles.sessionsList}>
            {grouped[time].map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  timeGroup: {
    marginBottom: 24,
  },
  groupHeader: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
    marginBottom: 10,
  },
  sessionsList: {
    gap: 8,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});
export default memo(SessionList);
