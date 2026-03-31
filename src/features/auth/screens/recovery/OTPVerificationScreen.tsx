import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import {
  NeonButton,
  AppScreen,
  Input,
  BackButton,
} from '@shared/components';
import { IllustrationPlaceholder, AuthHeader } from '@features/auth/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { authService } from '@features/auth/services/authService';
import logger from '@shared/utils/logger';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

const OTP_LENGTH = 6;
const OTP_IMAGE = require('@features/auth/assets/otp-verification-illustration.png') as number;

const otpSchema = object().shape({
  otp: string()
    .required('Verification code is required')
    .matches(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

type OTPFormValues = { otp: string };

const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { email, mode } = route.params;

  const [timer, setTimer] = useState<number>(183);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<OTPFormValues>({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: '' },
  });

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

  const onSubmit = useCallback(async (data: OTPFormValues) => {
    setLoading(true);
    setApiError(null);
    try {
      if (mode === 'register') {
        await authService.verifyEmail(email, data.otp);
        navigation.navigate(ROUTES.AUTH.SUCCESS, { type: 'register' });
      } else {
        await authService.verifyResetOtp(email, data.otp);
        navigation.navigate(ROUTES.AUTH.RESET_PASSWORD, { email });
      }
    } catch (error: unknown) {
      logger.error('OTP verification failed:', error);
      setApiError(getErrorMessage(error as { message?: string; code?: number }));
    } finally {
      setLoading(false);
    }
  }, [navigation, email, mode]);

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    setResendLoading(true);
    setApiError(null);
    try {
      await authService.forgotPassword(email);
      setTimer(180);
      reset({ otp: '' });
    } catch (error: unknown) {
      logger.error('Resend OTP failed:', error);
      setApiError(getErrorMessage(error as { message?: string; code?: number }));
    } finally {
      setResendLoading(false);
    }
  }, [email, timer, reset]);

  return (
    <AppScreen
      isLoading={loading || resendLoading}
      loadingMessage={resendLoading ? 'Resending code...' : 'Verifying...'}
      errorMessage={apiError}
      onDismissError={() => setApiError(null)}
      header={<BackButton onPress={() => navigation.goBack()} />}
      scrollable={true}
    >
      <View style={{ paddingTop: 20 }}>
        <AuthHeader
          title="Confirm Your Email"
          subtitle={`We've sent 6 digits verification code to ${email}`}
          showLogo={true}
          logoSize="large"
        />

        <IllustrationPlaceholder image={OTP_IMAGE} />

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Enter Verification Code"
                icon="mail-outline"
                value={value}
                onChangeText={(val) => onChange(val.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                caretHidden
                placeholder="Enter 6-digit code"
                error={errors.otp?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={handleResend}
            disabled={timer > 0 || resendLoading}
            style={styles.resendContainer}
          >
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
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={styles.verifyBtn}
          />
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
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
