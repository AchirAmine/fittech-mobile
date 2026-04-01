import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useTheme } from '@shared/hooks/useTheme';
import { SubscriptionPlan } from '@appTypes/index';
import { PlanFeaturesList } from '@features/membership/components/PlanFeaturesList';

interface PaymentPlanHeaderProps {
  plan: SubscriptionPlan;
}

export const PaymentPlanHeader: React.FC<PaymentPlanHeaderProps> = ({ plan }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.planCard, { shadowColor: colors.black }]}>
      <Image
        source={typeof plan.image === 'string' ? { uri: plan.image } : plan.image}
        style={styles.planImage}
      />
      <LinearGradient
        colors={[hexToRGBA(colors.primaryDark, 0.4), colors.primaryDark]}
        style={styles.planGradient}
      >
        <View style={styles.planCardHeaderRow}>
          <Text style={[styles.planTitle, { color: colors.white }]} numberOfLines={2}>
            {plan.title.toUpperCase()}
          </Text>
          <Text style={[styles.planPrice, { color: colors.white }]}>
            {plan.price.toLocaleString()} {plan.currency}
          </Text>
        </View>

        <PlanFeaturesList features={plan.features} alignment="start" forceDarkText={true} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  planCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  planImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  planGradient: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'center',
    paddingTop: 30,
  },
  planCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  planTitle: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    flex: 1,
    paddingRight: 10,
    lineHeight: 28,
  },
  planPrice: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
