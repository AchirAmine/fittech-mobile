import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';
import * as yup from 'yup';
import { useTheme } from '@shared/hooks/useTheme';
import { Input, NeonButton } from '@shared/components/ui';
import { useChangePassword } from '@features/settings/hooks/useSettings';
import { AppScreen } from '@shared/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '@shared/constants/theme';

const passwordSchema = object().shape({
  currentPassword: string().required('Current password is required'),
  newPassword: string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must not exceed 64 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Must contain at least one special character')
    .notOneOf([yup.ref('currentPassword')], 'New password must be different'),
  confirmNewPassword: string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export const ChangePasswordScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { mutateAsync: changePassword, isPending, error, reset: resetError } = useChangePassword();
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: InferType<typeof passwordSchema>) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (_err) {}
  };

  return (
    <AppScreen
      errorMessage={getErrorMessage(error)}
      onDismissError={resetError}
      successMessage={success ? 'Password changed successfully' : undefined}
      onDismissSuccess={() => setSuccess(false)}
      contentContainerStyle={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Create a strong new password to protect your account. We recommend using a mix of letters, numbers, and symbols.
            </Text>
          </View>
          <View style={styles.form}>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Current Password"
                  labelBg={colors.background}
                  value={value}
                  onChangeText={onChange}
                  error={errors.currentPassword?.message}
                  containerStyle={styles.inputSpacing}
                  icon="lock-closed-outline"
                  secureTextEntry={!showCurrentPassword}
                  rightIcon={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              )}
            />
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="New Password"
                  labelBg={colors.background}
                  value={value}
                  onChangeText={onChange}
                  error={errors.newPassword?.message}
                  containerStyle={styles.inputSpacing}
                  icon="key-outline"
                  secureTextEntry={!showNewPassword}
                  rightIcon={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowNewPassword(!showNewPassword)}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmNewPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm New Password"
                  labelBg={colors.background}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmNewPassword?.message}
                  containerStyle={styles.inputSpacing}
                  icon="checkmark-circle-outline"
                  secureTextEntry={!showConfirmPassword}
                  rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            />
          </View>
          <View style={styles.footer}>
            <NeonButton
              title="Update Password"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  description: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  form: { flex: 1 },
  inputSpacing: { marginBottom: 20 },
  footer: { marginTop: 24, paddingBottom: 24 },
});
