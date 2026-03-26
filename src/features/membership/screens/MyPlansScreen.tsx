import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '@navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MembershipStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components/layout/AppScreen';
import { useGetMySubscriptions } from '../hooks/useMembership';
import { Subscription } from '@appTypes/index';

import { ActivePlanCard } from '../components/ActivePlanCard';

export const MyPlansScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MembershipStackParamList>>();
  const { data: subscriptions, isLoading, isError, error } = useGetMySubscriptions();

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
        activeSubscriptions.map((sub: Subscription) => (
          <ActivePlanCard
            key={sub.id}
            title={sub.offer.title}
            subtitle={`${(sub.offer.sports || []).map(s => s.sportType).join(' & ')}`}
            image={sub.offer.picture ? { uri: `${process.env.EXPO_PUBLIC_API_URL?.split('/api')[0]}/${sub.offer.picture}` } : undefined}
            value={sub.endDate ? Math.ceil((new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)).toString() : '0'}
            unit="DAYS REMAINING"
            onPress={() => handleCheck(sub.id, sub.offer.title)}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No active plans found.</Text>
        </View>
      )}

      {/* Add a Plan Action */}
      <TouchableOpacity 
        style={[styles.addPlanCard, { backgroundColor: isDark ? colors.card : colors.cardSecondary }]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS as any)}
      >
        <View style={[styles.addIconCircle, { backgroundColor: colors.primaryMid }]}>
          <Ionicons name="add" size={28} color={colors.white} />
        </View>
        <View style={styles.addPlanTextContent}>
          <Text style={[styles.addPlanTitle, { color: colors.textPrimary }]}>Add a Plan</Text>
          <Text style={[styles.addPlanSubtitle, { color: colors.textSecondary }]}>Explore available packages</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.border} />
      </TouchableOpacity>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
    gap: 20,
  },
  addPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginTop: 10,
  },
  addIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addPlanTextContent: {
    flex: 1,
  },
  addPlanTitle: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  addPlanSubtitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 15,
  },
});
