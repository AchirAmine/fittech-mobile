import React, { useState, useCallback, memo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AuthSelectionTemplate, SelectableCard } from '@features/auth/components';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep6'>;

interface ActivityOption {
  id: string;
  label: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ACTIVITIES: ActivityOption[] = [
  { id: 'strength', label: 'Strength Training', icon: 'barbell-outline' },
  { id: 'hiit', label: 'HIIT', subtitle: '(High-intensity interval training)', icon: 'flash-outline' },
  { id: 'cardio', label: 'Cardio', subtitle: '(Running, Cycling)', icon: 'fitness-outline' },
  { id: 'sports', label: 'Sports', subtitle: '(Eg. Tennis, Swimming)', icon: 'fitness-outline' },
];

const RegisterStep6Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const toggleActivity = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setError('');
  }, []);

  const handleContinue = useCallback(() => {
    if (selected.size === 0) {
      setError('Please select at least one activity');
      return;
    }
    const data: SignupData = {
      ...prevData,
      activities: Array.from(selected),
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP7, { data });
  }, [navigation, prevData, selected]);

  return (
    <AuthSelectionTemplate
      title="What activities interest you?"
      subtitle="Select one to customize your experience"
      currentStep={6}
      totalSteps={7}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      error={error}
      onDismissError={() => setError('')}
    >
      {ACTIVITIES.map((activity) => (
        <SelectableCard
          key={activity.id}
          label={activity.label}
          subtitle={activity.subtitle}
          iconName={activity.icon}
          isSelected={selected.has(activity.id)}
          onPress={() => toggleActivity(activity.id)}
        />
      ))}
    </AuthSelectionTemplate>
  );
};

export default memo(RegisterStep6Screen);
