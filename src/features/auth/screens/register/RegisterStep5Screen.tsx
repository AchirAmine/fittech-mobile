import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { Input } from '@shared/components';
import { AuthSelectionTemplate, SelectableCard } from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep5'>;

interface GoalOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const GOALS: GoalOption[] = [
  { id: 'lose_weight', label: 'Lose weight', icon: 'fitness-outline' },
  { id: 'build_strength', label: 'Build Strength', icon: 'barbell-outline' },
  { id: 'gain_weight', label: 'Gain Weight', icon: 'barbell-outline' },
  { id: 'reduce_stress', label: 'Reduce Stress', icon: 'body-outline' },
  { id: 'improve_health', label: 'Improve Health', icon: 'heart-outline' },
  { id: 'other', label: 'Other', icon: 'create-outline' },
];

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
      {/* Goals */}
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
