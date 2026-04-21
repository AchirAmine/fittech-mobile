import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BackButton } from '@shared/components';
import { StepIndicator } from './StepIndicator';
interface RegisterStepHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  style?: ViewStyle;
}
export const RegisterStepHeader: React.FC<RegisterStepHeaderProps> = ({
  currentStep,
  totalSteps,
  onBack,
  style,
}) => {
  return (
    <View style={[styles.headerRow, style]}>
      <BackButton onPress={onBack} />
      <View style={styles.stepIndicatorContainer}>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepIndicatorContainer: {
    flex: 1,
    marginLeft: 16,
  },
});
