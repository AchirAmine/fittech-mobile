import React, { useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AppScreen, NeonButton, BackButton } from '@shared/components';
import { StepHeading, StepIndicator, ValuePicker } from '@features/auth/components';
import { generateWeights } from '@features/auth/utils/registrationUtils';
type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep3'>;
const RegisterStep3Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;
  const unit = 'kg';
  const weights = generateWeights();
  const defaultIndex = weights.indexOf(75);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selectedIndex: defaultIndex >= 0 ? defaultIndex : 0,
    },
  });
  const onSubmit = useCallback((data: { selectedIndex: number }) => {
    const signupData: SignupData = {
      ...prevData,
      weightValue: weights[data.selectedIndex],
      weightUnit: unit,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP4, { data: signupData });
  }, [navigation, prevData, weights]);
  return (
    <AppScreen
      scrollable={false}
      header={
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator currentStep={3} totalSteps={7} />
          </View>
        </View>
      }
      footer={
        <NeonButton title="Continue" onPress={handleSubmit(onSubmit)} style={styles.continueBtn} />
      }
    >
      <StepHeading title="What's your Weight ?" />
      <View style={styles.pickerWrapper}>
        <Controller
          control={control}
          name="selectedIndex"
          render={({ field: { onChange, value } }) => (
            <ValuePicker
              data={weights}
              selectedIndex={value}
              onIndexChange={onChange}
              unit={unit}
              unitOverlayMarginLeft={35}
            />
          )}
        />
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
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  continueBtn: { marginTop: 24, marginBottom: 32 },
});
export default memo(RegisterStep3Screen);
