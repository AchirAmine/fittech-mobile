import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 36;
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen, Loader } from '@shared/components';
import { useAppSelector } from '@shared/hooks/useReduxHooks';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '@navigation/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { HomeActivePlan } from '../components/HomeActivePlan';
import { HomeInactivePlan } from '../components/HomeInactivePlan';
import { MyCoachingCard } from '@features/personal-coaching/components/MyCoachingCard';
import { useHomeSummary } from '../hooks/useHomeSummary';
import { NearestCourseCard } from '../components/NearestCourseCard';
import { AttendanceCheckInCard } from '../components/AttendanceCheckInCard';
import { HomePlanningCard } from '../components/HomePlanningCard';
import { CheckInCard } from '@features/check-in-out/components/CheckInCard';
import { PointsBadge } from '@features/rewards/components/PointsBadge';
import { getImageSource } from '@shared/utils/imageUtils';
import { useUnreadCount } from '@features/notifications/hooks/useNotifications';
import { HomeExerciseCard } from '../components/HomeExerciseCard';
import { HomeProgressCard } from '../components/HomeProgressCard';
import { HomeNutritionCard } from '../components/HomeNutritionCard';

const isScanTime = (dateString: string, startTime: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (!isToday) return false;

  try {
    const [hours, minutes] = startTime.split(':').map(Number);
    const courseTime = new Date();
    courseTime.setHours(hours, minutes, 0, 0);

    const diffInMinutes = (courseTime.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 60 && diffInMinutes >= -60;
  } catch (e) {
    return true;
  }
};

export const HomeScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: summary, isLoading: isSummaryLoading, refetch } = useHomeSummary();
  const unreadCount = useUnreadCount();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.max(0, Math.round(xOffset / (CARD_WIDTH + 16)));
    setActiveSlide(index);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const user = summary ? {
    firstName: summary.fullName.split(' ')[0],
    lastName: summary.fullName.split(' ').slice(1).join(' '),
    profilePicture: getImageSource(summary.profilePicture),
  } : authUser;
  const hasActivePlan = summary?.hasActiveSubscription || false;
  const activeSubscriptions = summary?.subscriptions?.filter((s: any) => s.status === 'ACTIVE' && (!s.endDate || new Date(s.endDate).getTime() > new Date().getTime())) || [];

  const coachingState = summary?.personalCoaching?.state;
  const SHOW_COACHING_CARD_STATES = ['ACTIVE', 'INVITATION_PENDING', 'ACCEPTED_NOT_PAID', 'PAYMENT_PENDING'];
  const showCoachingCard = coachingState && SHOW_COACHING_CARD_STATES.includes(coachingState) && summary?.personalCoaching?.coach;

  const coaching = showCoachingCard ? {
    coach: {
      id: summary!.personalCoaching!.coach!.id,
      name: `${summary!.personalCoaching!.coach!.firstName} ${summary!.personalCoaching!.coach!.lastName}`,
      specialty: summary!.personalCoaching!.coach!.speciality || 'Personal Training',
      clientsCount: 1,
      image: getImageSource(summary!.personalCoaching!.coach!.profilePicture),
      experience: 'Professional',
      price: 0,
      about: 'Your coach.'
    },
    planTitle: summary!.personalCoaching!.label,
    state: coachingState as any,
  } : null;

  const handleCoachingPress = () => {
    if (!coaching) return;
    if (coaching.state === 'ACTIVE') {
      navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD as any);
    } else if (coaching.state === 'PAYMENT_PENDING') {
      return;
    } else {
      navigation.navigate(ROUTES.MAIN.COACH_PROFILE as any, { coachId: coaching.coach.id });
    }
  };

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
          <PointsBadge
            balance={summary?.starBalance ?? (isSummaryLoading ? '...' : undefined)}
            onPress={() => navigation.navigate(ROUTES.MAIN.REWARDS as any)}
          />
          <TouchableOpacity
            style={styles.notificationBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ROUTES.MAIN.NOTIFICATIONS as any)}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            {summary?.hasUnreadNotifications && (
              <View style={[styles.notificationBadge, { borderColor: colors.card }]}>
                <View style={[styles.notificationDot, { backgroundColor: colors.error }]} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.avatarContainer, { backgroundColor: colors.cardSecondary }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProfileMain' as any)}
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
  }, [navigation, user, colors, summary?.hasUnreadNotifications, isSummaryLoading]);
  return (
    <AppScreen
      safeArea={false}
      isLoading={isSummaryLoading}
      backgroundColor={colors.background}
    >
      {!isSummaryLoading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.mainContainer}>
            {!hasActivePlan && (
              <View style={styles.welcomeBanner}>
                <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
                  Ready to start your journey?
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                  Browse our plans to unlock premium features, book your courses, and achieve your fitness goals with us!
                </Text>
              </View>
            )}
            {summary?.nearestCourse && (
              isScanTime(summary.nearestCourse.date, summary.nearestCourse.startTime) ? (
                <View style={styles.discoverySection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    MARK ATTENDANCE
                  </Text>
                  <AttendanceCheckInCard
                    courseTitle={summary.nearestCourse.title}
                    startTime={summary.nearestCourse.startTime}
                    onPress={() => navigation.navigate(ROUTES.MAIN.COURSE_ATTENDANCE as any)}
                  />
                </View>
              ) : (
                <View style={styles.discoverySection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    NEXT COURSE
                  </Text>
                  <NearestCourseCard
                    title={summary.nearestCourse.title}
                    startTime={summary.nearestCourse.startTime}
                    gymZone={summary.nearestCourse.gymZone}
                  />
                </View>
              )
            )}
            {hasActivePlan && (
              <View style={styles.discoverySection}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  GYM ACCESS
                </Text>
                <CheckInCard />
              </View>
            )}

            <View style={styles.discoverySection}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {activeSubscriptions.length > 1 ? 'YOUR SUBSCRIPTIONS' : 'YOUR SUBSCRIPTION'}
              </Text>
              {hasActivePlan && activeSubscriptions.length > 0 ? (
                <View style={{ marginHorizontal: -18 }}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 16, paddingHorizontal: 18 }}
                    snapToInterval={CARD_WIDTH + 16}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                  >
                    {activeSubscriptions.map((sub: any) => (
                      <View key={sub.id} style={{ width: CARD_WIDTH }}>
                        <HomeActivePlan
                          title={sub.offer.title}
                          endDate={sub.endDate || undefined}
                          onPress={() => navigation.navigate(ROUTES.MAIN.PLAN_DETAILS as any, { planId: sub.id, planName: sub.offer.title })}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  {activeSubscriptions.length > 1 && (
                    <View style={styles.paginationContainer}>
                      {activeSubscriptions.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.paginationDot,
                            activeSlide === index ? [styles.paginationDotActive, { backgroundColor: colors.primaryMid }] : { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <HomeInactivePlan
                  onBrowsePlans={() => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS as any)}
                />
              )}
            </View>

            {hasActivePlan && coaching && (
              <View style={styles.discoverySection}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  PERSONAL COACHING
                </Text>
                <MyCoachingCard
                  coach={coaching.coach}
                  planTitle={coaching.planTitle}
                  state={coaching.state}
                  onPress={handleCoachingPress}
                  onDashboardPress={handleCoachingPress}
                  onChatPress={() => navigation.navigate(ROUTES.MAIN.CHAT_MAIN as any)}
                />
              </View>
            )}

            {hasActivePlan && (
              <>
                <View style={styles.discoverySection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    YOUR PROGRESS
                  </Text>
                  <HomeProgressCard
                    onPress={() => navigation.navigate(ROUTES.MAIN.PROGRESS_TRACKER as any)}
                  />
                </View>

                <View style={styles.discoverySection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    NUTRITION & DIET
                  </Text>
                  <HomeNutritionCard
                    onPress={() => navigation.navigate(ROUTES.MAIN.NUTRITION as any)}
                  />
                </View>

                <View style={styles.discoverySection}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    EXPLORE EXERCISES
                  </Text>
                  <HomeExerciseCard
                    onPress={() => navigation.navigate(ROUTES.MAIN.EXERCISES as any)}
                  />
                </View>
              </>
            )}

            <View style={styles.discoverySection}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                YOUR SCHEDULE
              </Text>
              <HomePlanningCard
                onPress={() => navigation.navigate(ROUTES.MAIN.PLANNING as any)}
              />
            </View>
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
  welcomeBanner: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
    lineHeight: 32,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 24,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    marginBottom: 24,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    width: 24,
  },
});
