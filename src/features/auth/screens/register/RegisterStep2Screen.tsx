import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';

import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import { AppScreen, NeonButton, Input } from '@shared/components';
import { StepHeading, RegisterStepHeader, PasswordRequirements, PasswordStrengthIndicator } from '@features/auth/components';
import { PASSWORD_RULES } from '@shared/constants/authConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep2'>;

const registerStep2Schema = object().shape({
  email: string().trim().required('Email is required').email('Enter a valid email'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('pass-rules', 'Password does not meet all requirements', (value) => {
      if (!value) return false;
      return (
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[^a-zA-Z0-9]/.test(value)
      );
    }),
  confirmPassword: string()
    .required('Please confirm your password')
    .test('pass-match', 'Passwords do not match', (value, context) => {
      return value === context.parent.password;
    }),
});

const RegisterStep2Screen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { data: prevData } = route.params;

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep2Schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = useCallback((data: InferType<typeof registerStep2Schema>) => {
    const signupData: SignupData = {
      ...prevData,
      email: data.email.trim(),
      password: data.password,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP3, { data: signupData });
  }, [navigation, prevData]);

  return (
    <AppScreen
      header={
        <RegisterStepHeader
          currentStep={2}
          totalSteps={7}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <NeonButton title="Continue" onPress={handleSubmit(onSubmit)} style={styles.continueBtn} />
      }
    >

      <StepHeading title="Secure Your Account" />


      <View style={styles.illustrationWrap}>
        <Image
          source={require('../../assets/secure-account-illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>


      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              icon="mail-outline"
              placeholder="example@gmail.com"
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
              onRightIconPress={() => setShowPass((p) => !p)}
              error={errors.password?.message}
            />
          )}
        />

        <PasswordStrengthIndicator password={password} />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password"
              icon="lock-closed-outline"
              placeholder="Confirm Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={!showConfirm}
              rightIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowConfirm((p) => !p)}
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <PasswordRequirements password={password} rules={PASSWORD_RULES} />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  illustrationWrap: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 280,
    height: 160,
    marginBottom: 16,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  form: { gap: 16 },
  continueBtn: { marginTop: 16, marginBottom: 8 },
});

export default memo(RegisterStep2Screen);
