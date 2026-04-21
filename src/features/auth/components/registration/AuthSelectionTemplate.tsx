import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { AppScreen, BackButton, NeonButton } from '@shared/components';
import { StepIndicator } from './StepIndicator';
import { StepHeading } from './StepHeading';
interface AuthSelectionTemplateProps {
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  loading?: boolean;
  loadingMessage?: string;
  error?: string;
  onDismissError?: () => void;
  children: React.ReactNode;
}
export const AuthSelectionTemplate: React.FC<AuthSelectionTemplateProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  loading = false,
  loadingMessage,
  error,
  onDismissError,
  children,
}) => {
  return (
    <AppScreen
      isLoading={loading}
      loadingMessage={loadingMessage}
      errorMessage={error || null}
      onDismissError={onDismissError || (() => {})}
      header={
        <View style={styles.headerRow}>
          <BackButton onPress={onBack} />
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </View>
        </View>
      }
      footer={
        <NeonButton
          title="Continue"
          onPress={onContinue}
          disabled={loading}
          style={styles.continueBtn}
        />
      }
    >
      <StepHeading title={title} subtitle={subtitle} />
      <View style={styles.listContent}>
        {children}
      </View>
    </AppScreen>
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
  listContent: {
    paddingHorizontal: 10,
    gap: 12,
    paddingBottom: 24,
  },
  continueBtn: {
    marginBottom: 22,
    borderRadius: Theme.Radius.lg,
    height: 56,
  },
});
