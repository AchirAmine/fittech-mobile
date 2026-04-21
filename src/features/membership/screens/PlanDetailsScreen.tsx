import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components/layout/AppScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MembershipStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useGetMySubscriptions } from '../hooks/useMembership';
import { Subscription } from '@appTypes/index';
import { hexToRGBA } from '@shared/constants/colors';

type Props = NativeStackScreenProps<MembershipStackParamList, typeof ROUTES.MAIN.PLAN_DETAILS>;

export const PlanDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors, isDark } = useTheme();
  const { planId } = route.params;
  const { data: subscriptions, isLoading, isError, error } = useGetMySubscriptions();

  const subscription = subscriptions?.find(s => s.id === planId);

  if (isLoading) {
    return <AppScreen isLoading={true} errorMessage={null}><View /></AppScreen>;
  }

  if (isError || !subscription) {
    return (
      <AppScreen errorMessage={isError ? (error as any)?.message || 'Plan not found' : 'Subscription not found'}>
        <View style={styles.errorContainer} />
      </AppScreen>
    );
  }

  const { offer } = subscription;
  const renewalDate = subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A';

  return (
    <AppScreen scrollable={false} backgroundColor={colors.background}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {}
        <View style={[styles.subscriptionCard, { backgroundColor: colors.primaryMid, shadowColor: colors.black }]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={[styles.subscriptionLabel, { color: hexToRGBA(colors.white, 0.7) }]}>CURRENT SUBSCRIPTION</Text>
              <Text style={[styles.planTitle, { color: colors.white }]}>{offer.title}</Text>
            </View>
            <View style={[styles.activeBadge, { backgroundColor: subscription.status === 'ACTIVE' ? colors.success : colors.warning }]}>
              <Ionicons name={subscription.status === 'ACTIVE' ? "checkmark-circle" : "time-outline"} size={12} color={colors.white} />
              <Text style={[styles.activeBadgeText, { color: colors.white }]} numberOfLines={1}>{subscription.status}</Text>
            </View>
          </View>
          <View style={styles.renewalInfo}>
            <Ionicons name="calendar-outline" size={20} color={colors.white} style={styles.calendarIcon} />
            <Text style={[styles.renewalText, { color: hexToRGBA(colors.white, 0.8) }]}>Renews on {renewalDate}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart" size={20} color={colors.primaryMid} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Session Balances</Text>
        </View>

        <View style={styles.statsContainer}>
          {}
          {(() => {
            const initialSolo = (offer.sports || []).reduce((acc, s) => acc + s.freeSessions, 0);
            const soloProgress = initialSolo > 0 ? (subscription.remainingOpenSessions / initialSolo) : 0;
            
            return (
              <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Solo Sessions Remaining</Text>
                  <Text style={[styles.progressCounter, { color: colors.primaryMid }]}>
                    {subscription.remainingOpenSessions} <Text style={{ color: colors.textSecondary }}>/ {initialSolo}</Text>
                  </Text>
                </View>
                
                <View style={[styles.progressBarBg, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) }]}>
                  <View style={[styles.progressBarFill, { backgroundColor: colors.primaryMid, width: `${soloProgress * 100}%` }]} />
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.infoText, { color: colors.textMuted }]}>Shared across all available activities.</Text>
                </View>
              </View>
            );
          })()}

          {}
          <View style={styles.sectionHeader}>
              <Text style={[styles.subSectionTitle, { color: colors.textMuted, marginTop: 10 }]}>COACH ASSISTANCE</Text>
          </View>
          
          {(subscription.sportBalances && subscription.sportBalances.length > 0) ? (
            subscription.sportBalances.map(balance => {
              const initialSport = (offer.sports || []).find(s => s.sportType.toUpperCase() === balance.sportType.toUpperCase());
              const initialCoach = initialSport?.coachSessions || 0;
              const coachProgress = initialCoach > 0 ? (balance.remainingSessions / initialCoach) : 0;

              return (
                <View key={balance.id} style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>{balance.sportType.toUpperCase()}</Text>
                    <Text style={[styles.progressCounter, { color: colors.primaryMid }]}>
                      {balance.remainingSessions} <Text style={{ color: colors.textSecondary }}>/ {initialCoach}</Text>
                    </Text>
                  </View>
                  
                  <View style={[styles.progressBarBg, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) }]}>
                    <View style={[styles.progressBarFill, { backgroundColor: colors.primaryMid, width: `${coachProgress * 100}%` }]} />
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={16} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textMuted }]}>Remaining sessions for current billing cycle.</Text>
                  </View>
                </View>
              );
            })
          ) : (
              <Text style={[styles.noneText, { color: colors.textMuted }]}>No coach sessions available</Text>
          )}
        </View>

        {}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitleLabel, { color: colors.textSecondary }]}>Billing Information</Text>
        </View>
        <View style={[styles.billingCard, { backgroundColor: colors.card, shadowColor: colors.black }]}>
          <View style={styles.billingRow}>
            <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Price</Text>
            <Text style={[styles.billingValue, { color: colors.textPrimary }]}>{offer.price.toLocaleString()} DA</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05) }]} />
          <View style={styles.billingRow}>
            <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Payment Method</Text>
            <Text style={[styles.billingValue, { color: colors.textPrimary }]}>{subscription.paymentMethod === 'ONLINE' ? 'Credit Card' : 'At Club'}</Text>
          </View>
        </View>

        {}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitleLabel, { color: colors.textSecondary }]}>Manage Subscription</Text>
        </View>
        <View style={styles.actionsContainer}>
          
          <TouchableOpacity 
            style={[styles.suspendButton, { borderColor: colors.error + '40' }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.suspendButtonText, { color: colors.error }]}>Suspend Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 10,
    gap: 24,
  },
  subscriptionCard: {
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  subscriptionLabel: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 26,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 34,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    minHeight: 24,
    flexShrink: 0, 
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  renewalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIcon: {
    opacity: 0.8,
  },
  renewalText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: -12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  sectionTitleLabel: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  statsContainer: {
    gap: 16,
  },
  progressCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  progressCounter: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 20,
    flex: 1,
  },
  subSectionTitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 8,
  },
  noneText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    paddingLeft: 4,
  },
  billingCard: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  billingLabel: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  billingValue: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  suspendButton: {
    borderWidth: 1,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suspendButtonText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


