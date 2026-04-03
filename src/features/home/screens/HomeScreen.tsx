import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen, Loader } from '@shared/components';
import { useAppSelector } from '@shared/hooks/useReduxHooks';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@navigation/routes';
import { HomeInactivePlan } from '../components/HomeInactivePlan';
import { HomeSection } from '../components/HomeSection';
import { SportChip } from '../components/SportChip';
import { FeatureCard } from '../components/FeatureCard';
import { hexToRGBA } from '@shared/constants/colors';
import { useGetAccount } from '@features/account/hooks/useAccount';
import { useGetMySubscriptions } from '@features/membership/hooks/useMembership';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { HomeActivePlan } from '../components/HomeActivePlan';
import QuickActionCard from '../components/QuickActionCard';
import { useGetActiveCoaching } from '@features/personal-coaching/hooks/useCoaching';
import { MyCoachingCard } from '@features/personal-coaching/components/MyCoachingCard';

export const HomeScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: accountUser } = useGetAccount();
  const { data: subscriptions, isLoading: isSubscriptionsLoading } = useGetMySubscriptions();
  const { data: coaching } = useGetActiveCoaching();

  const user = accountUser || authUser;

  const activeSubscription = subscriptions?.find(s => s.status === 'ACTIVE');
  const hasActivePlan = !!activeSubscription;

  const sports = [
    { id: '1', title: 'Boxing', emoji: '🥊' },
    { id: '2', title: 'Gym', emoji: '🏋️' },
    { id: '3', title: 'Swimming', emoji: '🏊' },
    { id: '4', title: 'Yoga', emoji: '🧘' },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Text style={[styles.greetingLabel, { color: colors.textSecondary }]}>Hello,</Text>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {user?.firstName || 'Guest'}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={[styles.notificationBadge, { borderColor: colors.card }]}>
              <View style={[styles.notificationDot, { backgroundColor: colors.error }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.avatarContainer, { backgroundColor: colors.cardSecondary }]} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProfileMain')}
          >
            {user?.profilePicture ? (
              <Image source={user.profilePicture as any} style={styles.avatar} resizeMode="cover" />
            ) : (
              <Ionicons name="person" size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      ),
      headerTitle: '',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.background,
      },
    });
  }, [navigation, user, colors]);

  const features = [
    { 
      id: '1', 
      title: 'Expert Coaches', 
      description: 'Train with champions and certified professionals.',
      icon: 'star',
      iconBg: isDark ? hexToRGBA(colors.warning, 0.15) : hexToRGBA(colors.warning, 0.1),
      iconColor: colors.warning
    },
    { 
      id: '2', 
      title: 'Clean Environment', 
      description: 'Hygienic and well-maintained facilities.',
      icon: 'sparkles',
      iconBg: isDark ? hexToRGBA(colors.info, 0.15) : hexToRGBA(colors.info, 0.1),
      iconColor: colors.info
    },
    { 
      id: '3', 
      title: 'Premium Equipment', 
      description: 'State-of-the-art machines and gear.',
      icon: 'barbell',
      iconBg: isDark ? hexToRGBA(colors.primaryMid, 0.15) : hexToRGBA(colors.primaryMid, 0.1),
      iconColor: colors.primaryMid
    },
  ];

  return (
    <AppScreen safeArea={false}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.discoverySection}>
            {isSubscriptionsLoading ? (
              <View style={[styles.activePlanSummary, { backgroundColor: colors.card, height: 160 }]}>
                <Loader />
              </View>
            ) : hasActivePlan ? (
              <HomeActivePlan 
                title={activeSubscription.offer.title}
                endDate={activeSubscription.endDate}
                onPress={() => navigation.navigate(ROUTES.MAIN.MEMBERSHIP as any)}
              />
            ) : (
              <HomeInactivePlan 
                onBrowsePlans={() => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS as any)} 
              />
            )}
          </View>

          {coaching && (
            <MyCoachingCard 
              coach={coaching.coach}
              planTitle={coaching.planTitle}
              onPress={() => navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD)}
              onDashboardPress={() => navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD)}
            />
          )}

          <HomeSection title="QUICK ACTIONS" titleColor={isDark ? colors.textSecondary : '#666'}>
            <View style={styles.quickActionRow}>
              <QuickActionCard 
                title="Planning" 
                icon="calendar" 
                iconColor="#A3FE1C" 
                iconBg={isDark ? hexToRGBA('#A3FE1C', 0.1) : '#F4FCDE'}
                onPress={() => navigation.navigate(ROUTES.MAIN.PLANNING as any)}
              />
              <QuickActionCard 
                title="Personal Coaches" 
                icon="people" 
                iconColor="#FF911A" 
                iconBg={isDark ? hexToRGBA('#FF911A', 0.1) : '#FFF3E5'}
                onPress={() => navigation.navigate(ROUTES.MAIN.PERSONAL_COACHES as any)}
              />
            </View>
          </HomeSection>

          <HomeSection title="EXPLORE OUR SPORTS" titleColor={colors.primary}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sportsScrollContent}
              decelerationRate="fast"
              snapToInterval={120}
            >
              {sports.map((sport) => (
                <SportChip 
                  key={sport.id} 
                  title={sport.title} 
                  emoji={sport.emoji} 
                />
              ))}
            </ScrollView>
          </HomeSection>

          <HomeSection title="WHY CHOOSE FITTECH" titleColor={colors.primary}>
            <View style={styles.featuresContainer}>
              {features.map((feature) => (
                <FeatureCard 
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  iconBg={feature.iconBg}
                  iconColor={feature.iconColor}
                />
              ))}
            </View>
          </HomeSection>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 4,
    paddingBottom: 6,
    paddingTop: 2,
    justifyContent: 'center',
  },
  greetingLabel: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 18,
    opacity: 0.8,
  },
  userName: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 24,
  },
  greeting: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  avatarContainer: {
    marginLeft: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContainer: {
    paddingTop: 10,
  },
  discoverySection: {
    marginBottom: 10,
  },
  activePlanSummary: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  activePlanText: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  activePlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportsScrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  featuresContainer: {
    gap: 16,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  scheduleTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coachText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
    opacity: 0.7,
  },
  scheduleSub: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 13,
  },
  scheduleIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleArrow: {
    marginLeft: 8,
  },
  quickActionGrid: {
    gap: 16,
    marginBottom: 20,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 16,
  },
});
