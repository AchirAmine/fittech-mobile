import React, { useCallback, memo, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, array, string, InferType } from 'yup';

import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useAppDispatch } from '@shared/hooks/useReduxHooks';

import { getErrorMessage } from '@shared/constants/errorMessages';
import { AuthSelectionTemplate, SelectableCard, OtherOptionInput } from '@features/auth/components';
import { register } from '@features/auth/store/authActions';
import logger from '@shared/utils/logger';
import { HEALTH_CONCERNS } from '@shared/constants/healthConstants';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep7'>;

const registerStep7Schema = object().shape({
  healthConcerns: array().of(string().required()).min(1, 'Please select at least one option'),
  customConcern: string().when('healthConcerns', {
    is: (val: string[] | undefined) => val && val.includes('other'),
    then: (schema) => schema.trim().required('Please describe your other health concern'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const RegisterStep7Screen: React.FC<Props> = ({ navigation, route }) => {
  const { data: prevData } = route.params;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep7Schema),
    defaultValues: {
      healthConcerns: [] as string[],
      customConcern: '',
    },
  });

  const healthConcerns = watch('healthConcerns');

  const handleToggleConcern = useCallback((id: string, currentValues: string[], onChange: (vals: string[]) => void) => {
    let next: string[];
    if (id === 'none') {
      next = currentValues.includes('none') ? [] : ['none'];
    } else {
      const filtered = currentValues.filter(v => v !== 'none');
      if (filtered.includes(id)) {
        next = filtered.filter(v => v !== id);
      } else {
        next = [...filtered, id];
      }
    }
    onChange(next);
    setApiError('');
  }, []);

  const onSubmit = useCallback(async (formData: InferType<typeof registerStep7Schema>) => {
    const finalConcerns = (formData.healthConcerns ?? []).map((id: string) => {
      if (id === 'other') return `Other: ${formData.customConcern?.trim() ?? ''}`;
      return id;
    });

    const data: SignupData = {
      ...prevData,
      healthConcerns: finalConcerns,
    };

    setLoading(true);
    setApiError('');
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
          restrictions: [...(data.activities || []), ...(data.healthConcerns || [])].filter(Boolean).join(', '),
        },
      }));

      if (register.fulfilled.match(result)) {
        navigation.navigate(ROUTES.AUTH.OTP_VERIFICATION, {
          email: result.payload.email || data.email || '',
          mode: 'register',
        });
      } else {
        setApiError(getErrorMessage(result.payload as { message?: string; code?: number }));
      }
    } catch (err) {
      logger.error('Registration error:', err);
      setApiError(getErrorMessage(err as { message?: string; code?: number }));
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigation, prevData]);

  return (
    <AuthSelectionTemplate
      title="Any health concerns?"
      subtitle="Select all that apply to help us personalize your wellness plan."
      currentStep={7}
      totalSteps={7}
      onBack={() => navigation.goBack()}
      onContinue={handleSubmit(onSubmit)}
      loading={loading}
      loadingMessage="Registering..."
      error={apiError || errors.healthConcerns?.message || errors.customConcern?.message}
      onDismissError={() => {
        setApiError('');
      }}
    >
      <Controller
        control={control}
        name="healthConcerns"
        render={({ field: { onChange, value } }) => (
          <>
            {HEALTH_CONCERNS.map((option) => (
              <SelectableCard
                key={option.id}
                label={option.label}
                iconName={option.icon}
                isSelected={(value || []).includes(option.id)}
                onPress={() => handleToggleConcern(option.id, value || [], onChange)}
              />
            ))}
          </>
        )}
      />

      {(healthConcerns || []).includes('other') && (
        <OtherOptionInput
          control={control}
          name="customConcern"
          label="Describe your health concern"
          placeholder="Details..."
          error={errors.customConcern?.message}
          onChangeText={() => setApiError('')}
        />
      )}
    </AuthSelectionTemplate>
  );
};

export default memo(RegisterStep7Screen);

