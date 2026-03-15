import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { NeonButton } from '@shared/components/ui';
import { useGetAccount, useUpdateAccount } from '@features/account/hooks/useAccount';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MetricCard, GoalSelector, RestrictionSelector } from '../components';
import { useEditableHeader } from '../hooks/useEditableHeader';
import { parseRestrictions, formatRestrictions } from '../utils/accountUtils';

const healthSchema = yup.object().shape({
  height: yup.number().required('Height is required').min(50).max(250),
  weight: yup.number().required('Weight is required').min(20).max(300),
  restrictions: yup.array().of(yup.string()).default([]),
  goal: yup.string().required('Goal is required'),
});

export const HealthProfileScreen = () => {
  const { colors, isDark } = useTheme();
  
  const { data: userData, isLoading: loading } = useGetAccount();
  const { mutate: updateMe, isPending: updating } = useUpdateAccount();
  
  const { isEditing, setIsEditing } = useEditableHeader({ 
    colors,
    isUpdating: updating 
  });

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    resolver: yupResolver(healthSchema),
    defaultValues: {
      height: userData?.height || 170,
      weight: userData?.weight || 70,
      goal: userData?.fitnessObjective || '',
      restrictions: parseRestrictions(userData?.medicalRestrictions),
    },
  });

  const selectedGoal = watch('goal');
  const selectedRestrictions = watch('restrictions') as string[];

  useEffect(() => {
    if (userData) {
      reset({
        height: userData.height || 170,
        weight: userData.weight || 70,
        restrictions: parseRestrictions(userData.medicalRestrictions),
        goal: userData.fitnessObjective || '',
      });
    }
  }, [userData, reset]);

  const onSubmit = (formData: any) => {
    updateMe({
      healthProfile: {
        heightValue: formData.height,
        heightUnit: 'cm',
        weightValue: formData.weight,
        weightUnit: 'kg',
        restrictions: formatRestrictions(formData.restrictions),
        goals: [formData.goal],
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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

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
          </View>

          {isEditing && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <NeonButton
                title="Save Changes"
                onPress={handleSubmit(onSubmit)}
                loading={updating}
                style={styles.saveButton}
              />
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  halfWidth: { width: '48%' },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 14,
    marginLeft: 2,
  },
  saveButton: { marginTop: 8, height: 56 },
});
