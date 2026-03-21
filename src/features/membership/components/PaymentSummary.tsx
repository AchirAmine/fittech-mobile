import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { SubscriptionPlan } from '@appTypes/index';

interface PaymentSummaryProps {
  plan: SubscriptionPlan;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ plan }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[
      styles.summaryCard,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      }
    ]}>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
        <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
          {plan.price.toLocaleString()} {plan.currency}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Promo Code</Text>
        <Text style={[styles.summaryValue, { color: colors.success }]}>0%</Text>
      </View>
      
      <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
      
      <View style={styles.summaryTotalRow}>
        <Text style={[styles.summaryTotalLabel, { color: colors.textPrimary }]}>
          TOTAL AMOUNT
        </Text>
        <Text style={[styles.summaryTotalValue, { color: colors.primaryMid }]}>
          {plan.price.toLocaleString()} {plan.currency}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 14,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
