import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen } from '@shared/components';
import { NeonButton } from '@shared/components/ui/NeonButton';
import { Input } from '@shared/components/ui/Input';
import { SubscriptionPlan } from '@appTypes/index';
import { PaymentPlanHeader } from '../components/PaymentPlanHeader';
import { PaymentMethods, PaymentMethod } from '../components/PaymentMethods';
import { PaymentSummary } from '../components/PaymentSummary';
import { useSubscribe } from '../hooks/useMembership';
import { ROUTES } from '@navigation/routes';
import { Alert } from 'react-native';

type RouteParams = {
  plan: SubscriptionPlan;
};

export const PaymentDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { mutate: subscribe, isPending } = useSubscribe();
  
  const { plan } = (route.params as RouteParams) || {};
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
  const [promoCode, setPromoCode] = useState('');

  if (!plan) {
    return (
      <AppScreen errorMessage="Plan data is missing">
        <View style={styles.errorContainer}>
          <Text style={{ color: colors.textPrimary }}>Unable to load payment details.</Text>
        </View>
      </AppScreen>
    );
  }

  const handleConfirmPay = () => {
    const backendMethod = selectedMethod === 'credit_card' ? 'ONLINE' : 'AT_CLUB';
    
    subscribe(
      { offerId: plan.id, paymentMethod: backendMethod },
      {
        onSuccess: (data) => {
          if (backendMethod === 'ONLINE' && data.clientSecret) {
            Alert.alert('Online Payment', 'Stripe integration would happen here. Subscription created!');
            navigation.navigate(ROUTES.MAIN.MEMBERSHIP);
          } else {
            Alert.alert(
              'Subscription Pending', 
              'Please visit the front desk to complete your payment and activate your plan.',
              [{ text: 'OK', onPress: () => navigation.navigate(ROUTES.MAIN.MEMBERSHIP) }]
            );
          }
        },
        onError: (err: any) => {
          Alert.alert('Error', err.message || 'Failed to create subscription');
        }
      }
    );
  };

  return (
    <AppScreen
      scrollable={true}
      errorMessage={null}
      backgroundColor={colors.background}
    >
      <PaymentPlanHeader plan={plan} />
      <PaymentMethods selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />
      
      <Input
        label="Enter Promo Code"
        value={promoCode}
        onChangeText={setPromoCode}
        icon="pricetag-outline"
        rightText="APPLY"
        onRightTextPress={() => {}}
        containerStyle={styles.promoInputContainer}
        labelBg={colors.background}
      />

      <PaymentSummary plan={plan} />

      <View style={styles.footerContainer}>
        <Text style={[styles.termsText, { color: colors.textMuted }]}>
          By confirming, you agree to our{' '}
          <Text style={{ color: colors.primaryMid }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: colors.primaryMid }}>Privacy Policy</Text>. Your subscription activates immediately.
        </Text>
        <NeonButton
          title="CONFIRM & PAY"
          onPress={handleConfirmPay}
          loading={isPending}
          disabled={isPending}
          style={[styles.confirmButton, { backgroundColor: colors.primaryMid, shadowColor: colors.black }]}
          content={
            <View style={styles.buttonPriceContainer}>
              <Text style={[styles.buttonPriceText, { color: colors.white }]}>
                {plan.price.toLocaleString()} {plan.currency}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} />
            </View>
          }
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: 10,
    paddingBottom: 30,
  },
  termsText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 20,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  confirmButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  promoInputContainer: {
    marginBottom: 24,
  },
  confirmButtonText: {
    // Removed because we rely on NeonButton's internal text style now
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonPriceText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
