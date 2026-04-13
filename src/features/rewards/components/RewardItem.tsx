import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Reward, Voucher } from '../types/rewards.types';

interface RewardItemProps {
  item: Reward | Voucher;
  type: 'locked' | 'unlocked' | 'redeemed';
  onPress?: () => void;
}

export const RewardItem: React.FC<RewardItemProps> = ({ item, type, onPress }) => {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);

  const isVoucher = type === 'redeemed';
  const reward = item as Reward;
  const voucher = item as Voucher;

  const handleCopy = async () => {
    if (!isVoucher) return;
    await Clipboard.setStringAsync(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onPress) onPress();
  };

  const validUntil = (reward.endDate || voucher.promoOffer?.endDate) 
    ? new Date(reward.endDate || voucher.promoOffer?.endDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'N/A';
  const title = isVoucher ? (voucher.promoOffer?.name || 'Promo Code') : reward.name;
  const starsRequired = isVoucher ? (voucher.promoOffer?.starsRequired || 0) : reward.starsRequired;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <LinearGradient
        colors={[colors.primaryLight, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardHeader}
      >
        <Text style={[styles.discountText, { color: colors.white }]}>
          {title}
        </Text>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <View style={[styles.promoBadge, { backgroundColor: colors.cardSecondary }]}>
            <Text style={[styles.promoText, { color: colors.primary }]}>
              {isVoucher ? voucher.code : 'REWARD'}
            </Text>
          </View>
          <View style={styles.validityContainer}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.validityLabel, { color: colors.textSecondary }]}>
              EXPIRES: {validUntil}
            </Text>
          </View>
        </View>

        <View style={styles.requirementRow}>
          <Ionicons name="star" size={22} color={colors.textSecondary} />
          {type === 'locked' ? (
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              Required: {starsRequired} Stars
            </Text>
          ) : (
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
              {starsRequired} Stars redeemed
            </Text>
          )}
        </View>

        {type === 'redeemed' ? (
          <View style={[styles.redeemedContainer, { borderColor: colors.primary, backgroundColor: hexToRGBA(colors.primary, 0.05) }]}>
            <Text style={[styles.buttonText, { color: colors.primary, flex: 1 }]}>
              Code: {voucher.code}
            </Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyIconBtn}>
              <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              type === 'locked' && { backgroundColor: colors.cardSecondary, elevation: 0, shadowOpacity: 0 },
            ]}
            disabled={type === 'locked'}
            onPress={onPress}
            activeOpacity={0.8}
          >
            {type === 'locked' ? (
              <Text style={[styles.buttonText, { color: colors.textMuted }]}>
                Not Enough Stars
              </Text>
            ) : (
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Redeem for {starsRequired} stars
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 28,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  infoContainer: {
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  promoText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  validityContainer: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  validityLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  button: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  redeemedContainer: {
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  copyIconBtn: {
    padding: 8,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});


