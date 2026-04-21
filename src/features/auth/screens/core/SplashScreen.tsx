import React, { useEffect, useState, useRef, memo } from 'react';
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
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@shared/constants/colors';
import { useAppDispatch } from '@shared/hooks/useReduxHooks';
import { setHasLaunched } from '../../store/authSlice';
type Props = Partial<NativeStackScreenProps<AuthStackParamList, 'Splash'>>;
const { width, height } = Dimensions.get('window');
const DOT_SIZE = 24;
const MAX_SCALE = (Math.max(width, height) * 2.5) / DOT_SIZE;
const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [typedText, setTypedText] = useState('');
  const brandName = "FitTech";
  const dotScale = useSharedValue(1);
  const containerOpacity = useSharedValue(0);
  const iconWidth = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    dispatch(setHasLaunched(false));
    containerOpacity.value = withTiming(1, { duration: 400 });
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(brandName.substring(0, index + 1));
      index++;
      if (index > brandName.length) {
        clearInterval(typingInterval);
        iconWidth.value = withTiming(48, { duration: 300, easing: Easing.out(Easing.ease) });
        iconOpacity.value = withTiming(1, { duration: 300 });
        dotScale.value = withDelay(
          500,
          withTiming(MAX_SCALE, {
            duration: 800,
            easing: Easing.in(Easing.exp),
          })
        );
        timerRef.current = setTimeout(() => {
          navigation?.replace(ROUTES.AUTH.WELCOME);
        }, 1350);
      }
    }, 150);
    return () => {
      clearInterval(typingInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigation]);
  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    width: iconWidth.value,
    opacity: iconOpacity.value,
  }));
  const activeColor = colors.white;
  return (
    <View style={[styles.container, { backgroundColor: Palette.primary[500] }]}>
      <StatusBar style="light" hidden />
      <Animated.View style={[styles.centerWrapper, fadeStyle]}>
        <View style={styles.dummyRow} accessible={false}>
          <Text style={[styles.brandText, { opacity: 0 }]}>{brandName}</Text>
          <View style={{ width: 48 }} />
          <View style={styles.dotContainer} />
        </View>
        <View style={styles.absoluteRow}>
          <Text style={[styles.brandText, { color: activeColor }]}>
            {typedText}
          </Text>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <View style={styles.iconWrap}>
              <Ionicons 
                name="barbell" 
                size={44} 
                color={activeColor} 
                style={styles.icon}
              />
            </View>
          </Animated.View>
          <Animated.View style={[styles.dotContainer, dotStyle]}>
             <View style={[styles.dot, { backgroundColor: colors.background }]} />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  dummyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0,
  },
  absoluteRow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 48,
    letterSpacing: -0.5,
  },
  iconContainer: {
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconWrap: {
    marginLeft: 4,
    transform: [{ rotate: '-45deg' }],
  },
  icon: {
    marginTop: 2,
  },
  dotContainer: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    marginLeft: 8,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    position: 'absolute',
  },
});
export default memo(SplashScreen);
