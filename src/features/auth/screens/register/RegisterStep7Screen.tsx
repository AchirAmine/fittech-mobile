import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useAppDispatch } from '@shared/hooks/useReduxHooks';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { Input, NeonButton } from '@shared/components';
import { AuthSelectionTemplate, SelectableCard } from '@features/auth/components';
import { register } from '@features/auth/store/authActions';
import logger from '@shared/utils/logger';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep7'>;

interface HealthConcernOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const HEALTH_CONCERNS: HealthConcernOption[] = [
  { id: 'diabetes', label: 'Diabetes', icon: 'water-outline' },
  { id: 'heart', label: 'Heart conditions', icon: 'heart-outline' },
  { id: 'joint', label: 'Joint problems', icon: 'body-outline' },
  { id: 'asthma', label: 'Asthma', icon: 'pulse-outline' },
  { id: 'none', label: 'None of the above', icon: 'ban-outline' },
  { id: 'other', label: 'Other health concerns', icon: 'medical-outline' },
];

const RegisterStep7Screen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { data: prevData } = route.params;
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customConcern, setCustomConcern] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleConcern = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (id === 'none') {
        if (next.has('none')) {
          next.delete('none');
        } else {
          next.clear();
          next.add('none');
        }
      } else {
        next.delete('none');
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
    setError('');
  }, []);

  const handleFinish = useCallback(async () => {
    if (selected.size === 0) {
      setError('Please select at least one option');
      return;
    }

    const concernsList = Array.from(selected);
    
    // Check if 'other' is selected but empty
    if (selected.has('other')) {
      const trimmedCustom = customConcern.trim();
      if (!trimmedCustom) {
        setError('Please describe your other health concern');
        return;
      }
      // Replace 'other' with the actual text or keep it and append? 
      // Usually users want the text to replace or be added.
      // Let's replace 'other' with the custom text for the payload.
      const index = concernsList.indexOf('other');
      if (index > -1) {
        concernsList[index] = `Other: ${trimmedCustom}`;
      }
    }

    const data: SignupData = {
      ...prevData,
      healthConcerns: concernsList,
    };
    setLoading(true);
    try {
      const result = await dispatch(register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
        photoLocalUri: data.photo,
        healthProfile: {
          goals: data.goal ? [data.goal] : [],
          heightValue: data.heightValue,
          heightUnit: data.heightUnit,
          weightValue: data.weightValue,
          weightUnit: data.weightUnit,
          restrictions: [...(data.activities || []), ...(data.healthConcerns || [])].join(', '),
        },
      }));
      if (register.fulfilled.match(result)) {
        navigation.navigate(ROUTES.AUTH.OTP_VERIFICATION, {
          email: result.payload.email || data.email || '',
          mode: 'register',
        });
      } else {
        setError(getErrorMessage(result.payload as { message?: string; code?: number }));
      }
    } catch (err) {
      logger.error('Registration error:', err);
      setError(getErrorMessage(err as { message?: string; code?: number }));
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigation, prevData, selected, customConcern]);

  return (
    <AuthSelectionTemplate
      title="Any health concerns?"
      subtitle="Select all that apply to help us personalize your wellness plan."
      currentStep={7}
      totalSteps={7}
      onBack={() => navigation.goBack()}
      onContinue={handleFinish}
      loading={loading}
      loadingMessage="Registering..."
      error={error}
      onDismissError={() => setError('')}
    >
      {HEALTH_CONCERNS.map((option) => (
        <View key={option.id}>
          <SelectableCard
            label={option.label}
            iconName={option.icon}
            isSelected={selected.has(option.id)}
            onPress={() => toggleConcern(option.id)}
          />
          
          {option.id === 'other' && selected.has('other') && (
            <View style={styles.inputContainer}>
              <Input
                label="Describe your health concern"
                placeholder="Details..."
                value={customConcern}
                onChangeText={(text) => {
                  setCustomConcern(text);
                  setError('');
                }}
                maxLength={100}
                error={error && selected.has('other') ? error : undefined}
              />
            </View>
          )}
        </View>
      ))}
    </AuthSelectionTemplate>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default memo(RegisterStep7Screen);
