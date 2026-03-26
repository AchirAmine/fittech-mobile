import React, { useCallback, memo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';

import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AuthSelectionTemplate, SelectableCard, OtherOptionInput } from '@features/auth/components';
import { GOALS } from '@shared/constants/healthConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep5'>;

const registerStep5Schema = object().shape({
  selectedGoal: string().required('Please select your goal to continue'),
  customGoal: string().when('selectedGoal', {
    is: 'other',
    then: (schema) => schema.trim().required('Please enter your goal'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const RegisterStep5Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep5Schema),
    defaultValues: {
      selectedGoal: undefined as string | undefined,
      customGoal: '',
    },
  });

  const selectedGoal = watch('selectedGoal');

  const onSubmit = useCallback((data: InferType<typeof registerStep5Schema>) => {
    let finalGoal = data.selectedGoal;
    if (data.selectedGoal === 'other') {
      finalGoal = data.customGoal?.trim() ?? '';
    }
    const signupData: SignupData = {
      ...prevData,
      goal: finalGoal,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP6, { data: signupData });
  }, [navigation, prevData]);

  return (
    <AuthSelectionTemplate
      title="What is your Goal?"
      subtitle="Select one to customize your experience"
      currentStep={5}
      totalSteps={7}
      onBack={() => navigation.goBack()}
      onContinue={handleSubmit(onSubmit)}
      error={errors.selectedGoal?.message || errors.customGoal?.message}
    >
      <Controller
        control={control}
        name="selectedGoal"
        render={({ field: { onChange, value } }) => (
          <>
            {GOALS.map((goal) => (
              <SelectableCard
                key={goal.id}
                label={goal.label}
                iconName={goal.icon}
                isSelected={value === goal.id}
                onPress={() => onChange(goal.id)}
              />
            ))}
          </>
        )}
      />

      {selectedGoal === 'other' && (
        <OtherOptionInput
          control={control}
          name="customGoal"
          label="Enter your goal"
          placeholder="E.g. Build endurance"
          error={errors.customGoal?.message}
        />
      )}
    </AuthSelectionTemplate>
  );
};

export default memo(RegisterStep5Screen);

