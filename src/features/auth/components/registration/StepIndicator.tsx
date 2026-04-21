import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}
export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;
          const isCurrent = index === currentStep - 1;
          return (
            <Animated.View
              key={index}
              layout={LinearTransition}
              style={[
                styles.segment,
                { backgroundColor: colors.cardSecondary, opacity: 1 },
                isActive && { backgroundColor: colors.primaryMid, opacity: 0.4 },
                isCurrent && { backgroundColor: colors.primaryMid, height: 6, opacity: 1 },
              ]}
            />
          );
        })}
      </View>
      <Text style={[styles.text, { color: colors.primaryMid, opacity: 0.8 }]}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    gap: 6,
    flex: 1,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: Theme.Radius.full,
  },
  text: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 12,
    minWidth: 70,
    textAlign: 'right',
  },
});
