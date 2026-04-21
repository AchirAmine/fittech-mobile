import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components';
import { useGetActiveCoaching } from '../hooks/useCoaching';
import { ROUTES } from '@navigation/routes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { CoachInfoCard } from '../components/CoachInfoCard';
import { BookingSessionsCard } from '../components/BookingSessionsCard';
import { NextSessionItem } from '../components/NextSessionItem';
import { EmptyCoachingState } from '../components/EmptyCoachingState';
export const MyCoachingDashboardScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { data: coaching, isLoading, refetch } = useGetActiveCoaching();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  if (isLoading) {
    return (
      <AppScreen isLoading={true} loadingMessage="Loading your coaching dashboard...">
        {null}
      </AppScreen>
    );
  }
  if (!coaching) {
    return (
      <AppScreen safeArea={true} style={{ backgroundColor: colors.background }}>
        <View style={styles.emptyContainer}>
          <EmptyCoachingState 
            onPress={() => navigation.navigate(ROUTES.MAIN.PERSONAL_COACHES)}
          />
        </View>
      </AppScreen>
    );
  }
  return (
    <AppScreen 
      safeArea={false} 
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <CoachInfoCard 
          name={coaching.coach.name}
          image={coaching.coach.image}
        />
        <BookingSessionsCard 
          onBookPress={() => navigation.navigate(ROUTES.MAIN.BOOK_SESSION)}
        />
        <View>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>NEXT SESSIONS</Text>
          {coaching.sessions.map((session: any) => (
            <NextSessionItem 
              key={session.id}
              day={session.day}
              time={session.time}
            />
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  }
});
