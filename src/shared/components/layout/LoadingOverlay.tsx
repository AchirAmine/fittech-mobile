import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Loader } from './Loader';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = memo(({ visible, message }) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background + 'B3' }]}>
      <Loader />
      {message && <Text style={[styles.text, { color: colors.textPrimary }]}>{message}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
  },
});
