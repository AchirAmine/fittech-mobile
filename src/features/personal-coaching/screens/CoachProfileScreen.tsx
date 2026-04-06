import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen } from '@shared/components';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';

import { useGetCoach } from '../hooks/useCoaching';
import { CoachHero } from '../components/CoachHero';
import { CoachDetailsSection } from '../components/CoachDetailsSection';
import { CoachActionFooter } from '../components/CoachActionFooter';

type ProfileRouteProp = RouteProp<HomeStackParamList, typeof ROUTES.MAIN.COACH_PROFILE>;

export const CoachProfileScreen = () => {
  const { colors } = useTheme();
  const route = useRoute<ProfileRouteProp>();
  const { coachId } = route.params;

  const { data: coach, isLoading } = useGetCoach(coachId);

  if (isLoading) {
    return (
      <AppScreen isLoading={true} loadingMessage="Loading coach profile...">
        <View style={styles.loadingContainer} />
      </AppScreen>
    );
  }

  if (!coach) {
    return (
      <AppScreen errorMessage="Coach not found">
        <View style={styles.errorContainer}>
          <Text style={{ color: colors.textSecondary }}>
            Sorry, we couldn't find this coach.
          </Text>
        </View>
      </AppScreen>
    );
  }

  const getInitialStatus = () => {
    if (!coach.invitation) return 'idle';
    switch (coach.invitation.status) {
      case 'PENDING': return 'requested';
      case 'ACCEPTED_UNPAID': return 'accepted';
      case 'ACTIVE': return 'accepted'; // Or maybe a new 'active' status
      default: return 'idle';
    }
  };

  const initialStatus = getInitialStatus();

  return (
    <AppScreen 
      safeArea={false} 
      scrollable={false} 
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <CoachHero 
          name={coach.name} 
          image={coach.image} 
          clientsCount={coach.clientsCount} 
          experience={coach.experience}
        />
        <CoachDetailsSection 
          specialty={coach.specialty} 
          experience={coach.experience} 
          about={coach.about} 
        />
        <CoachActionFooter 
          coachId={coach.id}
          name={coach.name}
          price={coach.price}
          initialStatus={initialStatus as any}
          image={coach.image}
        />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24,
  }
});
