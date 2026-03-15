import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { Input } from '@shared/components';
import { AuthSelectionTemplate, SelectableCard } from '@features/auth/components';
import { GOALS } from '@shared/constants/healthConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep5'>;

const RegisterStep5Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  const [error, setError] = useState('');

  const handleContinue = useCallback(() => {
    if (!selectedGoal) {
      setError('Please select your goal to continue');
      return;
    }
    let finalGoal = selectedGoal;
    if (selectedGoal === 'other') {
      finalGoal = customGoal.trim();
      if (!finalGoal) {
        setError('Please enter your goal');
        return;
      }
    }
    const data: SignupData = {
      ...prevData,
      goal: finalGoal,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP6, { data });
  }, [navigation, prevData, selectedGoal, customGoal]);

  return (
    <AuthSelectionTemplate
      title="What is your Goal?"
      subtitle="Select one to customize your experience"
      currentStep={5}
      totalSteps={7}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      error={error}
      onDismissError={() => setError('')}
    >
      {GOALS.map((goal) => (
        <SelectableCard
          key={goal.id}
          label={goal.label}
          iconName={goal.icon}
          isSelected={selectedGoal === goal.id}
          onPress={() => {
            setSelectedGoal(goal.id);
            setError('');
          }}
        />
      ))}

      {selectedGoal === 'other' && (
        <View style={styles.inputContainer}>
          <Input
            label="Enter your goal"
            placeholder="E.g. Build endurance"
            value={customGoal}
            onChangeText={(text) => {
              setCustomGoal(text);
              setError('');
            }}
            maxLength={100}
            error={error && selectedGoal === 'other' ? error : undefined}
          />
        </View>
      )}
    </AuthSelectionTemplate>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 12,
  },
});

export default memo(RegisterStep5Screen);
