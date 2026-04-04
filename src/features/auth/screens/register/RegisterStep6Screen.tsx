import React, { useCallback, memo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, array, string, InferType } from 'yup';

import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AuthSelectionTemplate, SelectableCard, OtherOptionInput } from '@features/auth/components';

import { ACTIVITIES } from '@shared/constants/healthConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep6'>;

const registerStep6Schema = object().shape({
  activities: array().of(string().required()).min(1, 'Please select at least one activity'),
  customActivity: string().when('activities', {
    is: (val: string[] | undefined) => val && val.includes('other'),
    then: (schema) => schema.trim().required('Please describe your other interest'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const RegisterStep6Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const { control, handleSubmit, watch, clearErrors, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep6Schema),
    defaultValues: {
      activities: [] as string[],
      customActivity: '',
    },
  });

  const selectedActivities = watch('activities');


  const onSubmit = useCallback((data: InferType<typeof registerStep6Schema>) => {
    const finalActivities = (data.activities || []).map((id: string) => {
      if (id === 'other') return `Other: ${data.customActivity?.trim() ?? ''}`;
      return id;
    });

    const signupData: SignupData = {
      ...prevData,
      activities: finalActivities,
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
      error={errors.activities?.message || errors.customActivity?.message}
      onDismissError={() => clearErrors()}
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

      {selectedActivities?.includes('other') && (
        <OtherOptionInput
          control={control}
          name="customActivity"
          label="Other activity"
          placeholder="E.g. Pilates, Crossfit..."
          error={errors.customActivity?.message}
        />
      )}

    </AuthSelectionTemplate>
  );
};

export default memo(RegisterStep6Screen);

