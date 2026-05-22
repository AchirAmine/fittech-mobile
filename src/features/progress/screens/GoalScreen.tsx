import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@shared/components';
import { useCurrentGoal, useCreateGoal, useUpdateGoal, useUpdateGoalStatus } from '../hooks/useGoal';
import { GoalType, CreateGoalPayload, GOAL_TYPE_LABELS, GOAL_TYPE_ICONS } from '../types/progress.types';
import { GoalProgressCard } from '../components/GoalProgressCard';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const GOAL_OPTIONS: GoalType[] = [
  'LOSE_WEIGHT',
  'GAIN_MUSCLE',
  'MAINTAIN_WEIGHT',
  'IMPROVE_ENDURANCE',
  'IMPROVE_FLEXIBILITY',
  'GENERAL_FITNESS',
];

const todayStr = () => new Date().toISOString().split('T')[0];

export const GoalScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  const { data: goalResp, isLoading: isGoalLoading, refetch } = useCurrentGoal();
  const currentGoal = goalResp?.data ?? null;

  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();
  const statusMutation = useUpdateGoalStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState<GoalType>('LOSE_WEIGHT');
  const [startWeight, setStartWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [startDate, setStartDate] = useState(todayStr());
  const [targetDate, setTargetDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentGoal && !isEditing) {
      setSelectedType(currentGoal.goalType);
      setStartWeight(currentGoal.startWeightKg?.toString() || '');
      setTargetWeight(currentGoal.targetWeightKg?.toString() || '');
      setStartDate(currentGoal.startDate.split('T')[0]);
      setTargetDate(currentGoal.targetDate?.split('T')[0] || '');
    }
  }, [currentGoal, isEditing]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (['LOSE_WEIGHT', 'GAIN_MUSCLE'].includes(selectedType)) {
      if (!startWeight) errs.startWeight = 'Start weight is required';
      if (!targetWeight) errs.targetWeight = 'Target weight is required';
    }
    if (!startDate) errs.startDate = 'Start date is required';
    if (targetDate && new Date(targetDate) < new Date(startDate)) {
      errs.targetDate = 'Target date must be after start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (currentGoal && isEditing) {
        await updateMutation.mutateAsync({
          goalId: currentGoal.id,
          payload: {
            goalType: selectedType,
            targetWeightKg: targetWeight ? parseFloat(targetWeight) : undefined,
            targetDate: targetDate || undefined,
          },
        });
        setIsEditing(false);
      } else {
        const payload: CreateGoalPayload = {
          goalType: selectedType,
          startWeightKg: startWeight ? parseFloat(startWeight) : undefined,
          targetWeightKg: targetWeight ? parseFloat(targetWeight) : undefined,
          startDate,
          targetDate: targetDate || undefined,
        };
        await createMutation.mutateAsync(payload);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save goal.');
    }
  };

  const handleUpdateStatus = (status: 'COMPLETED' | 'CANCELLED') => {
    if (!currentGoal) return;
    Alert.alert(
      `Mark Goal as ${status}?`,
      `Are you sure you want to mark this goal as ${status.toLowerCase()}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await statusMutation.mutateAsync({ goalId: currentGoal.id, status });
          },
        },
      ]
    );
  };

  if (isGoalLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryMid} />
      </View>
    );
  }

  const isFormActive = !currentGoal || isEditing;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {!isFormActive && currentGoal && (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.viewMode}>
          <GoalProgressCard goal={currentGoal} />
          
          <View style={styles.actionsBox}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil-outline" size={18} color={colors.primaryMid} />
              <Text style={[styles.actionText, { color: colors.primaryMid }]}>Edit Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: hexToRGBA(colors.success, 0.1) }]}
              onPress={() => handleUpdateStatus('COMPLETED')}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-done-outline" size={18} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.success }]}>Mark Completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: hexToRGBA(colors.error, 0.1) }]}
              onPress={() => handleUpdateStatus('CANCELLED')}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={18} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Cancel Goal</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {isFormActive && (
        <Animated.View entering={FadeInUp.duration(500)} style={styles.formMode}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Select Goal Type</Text>
          <View style={styles.typesGrid}>
            {GOAL_OPTIONS.map((type) => {
              const isSelected = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: isSelected ? colors.primaryMid : colors.card,
                      shadowColor: colors.textPrimary,
                    },
                  ]}
                  onPress={() => setSelectedType(type)}
                  disabled={isEditing}
                  activeOpacity={0.8}
                >
                  <Ionicons name={GOAL_TYPE_ICONS[type] as any} size={28} color={isSelected ? '#fff' : colors.primaryMid} />
                  <Text style={[styles.typeText, { color: isSelected ? '#fff' : colors.textPrimary }]}>
                    {GOAL_TYPE_LABELS[type]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.detailsBox, { backgroundColor: colors.card, shadowColor: colors.textPrimary }]}>
            {['LOSE_WEIGHT', 'GAIN_MUSCLE'].includes(selectedType) && (
              <View style={styles.row}>
                <View style={styles.flexHalf}>
                  <Input
                    label="Start Weight (kg)"
                    value={startWeight}
                    onChangeText={setStartWeight}
                    keyboardType="decimal-pad"
                    editable={!isEditing}
                    error={errors.startWeight}
                    labelBg={isDark ? colors.card : '#fff'}
                    containerStyle={styles.inputSpacing}
                  />
                </View>
                <View style={styles.flexHalf}>
                  <Input
                    label="Target Weight (kg)"
                    value={targetWeight}
                    onChangeText={setTargetWeight}
                    keyboardType="decimal-pad"
                    error={errors.targetWeight}
                    labelBg={isDark ? colors.card : '#fff'}
                    containerStyle={styles.inputSpacing}
                  />
                </View>
              </View>
            )}

            <View style={styles.row}>
              <View style={styles.flexHalf}>
                <Input
                  label="Start Date"
                  value={startDate}
                  onChangeText={setStartDate}
                  editable={!isEditing}
                  error={errors.startDate}
                  placeholder="YYYY-MM-DD"
                  labelBg={isDark ? colors.card : '#fff'}
                  containerStyle={styles.inputSpacing}
                />
              </View>
              <View style={styles.flexHalf}>
                <Input
                  label="Target Date"
                  value={targetDate}
                  onChangeText={setTargetDate}
                  error={errors.targetDate}
                  placeholder="Optional"
                  labelBg={isDark ? colors.card : '#fff'}
                  containerStyle={styles.inputSpacing}
                />
              </View>
            </View>
          </View>

          <View style={styles.formActions}>
            {isEditing && (
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={[styles.btnText, { color: colors.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btn, styles.saveBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
              onPress={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              activeOpacity={0.8}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={[styles.btnText, { color: '#fff' }]}>Save Goal</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  inputSpacing: { marginBottom: 16 },
  viewMode: { gap: 24 },
  actionsBox: { gap: 12 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  formMode: {},
  sectionTitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  typeText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
  },
  detailsBox: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', gap: 10 },
  flexHalf: { flex: 1 },
  formActions: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtn: { borderWidth: 1 },
  saveBtn: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  btnText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
