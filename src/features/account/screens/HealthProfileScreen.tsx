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
import { GOALS, HEALTH_CONCERNS, ACTIVITIES } from '@shared/constants/healthConstants';
import { useGetAccount, useUpdateAccount } from '@features/account/hooks/useAccount';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MetricCard, GoalSelector, RestrictionSelector, ActivitySelector, SaveButton } from '../components';
import { AppScreen } from '@shared/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { useEditableHeader } from '../hooks/useEditableHeader';
import { parseRestrictions, formatRestrictions } from '../utils/accountUtils';
const healthSchema = object().shape({
  height: number().required('Height is required').min(50).max(250),
  weight: number().required('Weight is required').min(20).max(300),
  restrictions: array().of(string()).default([]),
  goals: array().of(string()).min(1, 'At least one goal is required').default([]),
  otherGoalText: string().when('goals', {
    is: (goals: string[]) => goals?.includes('other'),
    then: (schema) => schema.required('Please specify your goal'),
    otherwise: (schema) => schema.optional(),
  }),
  otherRestrictionText: string().optional(),
  activities: array().of(string()).default([]),
  otherActivityText: string().optional(),
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
      goals: [] as string[],
      otherGoalText: '',
      restrictions: [] as string[],
      otherRestrictionText: '',
      activities: [] as string[],
      otherActivityText: '',
    },
  });
  const selectedGoals = watch('goals') as string[];
  const selectedRestrictions = watch('restrictions') as string[];
  const selectedActivities = watch('activities') as string[];
  useEffect(() => {
    if (userData) {
      const rawGoals = Array.isArray(userData.fitnessObjective) 
        ? userData.fitnessObjective 
        : (userData.fitnessObjective ? [userData.fitnessObjective] : []);
      const standardGoalIds = GOALS.map(g => g.id).filter(id => id !== 'other');
      const selectedGoalIds = rawGoals.filter(g => standardGoalIds.includes(g));
      const customGoalInputs = rawGoals.filter(g => !standardGoalIds.includes(g));
      const hasOtherGoal = customGoalInputs.length > 0;
      if (hasOtherGoal && !selectedGoalIds.includes('other')) {
        selectedGoalIds.push('other');
      }
      const otherGoalText = customGoalInputs.join(', ');
      const rawRestrictions = parseRestrictions(userData.medicalRestrictions || '');
      const standardRestrictionIds = HEALTH_CONCERNS.map(c => c.id).filter(id => id !== 'other' && id !== 'none');
      const standardActivityIds = ACTIVITIES.map(a => a.id).filter(id => id !== 'other');
      const selectedRestrictionIds = rawRestrictions.filter(r => standardRestrictionIds.includes(r));
      const selectedActivityIds = rawRestrictions.filter(r => standardActivityIds.includes(r));
      const customInputs = rawRestrictions.filter(r => !standardRestrictionIds.includes(r) && !standardActivityIds.includes(r) && r !== 'none');
      let otherRestrictionText = '';
      let otherActivityText = '';
      customInputs.forEach(input => {
        if (input.startsWith('Activity: ')) {
          otherActivityText = input.replace('Activity: ', '');
          if (!selectedActivityIds.includes('other')) selectedActivityIds.push('other');
        } else if (input.startsWith('Restriction: ')) {
          otherRestrictionText = input.replace('Restriction: ', '');
          if (!selectedRestrictionIds.includes('other')) selectedRestrictionIds.push('other');
        } else if (input.startsWith('Other: ')) {
          otherActivityText = input.replace('Other: ', '');
          if (!selectedActivityIds.includes('other')) selectedActivityIds.push('other');
        } else {
          otherRestrictionText = input;
          if (!selectedRestrictionIds.includes('other')) selectedRestrictionIds.push('other');
        }
      });
      reset({
        height: userData.height || 170,
        weight: userData.weight || 70,
        restrictions: selectedRestrictionIds,
        activities: selectedActivityIds,
        goals: selectedGoalIds,
        otherGoalText,
        otherRestrictionText,
        otherActivityText,
      });
    }
  }, [userData, reset]);
  const onSubmit = (formData: InferType<typeof healthSchema>) => {
    let finalGoals = (formData.goals || []).filter((g): g is string => g !== undefined && g !== 'other');
    if (formData.goals?.includes('other') && formData.otherGoalText) {
      finalGoals.push(formData.otherGoalText);
    }
    let finalRestrictions = (formData.restrictions || []).filter((r): r is string => r !== undefined && r !== 'other');
    if (formData.restrictions?.includes('other') && formData.otherRestrictionText) {
      finalRestrictions.push(`Restriction: ${formData.otherRestrictionText}`);
    }
    let finalActivities = (formData.activities || []).filter((a): a is string => a !== undefined && a !== 'other');
    if (formData.activities?.includes('other') && formData.otherActivityText) {
      finalActivities.push(`Activity: ${formData.otherActivityText}`);
    }
    const mergedRestrictionsAndActivities = [...finalActivities, ...finalRestrictions];
    updateMe({
      healthProfile: {
        heightValue: formData.height,
        heightUnit: 'cm',
        weightValue: formData.weight,
        weightUnit: 'kg',
        restrictions: formatRestrictions(mergedRestrictionsAndActivities),
        goals: finalGoals,
      },
    }, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };
  const onToggleGoal = (id: string) => {
    if (!isEditing) return;
    const current = watch('goals') || [];
    setValue('goals', current.includes(id) ? current.filter(g => g !== id) : [...current, id]);
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
  const onToggleActivity = (id: string) => {
    if (!isEditing) return;
    const current = selectedActivities || [];
    setValue('activities', current.includes(id) ? current.filter(a => a !== id) : [...current, id]);
  };
  const handleDismissError = () => {
    if (updateError) resetMutation();
    if (fetchError) refetch();
  };
  return (
    <AppScreen
      safeArea={false}
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
            selectedGoals={selectedGoals}
            isEditing={isEditing}
            onToggle={onToggleGoal}
            colors={colors}
            isDark={isDark}
            otherValue={watch('otherGoalText')}
            onChangeOtherText={text => setValue('otherGoalText', text)}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryMid }]}>Medical Restrictions</Text>
          <RestrictionSelector
            selectedRestrictions={selectedRestrictions}
            isEditing={isEditing}
            onToggle={onToggleRestriction}
            colors={colors}
            isDark={isDark}
            otherValue={watch('otherRestrictionText')}
            onChangeOtherText={text => setValue('otherRestrictionText', text)}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primaryMid }]}>Preferred Activities</Text>
          <ActivitySelector
            selectedActivities={selectedActivities}
            isEditing={isEditing}
            onToggle={onToggleActivity}
            colors={colors}
            isDark={isDark}
            otherValue={watch('otherActivityText')}
            onChangeOtherText={text => setValue('otherActivityText', text)}
          />
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
  sectionTitle: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 14,
    marginLeft: 2,
  },
});
