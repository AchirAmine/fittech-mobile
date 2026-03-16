import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import {
  NeonButton,
  Input,
  BackButton,
  AppScreen,
} from '@shared/components';
import {
  PasswordStrengthIndicator,
  AuthBottomSheet,
  IllustrationPlaceholder,
  AuthHeader,
} from '@features/auth/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { resetPasswordSchema } from '@shared/utils/validators';
import { authService } from '@features/auth/services/authService';
import logger from '@shared/utils/logger';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { email } = route.params;
  const [showPass, setShowPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const RESET_PASSWORD_IMAGE = require('@features/auth/assets/reset-password-illustration.png') as number;

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password', '');

  const onSubmit = useCallback(async (data: { password: string; confirmPassword: string }) => {
    setLoading(true);
    setApiError(null);
    try {
      await authService.resetPassword(email, data.password);
      navigation.navigate(ROUTES.AUTH.SUCCESS, { 
        type: 'login',
        title: 'Password Reset Successful',
        subtitle: 'Your password has been updated successfully.\nYou can now login with your new password.'
      });
    } catch (error: unknown) {
      const apiErr = error as { message?: string; code?: number };
      logger.error('Reset password failed:', error);
      setApiError(getErrorMessage(apiErr));
    } finally {
      setLoading(false);
    }
  }, [navigation, email]);

  const toggleShowPass = useCallback(() => {
    setShowPass((prev) => !prev);
  }, []);

  return (
    <AppScreen
      isLoading={loading}
      loadingMessage="Resetting password..."
      errorMessage={apiError}
      onDismissError={() => setApiError(null)}
      backgroundColor="transparent"
      scrollable={false}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <AuthBottomSheet variant="modal" onDismiss={() => navigation.goBack()}>

        <AuthHeader
          title="Set a new password!"
          showLogo={true}
          logoSize="large" 
        />

        <IllustrationPlaceholder image={RESET_PASSWORD_IMAGE} />

        <View style={styles.form}>
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  icon="lock-closed-outline"
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPass}
                  rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
                  onRightIconPress={toggleShowPass}
                  error={errors.password?.message}
                />
              )}
            />
            <PasswordStrengthIndicator password={password} />
          </View>

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Re Type Password"
                icon="lock-closed-outline"
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPass}
                rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
                onRightIconPress={toggleShowPass}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <NeonButton
            title={loading ? 'Resetting...' : 'Set New Password'}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={styles.submitBtn}
          />
        </View>
      </AuthBottomSheet>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  form: { gap: 20 },
  submitBtn: {
    marginTop: 16,
    borderRadius: Theme.Radius.lg,
    height: 56,
  },
});

export default memo(ResetPasswordScreen);
