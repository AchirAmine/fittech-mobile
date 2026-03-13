import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { NeonButton, BackButton, AppScreen } from '@shared/components';
import { StepIndicator, StepHeading, ValuePicker } from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep4'>;

const generateHeightsCm = () => Array.from({ length: 151 }, (_, i) => 100 + i);

const formatCm = (cm: number) => {
  const m = Math.floor(cm / 100);
  const remaining = cm % 100;
  return `${m},${remaining < 10 ? '0' : ''}${remaining}`;
};

const RegisterStep4Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const unit = 'cm';
  const heightsCm = generateHeightsCm();
  const defaultCmIndex = heightsCm.indexOf(170);
  const [selectedIndex, setSelectedIndex] = useState(defaultCmIndex >= 0 ? defaultCmIndex : 0);

  const handleIndexChange = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleContinue = useCallback(() => {
    const heightValue = heightsCm[selectedIndex];
    const data: SignupData = {
      ...prevData,
      heightValue,
      heightUnit: unit,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP5, { data });
  }, [navigation, prevData, heightsCm, selectedIndex]);

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
        <NeonButton title="Continue" onPress={handleContinue} style={styles.continueBtn} />
      }
    >
      <StepHeading title="What's your Height ?" />

      <View style={styles.pickerWrapper}>
        <ValuePicker
          data={heightsCm}
          selectedIndex={selectedIndex}
          onIndexChange={handleIndexChange}
          formatValue={formatCm}
          unit={unit}
          unitOverlayMarginLeft={55}
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
