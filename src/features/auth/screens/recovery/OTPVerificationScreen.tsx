import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import {
  NeonButton,
  BackButton,
  AppScreen,
  Input,
  LoadingOverlay,
  ErrorBanner,
} from '@shared/components';
import { AuthBottomSheet, IllustrationPlaceholder, AuthHeader } from '@features/auth/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { authService } from '@features/auth/services/authService';
import logger from '@shared/utils/logger';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

const OTP_LENGTH = 6;
const OTP_IMAGE = require('@features/auth/assets/otp-verification-illustration.png') as number;

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { email, mode } = route.params;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState<number>(183);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerify = useCallback(async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) return;

    setLoading(true);
    setApiError(null);
    try {
      if (mode === 'register') {
        await authService.verifyEmail(email, otpString);
        navigation.navigate(ROUTES.AUTH.SUCCESS, { type: 'register' });
      } else {
        // Verify OTP for password recovery
        await authService.verifyResetOtp(email, otpString);
        navigation.navigate(ROUTES.AUTH.RESET_PASSWORD, { email });
      }
    } catch (error: unknown) {
      logger.error('OTP verification failed:', error);
      setApiError(getErrorMessage(error as { message?: string; code?: number }));
    } finally {
      setLoading(false);
    }
  }, [navigation, email, otp, mode]);

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    setResendLoading(true);
    setApiError(null);
    try {
      // Assuming you have a resendEmail verification or using forgotPassword logic to trigger resend
      // You should adjust if your authService has a specific resendVerification method
      await authService.forgotPassword(email); 
      setTimer(180);
      setOtp(Array(OTP_LENGTH).fill(''));
    } catch (error: unknown) {
      logger.error('Resend OTP failed:', error);
      setApiError(getErrorMessage(error as { message?: string; code?: number }));
    } finally {
      setResendLoading(false);
    }
  }, [email, timer]);

  const isComplete = otp.every((d) => d !== '');
  const otpStringValue = otp.join('');

  return (
    <View style={styles.wrapper}>
      <ErrorBanner message={apiError} onDismiss={() => setApiError(null)} />
      <LoadingOverlay visible={loading || resendLoading} message={resendLoading ? 'Resending code...' : 'Verifying...'} />

      <AuthBottomSheet variant="modal" onDismiss={() => navigation.goBack()}>
        <AuthHeader
          title="Confirm Your Email"
          subtitle={`We’ve sent 6 digits verification code to ${email}`}
          showLogo={true}
          logoSize="large"        />

        <IllustrationPlaceholder image={OTP_IMAGE} />

        <View style={styles.formContainer}>
          <Input
            label="Enter Verification Code"
            icon="mail-outline"
            value={otpStringValue}
            onChangeText={(val) => {
              const cleaned = val.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
              const newOtp = Array(OTP_LENGTH).fill('');
              for (let i = 0; i < cleaned.length; i++) {
                newOtp[i] = cleaned[i];
              }
              setOtp(newOtp);
            }}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            caretHidden
            placeholder="Enter 6-digit code"
          />

          <TouchableOpacity onPress={handleResend} disabled={timer > 0 || resendLoading} style={styles.resendContainer}>
            <Text
              style={[
                styles.resendLink,
                { color: timer > 0 ? colors.textMuted : colors.primary },
              ]}
            >
              {resendLoading ? 'Sending...' : timer > 0 ? `Resend in ${formatTimer(timer)}` : 'Resend'}
            </Text>
          </TouchableOpacity>

          <NeonButton
            title={loading ? 'Verifying...' : 'Verify code'}
            onPress={handleVerify}
            disabled={loading || !isComplete}
            style={styles.verifyBtn}
          />
        </View>
      </AuthBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  formContainer: { gap: 0 },
  resendContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  resendLink: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 13,
  },
  verifyBtn: {
    marginTop: 24,
    borderRadius: Theme.Radius.lg,
    height: 56,
  },
});

export default memo(OTPVerificationScreen);
