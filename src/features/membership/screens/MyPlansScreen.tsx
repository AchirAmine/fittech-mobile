import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '@navigation/routes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MembershipStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components/layout/AppScreen';
import { useGetMySubscriptions } from '../hooks/useMembership';
import { Subscription } from '@appTypes/index';

import { ActivePlanCard } from '../components/ActivePlanCard';
import { NeonButton } from '@shared/components/ui/NeonButton';

export const MyPlansScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MembershipStackParamList>>();
  const { data: subscriptions, isLoading, isError, error, refetch } = useGetMySubscriptions();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleCheck = (planId: string, planName: string) => {
    navigation.navigate(ROUTES.MAIN.PLAN_DETAILS, { planId, planName });
  };

  const activeSubscriptions = (subscriptions || []).filter((s: Subscription) => s.status === 'ACTIVE');

  return (
    <AppScreen 
      safeArea={false}
      errorMessage={isError ? (error as any)?.message || 'Failed to load your plans' : null} 
      isLoading={isLoading}
      backgroundColor={colors.background}
      contentContainerStyle={styles.scrollContent}
    >
      {activeSubscriptions.length > 0 ? (
        <>
          {activeSubscriptions.map((sub: Subscription) => (
            <ActivePlanCard
              key={sub.id}
              title={sub.offer.title}
              subtitle={`${(sub.offer.sports || []).map(s => s.sportType).join(' & ')}`}
              image={sub.offer.picture ? { uri: `${process.env.EXPO_PUBLIC_API_URL?.split('/api')[0]}/${sub.offer.picture}` } : undefined}
              value={sub.endDate ? Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)).toString() : '0'}
              unit="DAYS REMAINING"
              onPress={() => handleCheck(sub.id, sub.offer.title)}
            />
          ))}
          <NeonButton 
            title="Explore More Plans" 
            onPress={() => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS as any)}
            style={styles.exploreMoreBtn}
            icon="compass-outline"
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="card-outline" size={64} color={colors.primaryLight} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Active Plans</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            You haven't subscribed to any membership plan yet. Start your fitness journey today!
          </Text>
          <NeonButton 
            title="Explore Plans" 
            onPress={() => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS as any)}
            style={styles.exploreBtn}
            icon="compass-outline"
          />
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
    gap: 20,
  },
  exploreMoreBtn: {
    marginTop: 10,
    borderRadius: 16,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  exploreBtn: {
    width: '100%',
    borderRadius: 16,
  },
});
