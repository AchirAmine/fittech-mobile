import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Logo } from '@shared/components/ui/Logo';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  logoSize?: 'small' | 'medium' | 'large';
  titleSize?: number;
}

export const AuthHeader: React.FC<AuthHeaderProps> = memo(({
  title,
  subtitle,
  showLogo = false,
  logoSize = 'large',
  titleSize = 26,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {showLogo && (
        <View style={styles.logoRow}>
          <Logo size={logoSize} color={colors.primary} />
        </View>
      )}

      <Text style={[styles.heading, { color: colors.primaryMid, fontSize: titleSize }]}>
        {title}
      </Text>

      {subtitle && (
        <Text style={[styles.subheading, { color: colors.primary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  heading: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
});
