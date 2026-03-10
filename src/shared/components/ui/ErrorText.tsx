import React, { memo } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

export interface ErrorTextProps {
  error?: string | null;
  style?: TextStyle;
}

export const ErrorText: React.FC<ErrorTextProps> = memo(({ error, style }) => {
  const { colors } = useTheme();

  if (!error) return null;

  return (
    <Text style={[styles.errorText, { color: colors.error }, style]}>
      {error}
    </Text>
  );
});

const styles = StyleSheet.create({
  errorText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
