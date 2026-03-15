import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { NeonButton } from '@shared/components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

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
          {/* Central Illustration Area */}
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('@features/auth/assets/welcome-illustration.png')} 
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
  
          {/* Text Segment */}
          <View style={styles.footerContainer}>
            <Text style={styles.headline}>
              The best Fitness app{'\n'}of the century
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
  illustrationContainer: {
    width: width,
    height: Math.min(width * 1.1, Dimensions.get('window').height * 0.45),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  illustration: {
    width: '100%',
    height: '100%',
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
