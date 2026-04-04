import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
  allowTopInset?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = memo(({ 
  message, 
  onDismiss,
  allowTopInset = false
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!message) return null;

  const topPosition = allowTopInset 
    ? Math.max(insets.top + 10, Platform.OS === 'ios' ? 50 : 40)
    : 15;

  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.error, top: topPosition }
    ]}>
      <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
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
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
});
