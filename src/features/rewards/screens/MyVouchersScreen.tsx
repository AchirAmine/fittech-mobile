import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen, Loader } from '@shared/components';
import { Theme } from '@shared/constants/theme';
import { useMyCodes } from '../hooks/useRewards';
import { RewardItem } from '../components/RewardItem';
import { RewardsEmptyState } from '../components/RewardsEmptyState';
export const MyVouchersScreen = () => {
  const { colors } = useTheme();
  const { data: myCodes, isLoading } = useMyCodes();
  if (isLoading) {
    return <Loader />;
  }
  const ownedVouchers = myCodes?.map(c => ({
    ...c,
    promoOffer: { 
      name: c.offer.name, 
      starsRequired: 0, 
      endDate: c.offer.endDate,
      discountPercentage: c.offer.discountPercentage 
    }
  })) || [];
  return (
    <AppScreen safeArea={false} backgroundColor={colors.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>My Promo Codes</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Copy your code and apply it during payment to get your discount.
        </Text>
        <View style={styles.listContainer}>
          {ownedVouchers.length === 0 ? (
            <RewardsEmptyState 
              icon="ticket-outline"
              title="No Codes Yet"
              subtitle="Redeem your stars for offers in the rewards store to see them here."
            />
          ) : (
            ownedVouchers.map(item => (
              <RewardItem key={item.id} item={item as any} type="redeemed" />
            ))
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </AppScreen>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 20,
   },
  title: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 20,
    marginBottom: 24,
  },
  listContainer: {
    flex: 1,
  },
});
