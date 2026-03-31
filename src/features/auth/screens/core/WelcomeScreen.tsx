import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { NeonButton } from '@shared/components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@shared/constants/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

const CustomIllustration = () => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.customIllustrationContainer}>
      {/* Abstract Animated-like Background Circles (Fully Transparent to container) */}
      <View style={[styles.circleBg, { width: 220, height: 220, borderRadius: 110, backgroundColor: colors.primaryMid, opacity: 0.1 }]} />
      <View style={[styles.circleBg, { width: 160, height: 160, borderRadius: 80, backgroundColor: colors.primaryMid, opacity: 0.2 }]} />
      
      {/* Main Center Icon */}
      <View style={[styles.mainIconWrap, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Ionicons name="barbell" size={80} color={colors.primaryMid} style={{ transform: [{ rotate: '-45deg' }] }} />
      </View>
      
      {/* Floating accents */}
      <View style={[styles.floatingIcon, { top: 40, right: 30 }]}>
        <Ionicons name="pulse" size={32} color={colors.success || '#00C897'} />
      </View>
      <View style={[styles.floatingIcon, { bottom: 50, left: 30 }]}>
        <Ionicons name="heart" size={28} color={Palette.rose[500]} />
      </View>
      <View style={[styles.floatingIcon, { top: 70, left: 20 }]}>
        <Ionicons name="flash" size={24} color={Palette.semantic.warning} />
      </View>
    </View>
  );
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const handleGetStarted = () => {
    navigation.navigate(ROUTES.AUTH.AUTH_CHOICE);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.flex} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.illustrationWrapper}>
            <CustomIllustration />
          </View>
  
          <View style={styles.footerContainer}>
            <Text style={[styles.headline, { color: colors.textPrimary }]}>
              The best Fitness app of the century
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Your place to train, connect with coaches, track your progress, and stay motivated on your fitness journey.
            </Text>
          </View>
  
          <View style={styles.buttonWrapper}>
            <NeonButton 
              title="Get Started" 
              onPress={handleGetStarted} 
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    zIndex: 1,
  },
  illustrationWrapper: {
    width: width,
    height: Math.min(width * 1.1, Dimensions.get('window').height * 0.45),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  customIllustrationContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circleBg: {
    position: 'absolute',
  },
  mainIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    zIndex: 2,
  },
  floatingIcon: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    zIndex: 3,
  },
  footerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24,
  },
  headline: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
  },
  description: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  buttonWrapper: {
    width: '100%',
    paddingTop: 16,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;
