import React, { useState, useCallback, useEffect, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import {
  NeonButton,
  Input,
  AppScreen,
  BackButton,
} from '@shared/components';
import {
  AuthHeader,
  IllustrationPlaceholder,
} from '@features/auth/components';
import { loginSchema } from '@shared/utils/validators';
import { useAppDispatch, useAppSelector } from '@shared/hooks/useReduxHooks';
import { clearError } from '@features/auth/store/authSlice';
import { login } from '@features/auth/store/authActions';
import { selectAuthLoading, selectAuthError } from '@features/auth/store/authSelectors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [showPass, setShowPass] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(async (data: { email: string; password: string }) => {
    try {
      const resultAction = await dispatch(login(data));
      if (login.fulfilled.match(resultAction)) {
        navigation.navigate(ROUTES.AUTH.SUCCESS, { type: 'login' });
      }
    } catch (err: unknown) {
    }
  }, [dispatch, navigation]);

  const navigateToForgot = useCallback(() => {
    navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD);
  }, [navigation]);

  const navigateToRegister = useCallback(() => {
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP1);
  }, [navigation]);

  const toggleShowPass = useCallback(() => {
    setShowPass((prev) => !prev);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <AppScreen
      isLoading={loading}
      loadingMessage="Signing in..."
      errorMessage={error}
      onDismissError={() => dispatch(clearError())}
      header={<BackButton onPress={() => navigation.goBack()} />}
      scrollable={true}
    >
      <View style={{ paddingTop: 20 }}>
        <AuthHeader
          title="Welcome Back!"
          subtitle="Let's login for explore continues"
          showLogo={true}
          logoSize="large"
        />

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email or Phone Number"
                icon="mail-outline"
                placeholder="Enter your email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

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

          <TouchableOpacity style={styles.forgotRow} onPress={navigateToForgot}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password</Text>
          </TouchableOpacity>

          <NeonButton
            title={loading ? 'Signing in...' : 'Sign in'}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={styles.loginBtn}
          />
        </View>

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.textPrimary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>Sign Up here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  loginBtn: {
    borderRadius: Theme.Radius.lg,
    height: 56,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  registerText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  registerLink: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 14,
  },
});

export default memo(LoginScreen);
