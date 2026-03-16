import React, { useCallback, memo } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, array, string, InferType } from 'yup';

import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AuthSelectionTemplate, SelectableCard } from '@features/auth/components';
import { ACTIVITIES } from '@shared/constants/healthConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep6'>;

const registerStep6Schema = object().shape({
  activities: array().of(string().required()).min(1, 'Please select at least one activity'),
});

const RegisterStep6Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep6Schema),
    defaultValues: {
      activities: [] as string[],
    },
  });

  const onSubmit = useCallback((data: InferType<typeof registerStep6Schema>) => {
    const signupData: SignupData = {
      ...prevData,
      activities: data.activities,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP7, { data: signupData });
  }, [navigation, prevData]);

  return (
    <AuthSelectionTemplate
      title="What activities interest you?"
      subtitle="Select one to customize your experience"
      currentStep={6}
      totalSteps={7}
      onBack={() => navigation.goBack()}
      onContinue={handleSubmit(onSubmit)}
      error={errors.activities?.message}
    >
      <Controller
        control={control}
        name="activities"
        render={({ field: { onChange, value } }) => (
          <>
            {ACTIVITIES.map((activity) => {
              const selected: string[] = value ?? [];
              const isSelected = selected.includes(activity.id);
              return (
                <SelectableCard
                  key={activity.id}
                  label={activity.label}
                  subtitle={activity.subtitle}
                  iconName={activity.icon}
                  isSelected={isSelected}
                  onPress={() => {
                    const next = isSelected
                      ? selected.filter((id: string) => id !== activity.id)
                      : [...selected, activity.id];
                    onChange(next);
                  }}
                />
              );
            })}
          </>
        )}
      />
    </AuthSelectionTemplate>
  );
};



export default memo(RegisterStep6Screen);
