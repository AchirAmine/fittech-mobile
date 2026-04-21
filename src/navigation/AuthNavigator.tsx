import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useAppSelector } from '@shared/hooks/useReduxHooks';
import SplashScreen from '@features/auth/screens/core/SplashScreen';
import WelcomeScreen from '@features/auth/screens/core/WelcomeScreen';
import AuthChoiceScreen from '@features/auth/screens/core/AuthChoiceScreen';
import AboutUsScreen from '@features/auth/screens/misc/AboutUsScreen';
import LoginScreen from '@features/auth/screens/core/LoginScreen';
import RegisterStep1Screen from '@features/auth/screens/register/RegisterStep1Screen';
import RegisterStep2Screen from '@features/auth/screens/register/RegisterStep2Screen';
import RegisterStep3Screen from '@features/auth/screens/register/RegisterStep3Screen';
import RegisterStep4Screen from '@features/auth/screens/register/RegisterStep4Screen';
import RegisterStep5Screen from '@features/auth/screens/register/RegisterStep5Screen';
import RegisterStep6Screen from '@features/auth/screens/register/RegisterStep6Screen';
import RegisterStep7Screen from '@features/auth/screens/register/RegisterStep7Screen';
import OTPVerificationScreen from '@features/auth/screens/recovery/OTPVerificationScreen';
import SuccessScreen from '@features/auth/screens/misc/SuccessScreen';
import ForgotPasswordScreen from '@features/auth/screens/recovery/ForgotPasswordScreen';
import ResetPasswordScreen from '@features/auth/screens/recovery/ResetPasswordScreen';
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const commonStackOptions: NativeStackNavigationOptions = {
  headerShown: false,
};
export const AuthNavigator = () => {
  const isFirstLaunch = useAppSelector((state) => state.auth.isFirstLaunch);
  return (
    <AuthStack.Navigator 
      id="Auth" 
      initialRouteName={isFirstLaunch ? ROUTES.AUTH.SPLASH : ROUTES.AUTH.AUTH_CHOICE} 
      screenOptions={commonStackOptions}
    >
      <AuthStack.Screen name={ROUTES.AUTH.SPLASH} component={SplashScreen} />
      <AuthStack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
      <AuthStack.Screen 
        name={ROUTES.AUTH.WELCOME} 
        component={WelcomeScreen} 
        options={{ animation: 'fade' }}
      />
      <AuthStack.Screen name={ROUTES.AUTH.AUTH_CHOICE} component={AuthChoiceScreen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP1} component={RegisterStep1Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP2} component={RegisterStep2Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP3} component={RegisterStep3Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP4} component={RegisterStep4Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP5} component={RegisterStep5Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP6} component={RegisterStep6Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.REGISTER_STEP7} component={RegisterStep7Screen} />
      <AuthStack.Screen name={ROUTES.AUTH.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <AuthStack.Screen name={ROUTES.AUTH.OTP_VERIFICATION} component={OTPVerificationScreen} />
      <AuthStack.Screen name={ROUTES.AUTH.RESET_PASSWORD} component={ResetPasswordScreen} />
      <AuthStack.Screen name={ROUTES.AUTH.SUCCESS} component={SuccessScreen} />
      <AuthStack.Screen name={ROUTES.AUTH.ABOUT_US} component={AboutUsScreen} />
    </AuthStack.Navigator>
  );
};
