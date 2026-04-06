import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen, Loader } from '@shared/components';
import { useAppSelector } from '@shared/hooks/useReduxHooks';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@navigation/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { HomeActivePlan } from '../components/HomeActivePlan';
import { HomeInactivePlan } from '../components/HomeInactivePlan';
import { MyCoachingCard } from '@features/personal-coaching/components/MyCoachingCard';
import { useHomeSummary } from '../hooks/useHomeSummary';
import { NearestCourseCard } from '../components/NearestCourseCard';
import { HomePlanningCard } from '../components/HomePlanningCard';
import { FindCoachCard } from '../components/FindCoachCard';
import { HomeCheckInCard } from '../components/HomeCheckInCard';

export const HomeScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: summary, isLoading: isSummaryLoading } = useHomeSummary();

  const user = summary ? {
    firstName: summary.fullName.split(' ')[0],
    lastName: summary.fullName.split(' ').slice(1).join(' '),
    profilePicture: summary.profilePicture 
      ? { uri: summary.profilePicture.startsWith('http') 
          ? summary.profilePicture 
          : `${process.env.EXPO_PUBLIC_API_URL?.split('/api')[0]}/${summary.profilePicture}` 
        } 
      : undefined,
  } : authUser;

  const hasActivePlan = !!summary?.activeSubscription;
  const activeSubscription = summary?.activeSubscription;

  const coaching = summary?.personalCoachName ? {
    coach: {
      id: 'active',
      name: summary.personalCoachName,
      specialty: 'Personal Training',
      clientsCount: 1,
      image: require('@assets/images/coaches/coach-1.png'),
      experience: 'Professional',
      price: 0,
      about: 'Your active personal coach.'
    },
    planTitle: 'Personal Coaching'
  } : null;

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

  return (
    <AppScreen 
      safeArea={false}
      isLoading={isSummaryLoading}
      backgroundColor={colors.background}
    >
      {!isSummaryLoading && (
        <ScrollView 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContainer}>
            <View style={styles.discoverySection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>
                YOUR SUBSCRIPTION
              </Text>
              {hasActivePlan && activeSubscription ? (
                <HomeActivePlan 
                  title={activeSubscription.offerTitle}
                  endDate={activeSubscription.endDate || undefined}
                  onPress={() => navigation.navigate(ROUTES.MAIN.MY_PLANS as any)}
                />
              ) : (
                <HomeInactivePlan 
                  onBrowsePlans={() => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS as any)} 
                />
              )}
            </View>

            {summary?.nearestCourse && (
              <NearestCourseCard 
                title={summary.nearestCourse.title}
                startTime={summary.nearestCourse.startTime}
                gymZone={summary.nearestCourse.gymZone}
                onPress={() => navigation.navigate(ROUTES.MAIN.COURSE_DETAILS as any, { 
                  courseId: summary.nearestCourse?.id,
                  courseTitle: summary.nearestCourse?.title 
                })}
              />
            )}

            {coaching ? (
              <MyCoachingCard 
                coach={coaching.coach}
                planTitle={coaching.planTitle}
                onPress={() => navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD)}
                onDashboardPress={() => navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD)}
              />
            ) : (
              <FindCoachCard 
                onPress={() => navigation.navigate(ROUTES.MAIN.PERSONAL_COACHES as any)} 
              />
            )}

            <HomePlanningCard 
              onPress={() => navigation.navigate(ROUTES.MAIN.PLANNING as any)}
            />

            <HomeCheckInCard />
          </View>
        </ScrollView>
      )}
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
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mainContainer: {
    paddingTop: 10,
  },
  discoverySection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 12,
  },
  activePlanSummary: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
