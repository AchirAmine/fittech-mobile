import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import {
  NeonButton,
  Logo,
  Input,
  AppScreen,
  BackButton,
} from '@shared/components';
import {
  AuthHeader,
  IllustrationPlaceholder,
} from '@features/auth/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { forgotPasswordSchema } from '@shared/utils/validators';
import { authService } from '@features/auth/services/authService';
import logger from '@shared/utils/logger';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const FORGOT_PASSWORD_IMAGE = require('@features/auth/assets/forgot-password-illustration.png') as number;

  const { control, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = useCallback(async (data: { email: string }) => {
    setLoading(true);
    setApiError(null);
    try {
      await authService.forgotPassword(data.email);
      navigation.navigate(ROUTES.AUTH.OTP_VERIFICATION, { email: data.email, mode: 'reset' });
    } catch (error: unknown) {
      const apiErr = error as { message?: string; code?: number };
      logger.error('Forgot password failed:', error);
      setApiError(getErrorMessage(apiErr));
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  return (
    <AppScreen
      isLoading={loading}
      loadingMessage="Sending verification code..."
      errorMessage={apiError}
      onDismissError={() => setApiError(null)}
      header={<BackButton onPress={() => navigation.goBack()} />}
      scrollable={true}
    >
      <View style={{ paddingTop: 20 }}>
        <View style={styles.headerRow}>
          <View style={styles.logoCenter}>
            <Logo size="large" color={colors.primary} />
          </View>
        </View>

        <AuthHeader
          title="Forgot your password ?"
          subtitle={`Enter your email address below${'\n'}and we'll send you a code to give back`}
        />

        <IllustrationPlaceholder image={FORGOT_PASSWORD_IMAGE} />

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter Email Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <NeonButton
            title={loading ? 'Sending...' : 'Send Verification Code'}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={styles.submitBtn}
          />
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCenter: {
    flex: 1,
    alignItems: 'center',
  },
  form: { gap: 16 },
  submitBtn: {
    marginTop: 12,
    borderRadius: Theme.Radius.lg,
    height: 56,
  },
});

export default memo(ForgotPasswordScreen);
