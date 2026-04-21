import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  FadeOutUp
} from 'react-native-reanimated';
import { Loader } from './Loader';
interface AppScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  keyboardOffset?: number;
  backgroundColor?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  errorMessage?: string | null;
  onDismissError?: () => void;
  safeArea?: boolean;
}
export const AppScreen: React.FC<AppScreenProps> = ({
  children,
  style,
  contentContainerStyle,
  scrollable = true,
  keyboardOffset = 0,
  backgroundColor,
  header,
  footer,
  isLoading,
  loadingMessage = 'Please wait...',
  errorMessage,
  onDismissError,
  safeArea = true,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const containerStyle = [
    styles.container,
    { backgroundColor: backgroundColor || colors.background },
    style,
  ];
  const content = scrollable ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent, 
        !header && safeArea && { paddingTop: insets.top + (styles.scrollContent.paddingHorizontal as number || 0) }
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeInDown.duration(400).springify()}
        style={[styles.flex, contentContainerStyle]}
      >
        {children}
      </Animated.View>
    </ScrollView>
  ) : (
    <Animated.View 
      entering={FadeInDown.duration(400).springify()}
      style={[
        styles.flex, 
        styles.nonScrollContent, 
        contentContainerStyle,
        !header && safeArea && { paddingTop: insets.top }
      ]}
    >
      {children}
    </Animated.View>
  );
  return (
    <View style={containerStyle}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.flex}>
        {header && (
          <View style={[
            styles.headerContainer, 
            safeArea && { paddingTop: Math.max(insets.top, 16) }
          ]}>
            {header}
          </View>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 + keyboardOffset : keyboardOffset}
        >
          {content}
        </KeyboardAvoidingView>
        {footer && (
          <View style={[
            styles.footerContainer, 
            { paddingBottom: safeArea ? Math.max(insets.bottom, 16) : 16 }
          ]}>
            {footer}
          </View>
        )}
      </View>
      {errorMessage && (
        <Animated.View 
          entering={FadeInUp} 
          exiting={FadeOutUp}
          style={[
            styles.errorBanner, 
            { 
              backgroundColor: colors.error, 
              top: safeArea ? Math.max(insets.top + 10, Platform.OS === 'ios' ? 50 : 40) : 15 
            }
          ]}
        >
          <Ionicons name="alert-circle" size={20} color={colors.white} />
          <Text style={[styles.errorText, { color: colors.white }]}>{errorMessage}</Text>
          {onDismissError && (
            <TouchableOpacity onPress={onDismissError}>
              <Ionicons name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: hexToRGBA(colors.background, 0.7) }]}>
          <Loader inline />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>{loadingMessage}</Text>
        </View>
      )}
    </View>
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
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  nonScrollContent: {
    paddingHorizontal: 24,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  footerContainer: {
    paddingHorizontal: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
  },
  errorBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorText: {
    flex: 1,
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
});
