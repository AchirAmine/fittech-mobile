import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen } from '@shared/components';
import { NeonButton } from '@shared/components/ui/NeonButton';
import { Input } from '@shared/components/ui/Input';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { PaymentPlanHeader } from '../components/PaymentPlanHeader';
import { PaymentMethods, PaymentMethod } from '../components/PaymentMethods';
import { PaymentSummary } from '../components/PaymentSummary';
import { useSubscribe } from '@features/membership/hooks/useMembership';
import { useHireCoach } from '@features/personal-coaching/hooks/useCoaching';
import { ROUTES } from '@navigation/routes';

type RouteParams = {
  plan: any;
};

type ModalState = {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onConfirm: () => void;
};

export const PaymentDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const { mutate: subscribe, isPending: isSubscribing } = useSubscribe();
  const { mutate: hireCoach, isPending: isHiring } = useHireCoach();

  const { plan } = (route.params as RouteParams) || {};
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
  const [promoCode, setPromoCode] = useState('');
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    type: 'success',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showModal = (
    type: 'success' | 'error',
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setModal({ visible: true, type, title, message, onConfirm });
  };

  const hideModal = () => setModal((prev) => ({ ...prev, visible: false }));

  if (!plan) {
    return (
      <AppScreen errorMessage="Plan data is missing">
        <View style={styles.errorContainer}>
          <Text style={{ color: colors.textPrimary }}>Unable to load payment details.</Text>
        </View>
      </AppScreen>
    );
  }

  const isPending = isSubscribing || isHiring;

  const handleConfirmPay = () => {
    const backendMethod = selectedMethod === 'credit_card' ? 'ONLINE' : 'AT_CLUB';

    if (plan.type === 'coaching') {
      hireCoach(plan.id, {
        onSuccess: async (data: any) => {
          if (backendMethod === 'ONLINE' && data?.checkoutUrl) {
            const result = await WebBrowser.openAuthSessionAsync(
              data.checkoutUrl,
              'fittech://payment'
            );
            if (result.type === 'success') {
              showModal(
                'success',
                'Payment Done!',
                'Your coaching session is being activated. Please wait a moment.',
                () => { hideModal(); navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD); }
              );
            } else {
              showModal(
                'error',
                'Payment Incomplete',
                'You closed the payment page before finishing. If you already paid, your session will activate shortly.',
                hideModal
              );
            }
          } else {
            showModal(
              'success',
              'Session Booked!',
              'Your personal training session has been booked successfully.',
              () => { hideModal(); navigation.navigate(ROUTES.MAIN.MY_COACHING_DASHBOARD); }
            );
          }
        },
        onError: (err: any) => {
          showModal(
            'error',
            'Booking Failed',
            err.response?.data?.message || err.message || 'Failed to book session. Please try again.',
            hideModal
          );
        }
      });
      return;
    }

    subscribe(
      { offerId: plan.id, paymentMethod: backendMethod },
      {
        onSuccess: async (data) => {
          if (backendMethod === 'ONLINE' && data.checkoutUrl) {
            const result = await WebBrowser.openAuthSessionAsync(
              data.checkoutUrl,
              'fittech://payment'
            );
            if (result.type === 'success') {
              showModal(
                'success',
                'Payment Done!',
                'Your subscription is being activated. It will be ready in a moment.',
                () => { hideModal(); navigation.navigate(ROUTES.MAIN.MEMBERSHIP); }
              );
            } else if (result.type === 'cancel' || result.type === 'dismiss') {
              showModal(
                'error',
                'Payment Incomplete',
                'You closed the payment page before finishing. If you already paid, your subscription will activate shortly.',
                hideModal
              );
            }
          } else {
            showModal(
              'success',
              'Subscription Pending',
              'Please visit the front desk to complete your payment and activate your plan.',
              () => { hideModal(); navigation.navigate(ROUTES.MAIN.MEMBERSHIP); }
            );
          }
        },
        onError: (err: any) => {
          showModal(
            'error',
            'Payment Failed',
            err.response?.data?.message || err.message || 'Failed to create subscription. Please try again.',
            hideModal
          );
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

      <StatusModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={hideModal}
        confirmText="OK"
      />
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
