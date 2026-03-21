import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@shared/constants/theme';

interface HomeSectionProps {
  title: string;
  titleColor: string;
  children: React.ReactNode;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ title, titleColor, children }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
});
