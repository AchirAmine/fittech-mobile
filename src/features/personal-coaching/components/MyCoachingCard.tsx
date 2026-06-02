import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Coach } from '../hooks/useCoaching';

export type PersonalCoachingHomeState =
  | 'NO_COACHING'
  | 'INVITATION_PENDING'
  | 'ACCEPTED_NOT_PAID'
  | 'PAYMENT_PENDING'
  | 'ACTIVE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'ENDED';

interface MyCoachingCardProps {
  coach: Coach;
  planTitle: string;
  state: PersonalCoachingHomeState;
  onPress: () => void;
  onDashboardPress: () => void;
  onChatPress?: () => void;
}

function getStateConfig(state: PersonalCoachingHomeState, colors: any, isDark: boolean) {
  switch (state) {
    case 'ACTIVE':
      return {
        badgeLabel: 'ACTIVE',
        badgeColor: colors.success,
        badgeTextColor: '#FFFFFF',
        borderColor: colors.primaryMid,
        headerAction: null,
        headerActionIcon: 'grid-outline' as const,
        headerActionColor: colors.primaryMid,
        showChat: true,
      };
    case 'INVITATION_PENDING':
      return {
        badgeLabel: 'PENDING',
        badgeColor: colors.primaryMid,
        badgeTextColor: '#FFFFFF',
        borderColor: colors.primaryMid,
        headerAction: null,
        headerActionIcon: 'mail-outline' as const,
        headerActionColor: colors.primaryMid,
        showChat: false,
      };
    case 'ACCEPTED_NOT_PAID':
      return {
        badgeLabel: 'PAYMENT REQUIRED',
        badgeColor: colors.primaryMid,
        badgeTextColor: '#FFFFFF',
        borderColor: colors.primaryMid,
        headerAction: null,
        headerActionIcon: 'card-outline' as const,
        headerActionColor: colors.primaryMid,
        showChat: false,
      };
    case 'PAYMENT_PENDING':
      return {
        badgeLabel: 'PAYMENT REVIEW',
        badgeColor: colors.warning,
        badgeTextColor: '#FFFFFF',
        borderColor: colors.warning,
        headerAction: null,
        headerActionIcon: 'time-outline' as const,
        headerActionColor: colors.warning,
        showChat: false,
      };
    default:
      return {
        badgeLabel: 'INACTIVE',
        badgeColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        badgeTextColor: colors.textSecondary,
        borderColor: colors.border,
        headerAction: 'View',
        headerActionIcon: 'arrow-forward' as const,
        headerActionColor: colors.textSecondary,
        showChat: false,
      };
  }
}

export const MyCoachingCard = ({ coach, planTitle, state, onPress, onDashboardPress, onChatPress }: MyCoachingCardProps) => {
  const { colors, isDark } = useTheme();
  const config = getStateConfig(state, colors, isDark);

  return (
    <View style={styles.outerContainer}>
      {config.headerAction && (
        <View style={styles.headerRow}>
          <View />
          <TouchableOpacity style={styles.headerActionBtn} onPress={onDashboardPress} activeOpacity={0.7}>
            <Ionicons name={config.headerActionIcon} size={14} color={config.headerActionColor} />
            <Text style={[styles.headerActionText, { color: config.headerActionColor }]}>
              {config.headerAction}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            borderWidth: state === 'INVITATION_PENDING' || state === 'ACCEPTED_NOT_PAID' || state === 'PAYMENT_PENDING' ? 1.5 : 0,
            borderColor: state === 'INVITATION_PENDING' || state === 'ACCEPTED_NOT_PAID' || state === 'PAYMENT_PENDING' ? hexToRGBA(config.borderColor, 0.4) : 'transparent',
          }
        ]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        {(state === 'INVITATION_PENDING' || state === 'ACCEPTED_NOT_PAID' || state === 'PAYMENT_PENDING') && (
          <View style={[styles.urgentBanner, { backgroundColor: hexToRGBA(config.badgeColor, isDark ? 0.15 : 0.08) }]}>
            <Ionicons
              name={state === 'INVITATION_PENDING' ? 'time-outline' : state === 'PAYMENT_PENDING' ? 'hourglass-outline' : 'alert-circle-outline'}
              size={14}
              color={config.badgeColor}
            />
            <Text style={[styles.urgentBannerText, { color: config.badgeColor }]}>
              {state === 'INVITATION_PENDING'
                ? 'You have a pending coaching invitation'
                : state === 'PAYMENT_PENDING'
                  ? 'Your cash payment is awaiting admin approval'
                  : 'Complete payment to activate your coaching'}
            </Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={[styles.avatarWrapper, { borderColor: config.borderColor }]}>
            {coach.image ? (
              <Image source={coach.image} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: hexToRGBA(config.borderColor, 0.15) }]}>
                <Ionicons name="person" size={28} color={config.borderColor} />
              </View>
            )}
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.coachName, { color: colors.textPrimary }]} numberOfLines={1}>
              {coach.name.toUpperCase()}
            </Text>
            <View style={styles.stateRow}>
              <View style={[styles.stateBadge, { backgroundColor: hexToRGBA(config.badgeColor, isDark ? 0.2 : 0.12) }]}>
                <Text style={[styles.stateBadgeText, { color: config.badgeColor }]}>
                  {config.badgeLabel}
                </Text>
              </View>
            </View>
            <Text style={[styles.planTitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {planTitle}
            </Text>
          </View>

          {config.showChat && (
            <TouchableOpacity
              style={[styles.chatBtn, { backgroundColor: isDark ? hexToRGBA(colors.primaryMid, 0.2) : hexToRGBA(colors.primaryMid, 0.1) }]}
              onPress={onChatPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.primaryMid} />
            </TouchableOpacity>
          )}

          {!config.showChat && (state === 'INVITATION_PENDING' || state === 'ACCEPTED_NOT_PAID') && (
            <View style={[styles.arrowBtn, { backgroundColor: hexToRGBA(config.badgeColor, isDark ? 0.2 : 0.1) }]}>
              <Ionicons name="chevron-forward" size={20} color={config.badgeColor} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerActionText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  cardContainer: {
    borderRadius: 24,
    padding: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  urgentBannerText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  coachName: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.4,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stateBadgeText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  chatBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
