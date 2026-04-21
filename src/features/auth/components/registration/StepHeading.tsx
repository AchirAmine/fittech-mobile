import React, { memo } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
interface StepHeadingProps {
  title: string;
  subtitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}
export const StepHeading: React.FC<StepHeadingProps> = memo(({
  title,
  subtitle,
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, { color: colors.primaryMid }, titleStyle]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }, subtitleStyle]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
