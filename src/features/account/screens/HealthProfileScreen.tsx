import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, number, string, array, InferType } from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Input } from '@shared/components/ui';
import { GOALS, HEALTH_CONCERNS } from '@shared/constants/healthConstants';
import { useGetAccount, useUpdateAccount } from '@features/account/hooks/useAccount';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MetricCard, GoalSelector, RestrictionSelector, SaveButton } from '../components';
import { AppScreen } from '@shared/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { useEditableHeader } from '../hooks/useEditableHeader';
import { parseRestrictions, formatRestrictions } from '../utils/accountUtils';

const healthSchema = object().shape({
  height: number().required('Height is required').min(50).max(250),
  weight: number().required('Weight is required').min(20).max(300),
  restrictions: array().of(string()).default([]),
  goal: string().required('Goal is required'),
  otherGoalText: string().when('goal', {
    is: 'other',
    then: (schema) => schema.required('Please specify your goal'),
    otherwise: (schema) => schema.optional(),
  }),
  otherRestrictionText: string().optional(),
});

export const HealthProfileScreen = () => {
  const { colors, isDark } = useTheme();
  
  const { data: userData, isLoading: loading, error: fetchError, refetch } = useGetAccount();
  const { 
    mutate: updateMe, 
    isPending: updating,
    error: updateError,
    reset: resetMutation
  } = useUpdateAccount();
  
  const { isEditing, setIsEditing } = useEditableHeader({ 
    colors,
    isUpdating: updating 
  });

  const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(healthSchema),
    defaultValues: {
      height: 170,
      weight: 70,
      goal: '',
      otherGoalText: '',
      restrictions: [] as string[],
      otherRestrictionText: '',
    },
  });

  const selectedGoal = watch('goal');
  const selectedRestrictions = watch('restrictions') as string[];

  useEffect(() => {
    if (userData) {
      const goalExists = GOALS.some(g => g.id === userData.fitnessObjective);
      const goalId = goalExists ? userData.fitnessObjective : (userData.fitnessObjective ? 'other' : '');
      const otherGoalText = goalExists ? '' : (userData.fitnessObjective || '');

      const rawRestrictions = parseRestrictions(userData.medicalRestrictions);
      const standardIds = HEALTH_CONCERNS.map(c => c.id).filter(id => id !== 'other' && id !== 'none');
      const selectedIds = rawRestrictions.filter(r => standardIds.includes(r));
      const customRestrictions = rawRestrictions.filter(r => !standardIds.includes(r) && r !== 'none');
      
      const hasOther = customRestrictions.length > 0 || rawRestrictions.includes('other');
      if (hasOther && !selectedIds.includes('other')) {
        selectedIds.push('other');
      }
      
      const otherText = customRestrictions.join(', ');

      reset({
        height: userData.height || 170,
        weight: userData.weight || 70,
        restrictions: selectedIds,
        goal: goalId as string,
        otherGoalText,
        otherRestrictionText: otherText,
      });
    }
  }, [userData, reset]);

  const onSubmit = (formData: InferType<typeof healthSchema>) => {
    const finalGoal = formData.goal === 'other' ? formData.otherGoalText : formData.goal;
    
    let finalRestrictions = (formData.restrictions || []).filter((r): r is string => r !== undefined && r !== 'other');
    if (formData.restrictions?.includes('other') && formData.otherRestrictionText) {
      finalRestrictions.push(formData.otherRestrictionText);
    }

    updateMe({
      healthProfile: {
        heightValue: formData.height,
        heightUnit: 'cm',
        weightValue: formData.weight,
        weightUnit: 'kg',
        restrictions: formatRestrictions(finalRestrictions),
        goals: [finalGoal as string],
      },
    }, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onToggleRestriction = (id: string) => {
    if (!isEditing) return;
    const current = selectedRestrictions || [];
    if (id === 'none') {
      setValue('restrictions', current.includes('none') ? [] : ['none']);
      return;
    }
    const without = current.filter(r => r !== 'none');
    setValue('restrictions', without.includes(id) ? without.filter(r => r !== id) : [...without, id]);
  };

  const handleDismissError = () => {
    if (updateError) resetMutation();
    if (fetchError) refetch();
  };

  return (
    <AppScreen
      isLoading={loading}
      errorMessage={getErrorMessage(fetchError || updateError)}
      onDismissError={handleDismissError}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.form}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.metricsRow}>
          <Controller
            control={control}
            name="height"
            render={({ field: { onChange, value } }) => (
              <View style={styles.halfWidth}>
                <MetricCard
                  label="Height"
                  value={value}
                  unit="cm"
                  icon="resize-outline"
                  onChange={val => onChange(Number(val) || 0)}
                  colors={colors}
                  isDark={isDark}
                  isEditing={isEditing}
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => (
              <View style={styles.halfWidth}>
                <MetricCard
                  label="Weight"
                  value={value}
                  unit="kg"
                  icon="speedometer-outline"
                  onChange={val => onChange(Number(val) || 0)}
                  colors={colors}
                  isDark={isDark}
                  isEditing={isEditing}
                />
              </View>
            )}
          />
        </Animated.View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryMid }]}>Main Fitness Goal</Text>
          <GoalSelector
            selectedGoal={selectedGoal}
            isEditing={isEditing}
            onSelect={id => setValue('goal', id)}
            colors={colors}
            isDark={isDark}
          />
          {selectedGoal === 'other' && (
            <Animated.View entering={FadeInDown} style={styles.otherInput}>
              {isEditing ? (
                <Controller
                  control={control}
                  name="otherGoalText"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Please specify your goal"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.otherGoalText?.message}
                      icon="create-outline"
                      labelBg={isDark ? colors.background : '#fff'}
                    />
                  )}
                />
              ) : (
                <View style={[styles.customValueRow, { backgroundColor: colors.cardSecondary }]}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                  <Text style={[styles.customValueText, { color: colors.textPrimary }]}>
                    {watch('otherGoalText') || 'Not specified'}
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryMid }]}>Medical Restrictions</Text>
          <RestrictionSelector
            selectedRestrictions={selectedRestrictions}
            isEditing={isEditing}
            onToggle={onToggleRestriction}
            colors={colors}
            isDark={isDark}
          />
          {selectedRestrictions?.includes('other') && (
            <Animated.View entering={FadeInDown} style={styles.otherInput}>
              {isEditing ? (
                <Controller
                  control={control}
                  name="otherRestrictionText"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Please specify your medical concerns"
                      value={value || ''}
                      onChangeText={onChange}
                      icon="medical-outline"
                      labelBg={isDark ? colors.background : '#fff'}
                    />
                  )}
                />
              ) : (
                <View style={[styles.customValueRow, { backgroundColor: colors.cardSecondary }]}>
                  <Ionicons name="medical-outline" size={18} color={colors.primary} />
                  <Text style={[styles.customValueText, { color: colors.textPrimary }]}>
                    {watch('otherRestrictionText') || 'Not specified'}
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
        </View>

        <SaveButton
          isEditing={isEditing}
          onPress={handleSubmit(onSubmit)}
          isLoading={updating}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  form: { gap: 20, paddingTop: 20 },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: { width: '48%' },
  section: { marginBottom: 8 },
  otherInput: { marginTop: 12, paddingHorizontal: 2 },
  customValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginTop: 4,
  },
  customValueText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 14,
    marginLeft: 2,
  },
});
