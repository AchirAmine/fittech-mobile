import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { StarTransaction } from '../types/rewards.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface HistoryItemProps {
  transaction: StarTransaction;
}
export const HistoryItem: React.FC<HistoryItemProps> = ({ transaction }) => {
  const { colors } = useTheme();
  const isEarned = transaction.changeAmount > 0;
  const timeStr = new Date(transaction.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const getTitle = () => {
    switch (transaction.reason) {
      case 'PLAN_PURCHASE':
        return 'Purchased plan';
      case 'PROMO_REDEMPTION':
        return 'Promo redemption';
      case 'STAR_EXPIRY':
        return 'Stars expired';
      default:
        return 'Promo redemption';
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isEarned ? hexToRGBA(colors.primary, 0.1) : hexToRGBA(colors.error, 0.1) }
      ]}>
        <MaterialCommunityIcons 
          name={isEarned ? 'dumbbell' : 'shopping'} 
          size={24} 
          color={isEarned ? colors.primary : colors.error} 
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textPrimary }]}>
          {getTitle()}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          • {timeStr}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[
          styles.points, 
          { 
            color: isEarned ? colors.success : colors.error,
            fontSize: 16
          }
        ]}>
          {isEarned ? '+' : ''}{transaction.changeAmount}
        </Text>
        <Text style={[styles.balanceAfter, { color: colors.textSecondary }]}>
          Bal: {transaction.balanceAfter.toLocaleString()}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  date: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginTop: 4,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  balanceAfter: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginTop: 4,
  },
});
