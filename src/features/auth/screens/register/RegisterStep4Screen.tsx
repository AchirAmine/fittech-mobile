import React, { useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AppScreen, NeonButton, BackButton } from '@shared/components';
import { StepHeading, StepIndicator, ValuePicker } from '@features/auth/components';
import { generateHeightsCm, formatCm } from '@features/auth/utils/registrationUtils';
type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep4'>;
const RegisterStep4Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;
  const unit = 'cm';
  const heightsCm = generateHeightsCm();
  const defaultCmIndex = heightsCm.indexOf(170);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selectedIndex: defaultCmIndex >= 0 ? defaultCmIndex : 0,
    },
  });
  const onSubmit = useCallback((data: { selectedIndex: number }) => {
    const heightValue = heightsCm[data.selectedIndex];
    const signupData: SignupData = {
      ...prevData,
      heightValue,
      heightUnit: unit,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP5, { data: signupData });
  }, [navigation, prevData, heightsCm]);
  return (
    <AppScreen
      scrollable={false}
      header={
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator currentStep={4} totalSteps={7} />
          </View>
        </View>
      }
      footer={
        <NeonButton title="Continue" onPress={handleSubmit(onSubmit)} style={styles.continueBtn} />
      }
    >
      <StepHeading title="What's your Height ?" />
      <View style={styles.pickerWrapper}>
        <Controller
          control={control}
          name="selectedIndex"
          render={({ field: { onChange, value } }) => (
            <ValuePicker
              data={heightsCm}
              selectedIndex={value}
              onIndexChange={onChange}
              formatValue={formatCm}
              unit={unit}
              unitOverlayMarginLeft={55}
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
export default memo(RegisterStep4Screen);
