import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { NeonButton } from '@shared/components/ui/NeonButton';
interface EmptyCoachingStateProps {
  onPress: () => void;
}
export const EmptyCoachingState: React.FC<EmptyCoachingStateProps> = ({ onPress }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.card : '#F0F5FF' }]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryMid }]}>
        <Ionicons name="person-add" size={28} color={colors.white} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Your Personal Coaching</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Unlock 1-on-1 sessions and tailored workout plans.
        </Text>
      </View>
      <NeonButton 
        title="Get Started" 
        onPress={onPress}
        style={styles.button}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    opacity: 0.8,
  },
  button: {
    width: '100%',
    borderRadius: 999,
  },
});
