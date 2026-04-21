import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
export interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}
interface PasswordRequirementsProps {
  password: string;
  rules: PasswordRule[];
}
export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, rules }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {rules.map((rule, idx) => {
        const passed = rule.test(password);
        return (
          <View key={idx} style={styles.ruleRow}>
            <Ionicons
              name={passed ? 'checkmark-circle' : 'ellipse-outline'}
              size={14}
              color={passed ? colors.success : colors.textMuted}
            />
            <Text style={[styles.ruleText, { color: passed ? colors.success : colors.textMuted }]}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 13,
  },
});
