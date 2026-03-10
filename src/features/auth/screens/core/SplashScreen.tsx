import React, { useEffect, memo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { Theme } from '@shared/constants/theme';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '@shared/components';

type Props = Partial<NativeStackScreenProps<AuthStackParamList, 'Splash'>>;

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const scale = useSharedValue<number>(0.8);
  const opacity = useSharedValue<number>(0);
  const textOpacity = useSharedValue<number>(0);
  const textY = useSharedValue<number>(30);

  useEffect(() => {
    // Animate in
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    textY.value = withDelay(600, withTiming(0, { duration: 800 }));

    // Navigate to Welcome after delay
    const timer = setTimeout(() => {
      navigation?.replace(ROUTES.AUTH.WELCOME);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textWrapStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryMid, colors.primaryDark]}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Logo size="large" color={colors.white} textColor={colors.white} />
      </Animated.View>
      
      <Animated.View style={[styles.taglineWrap, textWrapStyle]}>
        <Text style={[styles.tagline, { color: colors.white }]}>
          Best App to track your fitness routine
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width, height 
  },
  logoContainer: { 
    marginBottom: 48 
  },
  taglineWrap: { 
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  tagline: { 
    fontFamily: Theme.Typography.fontFamily.medium, 
    fontSize: 16, 
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default memo(SplashScreen);
