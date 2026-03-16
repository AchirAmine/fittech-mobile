import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@shared/components/ui';
import { ThemeColors } from '@shared/constants/colors';

interface InfoRowProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: ThemeColors;
  isDark: boolean;
}

export const InfoRow = ({ label, value, icon, colors, isDark }: InfoRowProps) => (
  <Input
    label={label}
    labelBg={isDark ? colors.card : '#fff'}
    value={value}
    containerStyle={styles.inputSpacing}
    icon={icon}
    editable={false}
  />
);

const styles = StyleSheet.create({
  inputSpacing: { marginBottom: 16 },
});
