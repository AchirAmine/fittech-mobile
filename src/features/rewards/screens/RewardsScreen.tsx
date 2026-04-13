import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen, Loader } from '@shared/components';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useRewards, useRewardHistory, useRedeemReward } from '../hooks/useRewards';
import { PointsBadge } from '../components/PointsBadge';
import { RewardsTabSelector, RewardTab } from '../components/RewardsTabSelector';
import { RewardItem } from '../components/RewardItem';
import { HistoryItem } from '../components/HistoryItem';
import { RewardsEmptyState } from '../components/RewardsEmptyState';
import { RedeemConfirmModal } from '../components/RedeemConfirmModal';

export const RewardsScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<RewardTab>('unlocked');
  const [selectedReward, setSelectedReward] = useState<{ id: string; name: string; stars: number; endDate?: string } | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const { data, isLoading } = useRewards();
  const { data: historyData, isLoading: isHistoryLoading } = useRewardHistory();
  const { mutate: redeem, isPending: isRedeeming } = useRedeemReward();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <PointsBadge onPress={() => setActiveTab('history')} />,
    });
  }, [navigation]);

  if (isLoading || (activeTab === 'history' && isHistoryLoading)) {
    return <Loader />;
  }

  const balance = data?.starBalance || 0;
  const lockedRewards = data?.offers.filter(r => !r.canRedeem) || [];
  const unlockedRewards = data?.offers.filter(r => r.canRedeem) || [];
  const ownedVouchers = data?.offers.filter(r => r.hasRedeemed && r.promoCode).map(r => ({
    ...r.promoCode!,
    promoOffer: { name: r.name, starsRequired: r.starsRequired, endDate: r.endDate }
  })) || [];
  
  const transactions = historyData || [];

  const groupTransactionsByDate = (transactions: any[]) => {
    const groups: { [key: string]: any[] } = {};
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    transactions.forEach(tx => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      let label = date;
      if (date === today) label = 'TODAY';
      else if (date === yesterday) label = 'YESTERDAY';
      else label = new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
      
      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
    });
    return groups;
  };

  const handleRedeemPress = (rewardId: string, name: string, stars: number, endDate?: string) => {
    setRedeemedCode(null);
    setRedeemError(null);
    setSelectedReward({ id: rewardId, name, stars, endDate });
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    
    redeem(selectedReward.id, {
      onSuccess: (data) => {
        setRedeemedCode(data.code);
      },
      onError: (error: any) => {
        setRedeemError(error.message || 'Failed to redeem reward.');
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'unlocked':
        return (
          <View>
            {unlockedRewards.length === 0 ? (
              <RewardsEmptyState 
                icon="lock-open-outline"
                title="No Unlocked Offers Yet"
                subtitle="You don't have enough stars to unlock any offers right now."
              />
            ) : (
              unlockedRewards.map(item => (
                <RewardItem 
                  key={item.id} 
                  item={item as any} 
                  type="unlocked" 
                  onPress={() => handleRedeemPress(item.id, item.name, item.starsRequired, item.endDate)}
                />
              ))
            )}
          </View>
        );
      case 'locked':
        return (
          <View>
            {lockedRewards.length === 0 ? (
              <RewardsEmptyState 
                icon="gift-outline"
                title="No Promo Codes Available Yet"
                subtitle="There are currently no locked offers in the system."
              />
            ) : (
              lockedRewards.map(item => (
                <RewardItem key={item.id} item={item as any} type="locked" />
              ))
            )}
          </View>
        );
      case 'vouchers':
        return (
          <View>
            {ownedVouchers.length === 0 ? (
              <RewardsEmptyState 
                icon="ticket-outline"
                title="No Codes Yet"
                subtitle="Redeem your stars for offers to see them here."
              />
            ) : (
              ownedVouchers.map(item => (
                <RewardItem key={item.id} item={item as any} type="redeemed" />
              ))
            )}
          </View>
        );
      case 'history':
        const grouped = groupTransactionsByDate(transactions);
        return (
          <View>
            {transactions.length === 0 ? (
              <RewardsEmptyState 
                icon="bar-chart-outline"
                title="No Transaction History"
                subtitle="You haven't earned or spent any stars yet."
              />
            ) : (
              Object.keys(grouped).map(dateLabel => (
                <View key={dateLabel}>
                  <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{dateLabel}</Text>
                  {grouped[dateLabel].map(item => (
                    <HistoryItem key={item.id} transaction={item} />
                  ))}
                </View>
              ))
            )}
          </View>
        );
    }
  };

  return (
    <AppScreen safeArea={false} backgroundColor={colors.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        {activeTab === 'history' ? (
          <TouchableOpacity 
            style={[styles.backToRewards, { backgroundColor: colors.cardSecondary }]}
            onPress={() => setActiveTab('unlocked')}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={[styles.backText, { color: colors.primary }]}>Back to Rewards</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.historyCard, { backgroundColor: colors.card }]}
              onPress={() => setActiveTab('history')}
              activeOpacity={0.8}
            >
              <View style={[styles.historyIconContainer, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
                <Ionicons name="time" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.historyCardText, { color: colors.textPrimary }]}>
                Transaction History
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <RewardsTabSelector activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}

        {renderContent()}
        <View style={{ height: 40 }} />
      </ScrollView>

      <RedeemConfirmModal 
        visible={!!selectedReward}
        onClose={() => setSelectedReward(null)}
        rewardName={selectedReward?.name || ''}
        starsRequired={selectedReward?.stars || 0}
        currentBalance={balance}
        onRedeem={handleConfirmRedeem}
        isLoading={isRedeeming}
        promoCode={redeemedCode || undefined}
        error={redeemError}
        expiryDate={selectedReward?.endDate}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({

  sectionHeader: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 15,
    letterSpacing: 1,
  },
  backToRewards: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  backText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    paddingRight: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyCardText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
