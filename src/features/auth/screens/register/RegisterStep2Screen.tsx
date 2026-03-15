import React, { useState, useCallback, memo } from 'react';
import {
  View, Image, StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import { NeonButton, Input, AppScreen } from '@shared/components';
import {
  StepHeading, PasswordRequirements, PasswordRule, RegisterStepHeader,
} from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep2'>;

const PASSWORD_RULES: PasswordRule[] = [
  { label: '8-20 characters', test: (pw) => pw.length >= 8 && pw.length <= 20 },
  { label: 'Lower case letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Upper case letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Number or special character', test: (pw) => /[\d!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const RegisterStep2Screen: React.FC<Props> = ({ navigation, route }) => {
  useTheme();
  const { data: prevData } = route.params;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (PASSWORD_RULES.some((r) => !r.test(password))) newErrors.password = 'Password does not meet all requirements';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, confirmPassword]);

  const handleContinue = useCallback(() => {
    if (!validate()) return;
    const data: SignupData = {
      ...prevData,
      email: email.trim(),
      password,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP3, { data });
  }, [navigation, prevData, email, password, validate]);

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
        <NeonButton title="Continue" onPress={handleContinue} style={styles.continueBtn} />
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

        <Input
          label="Email"
          icon="mail-outline"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />


        <Input
          label="Password"
          icon="lock-closed-outline"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          rightIcon={showPass ? 'eye-off-outline' : 'eye-outline'}
          onRightIconPress={() => setShowPass((p) => !p)}
          error={errors.password}
        />


        <Input
          label="Confirm Password"
          icon="lock-closed-outline"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          rightIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
          onRightIconPress={() => setShowConfirm((p) => !p)}
          error={errors.confirmPassword}
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
