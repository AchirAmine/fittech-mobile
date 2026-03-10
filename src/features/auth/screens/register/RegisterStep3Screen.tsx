import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { NeonButton, BackButton, AppScreen } from '@shared/components';
import { StepIndicator, StepHeading, ValuePicker } from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep3'>;

const generateWeights = (unit: 'kg') => {
  return Array.from({ length: 221 }, (_, i) => 30 + i); // 30–250
};

const RegisterStep3Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const unit = 'kg';
  const weights = generateWeights(unit);
  const defaultIndex = weights.indexOf(75);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0);

  const handleIndexChange = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleContinue = useCallback(() => {
    const data: SignupData = {
      ...prevData,
      weightValue: weights[selectedIndex],
      weightUnit: unit,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP4, { data });
  }, [navigation, prevData, weights, selectedIndex]);

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
        <NeonButton title="Continue" onPress={handleContinue} style={styles.continueBtn} />
      }
    >
      <StepHeading title="What's your Weight ?" />

      <View style={styles.pickerWrapper}>
        <ValuePicker
          data={weights}
          selectedIndex={selectedIndex}
          onIndexChange={handleIndexChange}
          unit={unit}
          unitOverlayMarginLeft={35}
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
  pickerWrapper: { flex: 1 },
  continueBtn: { marginTop: 24, marginBottom: 32 },
});

export default memo(RegisterStep3Screen);
