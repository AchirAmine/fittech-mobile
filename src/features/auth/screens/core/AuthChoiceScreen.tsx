import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@shared/hooks/useTheme';
import { Logo, NeonButton } from '@shared/components/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthChoice'>;

const { width, height } = Dimensions.get('window');

const AuthChoiceScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const handleLogin = () => {
    navigation.navigate(ROUTES.AUTH.LOGIN);
  };

  const handleSignUp = () => {
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP1);
  };

  const handleLearnMore = () => {
    navigation.navigate(ROUTES.AUTH.ABOUT_US);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topSection, { backgroundColor: colors.primaryMid }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContent}>
            <Logo 
              color={colors.white} 
              textColor={colors.white} 
              size="large"
            />

            
            <View style={styles.illustrationContainer}>
              <Image 
                source={require('@features/auth/assets/auth-home-illustration.png')} 
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </SafeAreaView>

        <View style={[styles.diagonalCut, { backgroundColor: colors.primaryMid }]} />
      </View>

      <View style={[styles.bottomSection, { backgroundColor: colors.background }]}>
        <View style={styles.buttonContainer}>
          <NeonButton 
            title="Get to know us more !" 
            onPress={handleLearnMore} 
            style={styles.actionButton}
          />
          
          <NeonButton 
            title="SignUp" 
            onPress={handleSignUp} 
            style={styles.actionButton}
          />

          <NeonButton 
            title="Login" 
            onPress={handleLogin} 
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: height * 0.48,
    position: 'relative',
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  illustrationContainer: {
    width: width * 0.9,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  diagonalCut: {
    position: 'absolute',
    bottom: -40,
    left: -50,
    right: -50,
    height: 80,
    transform: [{ skewY: '-9deg' }],
    zIndex: -1,
  },
  bottomSection: {
    flex: 1,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  actionButton: {
    width: '100%',
  },
});

export default AuthChoiceScreen;
