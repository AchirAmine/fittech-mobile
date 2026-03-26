import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { AppScreen } from '@shared/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES } from '@navigation/routes';
import { PlanCard } from '../components/PlanCard';
import { SubscriptionConfirmationModal } from '../components/SubscriptionConfirmationModal';
import { useGetOffers } from '../hooks/useMembership';
import { SubscriptionPlan } from '@appTypes/index';
import { transformOffer } from '../utils/subscriptionUtils';

const TABS = ['All Plans', 'Monthly', 'Annual'] as const;
type TabType = typeof TABS[number];

export const SubscriptionScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data: offers, isLoading, isError, error } = useGetOffers();
  const [activeTab, setActiveTab] = useState<TabType>('All Plans');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const transformedPlans = useMemo(() => {
    return (offers || []).map(transformOffer);
  }, [offers]);

  const filteredPlans = useMemo(() => {
    return transformedPlans.filter(plan => {
      if (activeTab === 'All Plans') return true;
      if (activeTab === 'Monthly') return plan.billingCycle === 'monthly';
      return plan.billingCycle === 'annual';
    });
  }, [transformedPlans, activeTab]);

  const handleTabPress = (tab: TabType, index: number) => {
    setActiveTab(tab);
    Animated.spring(indicatorAnim, {
      toValue: index,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  };

  const handleJoinPress = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalVisible(true);
  };

  const handleConfirmJoin = () => {
    setIsModalVisible(false);
    if (selectedPlan) {
      // Use requestAnimationFrame to ensure modal starts closing before navigation
      requestAnimationFrame(() => {
        navigation.navigate(ROUTES.MAIN.PAYMENT_DETAILS as any, { plan: selectedPlan });
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[styles.statusChip, { backgroundColor: isDark ? hexToRGBA(colors.primaryMid, 0.1) : hexToRGBA(colors.primaryMid, 0.05) }]}>
          <View style={[styles.statusDot, { backgroundColor: colors.primaryMid }]} />
          <Text style={[styles.statusText, { color: colors.primaryMid }]}>{filteredPlans.length} PLANS</Text>
        </View>
      ),
    });
  }, [navigation, filteredPlans.length, isDark, colors]);

  return (
    <AppScreen 
      errorMessage={isError ? (error as any)?.message || 'Failed to load plans' : null} 
      isLoading={isLoading}
    >
      {/* Header Block */}
      <View style={styles.headerBlock}>
        <Text style={[styles.headline, { color: colors.textPrimary }]}>
          Choose Your Plan
        </Text>
        <Text style={[styles.subheadline, { color: colors.textSecondary }]}>
          Flexible options for every fitness goal
        </Text>
      </View>

      {/* Tabs with animated pill indicator */}
      <View style={[styles.tabsWrapper, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
        {/* Animated Pill */}
        <Animated.View
          style={[
            styles.tabPill,
            {
              backgroundColor: colors.primary,
              left: indicatorAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: ['0.66%', '34%', '67.33%'],
              }),
              width: '32%',
            },
          ]}
        />
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab, index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.white : colors.textSecondary },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Plans List */}
      <View style={styles.plansList}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              colors={colors}
              isDark={isDark}
              index={index}
              onPress={() => handleJoinPress(plan)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.cardSecondary }]}>
              <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No plans available</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Check back soon for new subscription options.
            </Text>
          </View>
        )}
      </View>

      <SubscriptionConfirmationModal
        visible={isModalVisible}
        plan={selectedPlan}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmJoin}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  headerBlock: {
    paddingHorizontal: 4,
    marginBottom: 24,
    marginTop: 4,
  },
  headline: {
    fontSize: 26,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  subheadline: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  tabsWrapper: {
    flexDirection: 'row',
    marginHorizontal: 0,
    marginBottom: 28,
    borderRadius: 14,
    padding: 4,
    position: 'relative',
    height: 46,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tabPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 10,
    zIndex: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
  plansList: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
