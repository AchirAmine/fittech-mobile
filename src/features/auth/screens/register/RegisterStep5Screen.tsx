import React, { useCallback, memo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, array, string, InferType } from 'yup';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { AuthSelectionTemplate, SelectableCard, OtherOptionInput } from '@features/auth/components';
import { GOALS } from '@shared/constants/healthConstants';
type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep5'>;
const registerStep5Schema = object().shape({
  selectedGoals: array().of(string().required()).min(1, 'Please select at least one goal'),
  customGoal: string().when('selectedGoals', {
    is: (val: string[] | undefined) => val && val.includes('other'),
    then: (schema) => schema.trim().required('Please enter your goal'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
const RegisterStep5Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;
  const { control, handleSubmit, watch, clearErrors, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep5Schema),
    defaultValues: {
      selectedGoals: [] as string[],
      customGoal: '',
    },
  });
  const selectedGoals = watch('selectedGoals');
  const onSubmit = useCallback((data: InferType<typeof registerStep5Schema>) => {
    const finalGoals = (data.selectedGoals || []).map((id: string) => {
      if (id === 'other') return `Other: ${data.customGoal?.trim() ?? ''}`;
      return id;
    });
    const signupData: SignupData = {
      ...prevData,
      goals: finalGoals,
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
      error={errors.selectedGoals?.message || errors.customGoal?.message}
      onDismissError={() => clearErrors()}
    >
      <Controller
        control={control}
        name="selectedGoals"
        render={({ field: { onChange, value } }) => (
          <>
            {GOALS.map((goal) => {
              const selected: string[] = value ?? [];
              const isSelected = selected.includes(goal.id);
              return (
                <SelectableCard
                  key={goal.id}
                  label={goal.label}
                  subtitle={goal.subtitle}
                  iconName={goal.icon}
                  isSelected={isSelected}
                  onPress={() => {
                    const next = isSelected
                      ? selected.filter((id: string) => id !== goal.id)
                      : [...selected, goal.id];
                    onChange(next);
                  }}
                />
              );
            })}
          </>
        )}
      />
      {selectedGoals?.includes('other') && (
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
