import React, { useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withDelay,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import { AuthHeader } from '@features/auth/components';
import { NeonButton } from '@shared/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { useTheme } from '@shared/hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Success'>;

const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();

  const { type, title: customTitle, subtitle: customSubtitle } = route.params || { type: 'login' };

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }));
    opacity.value = withDelay(200, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const navigateToHome = useCallback(() => {
    // Navigate to WELCOME or AUTH_CHOICE to ensure a clean start
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.AUTH.WELCOME as keyof AuthStackParamList }],
    });
  }, [navigation]);

  const defaultTitle = type === 'login' ? 'Login Successful' : 'Registration Successful';
  const defaultSubtitle = type === 'login' 
    ? 'Welcome back to FitTech!\nWe are glad to see you again.' 
    : 'Your account has been created successfully.\nWelcome to FitTech!';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={animatedStyle}>
        <View style={[styles.iconCircle, { backgroundColor: colors.success, shadowColor: colors.success }]}>
          <Ionicons name="checkmark-outline" size={64} color={colors.white} />
        </View>
      </Animated.View>

      <Text style={[styles.heading, { color: colors.textPrimary }]}>Yey! 🎉</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {customTitle || defaultTitle}
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        {customSubtitle || defaultSubtitle}
      </Text>

      <NeonButton
        title="Go to Home"
        onPress={navigateToHome}
        style={styles.btn}
        icon="arrow-forward-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heading: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  subheading: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 48,
  },
  btn: { width: '100%' },
});

export default memo(SuccessScreen);
