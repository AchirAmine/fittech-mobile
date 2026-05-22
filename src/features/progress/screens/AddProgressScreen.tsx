import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Input } from '@shared/components';
import { useCreateProgress, useUpdateProgress } from '../hooks/useProgress';
import { useGetActiveCoaching } from '../../personal-coaching/hooks/useCoaching';
import { CreateProgressPayload } from '../types/progress.types';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface RouteParams {
  progressId?: string;
  initialData?: {
    weightKg: number;
    heightCm?: number;
    waistCm?: number;
    chestCm?: number;
    armCm?: number;
    legCm?: number;
    notes?: string;
    progressDate: string;
    isSharedWithCoach: boolean;
  };
}

const todayStr = () => new Date().toISOString().split('T')[0];

export const AddProgressScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { progressId, initialData } = (route.params as RouteParams) ?? {};
  const isEditing = !!progressId;

  const [weightKg, setWeightKg] = useState(initialData?.weightKg?.toString() ?? '');
  const [heightCm, setHeightCm] = useState(initialData?.heightCm?.toString() ?? '');
  const [waistCm, setWaistCm] = useState(initialData?.waistCm?.toString() ?? '');
  const [chestCm, setChestCm] = useState(initialData?.chestCm?.toString() ?? '');
  const [armCm, setArmCm] = useState(initialData?.armCm?.toString() ?? '');
  const [legCm, setLegCm] = useState(initialData?.legCm?.toString() ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [progressDate, setProgressDate] = useState(initialData?.progressDate ?? todayStr());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isShared, setIsShared] = useState(initialData?.isSharedWithCoach ?? false);
  const [showMeasurements, setShowMeasurements] = useState(
    !!(initialData?.waistCm || initialData?.chestCm || initialData?.armCm || initialData?.legCm),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateProgress();
  const updateMutation = useUpdateProgress();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const { data: activeCoachData } = useGetActiveCoaching();
  const hasActiveCoach = !!activeCoachData;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!weightKg.trim()) errs.weightKg = 'Weight is required';
    else if (parseFloat(weightKg) <= 0) errs.weightKg = 'Weight must be greater than 0';
    if (heightCm && parseFloat(heightCm) <= 0) errs.heightCm = 'Height must be greater than 0';
    if (!progressDate) errs.progressDate = 'Date is required';
    else if (new Date(progressDate) > new Date()) errs.progressDate = 'Progress date cannot be in the future';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDateSelect = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setProgressDate(`${year}-${month}-${day}`);
      setErrors((e) => ({ ...e, progressDate: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: CreateProgressPayload = {
      weightKg: parseFloat(weightKg),
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      waistCm: waistCm ? parseFloat(waistCm) : undefined,
      chestCm: chestCm ? parseFloat(chestCm) : undefined,
      armCm: armCm ? parseFloat(armCm) : undefined,
      legCm: legCm ? parseFloat(legCm) : undefined,
      notes: notes.trim() || undefined,
      progressDate,
      isSharedWithCoach: isShared,
    };

    try {
      if (isEditing && progressId) {
        await updateMutation.mutateAsync({ progressId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to save progress record.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <SectionCard title="Main Stats" icon="barbell-outline" colors={colors} isDark={isDark}>
            <Input
              label="Weight (kg) *"
              placeholder="e.g. 78.5"
              value={weightKg}
              onChangeText={(t) => { setWeightKg(t); setErrors((e) => ({ ...e, weightKg: '' })); }}
              keyboardType="decimal-pad"
              error={errors.weightKg}
              icon="scale-outline"
              labelBg={isDark ? colors.card : '#fff'}
              containerStyle={styles.inputSpacing}
            />
            <Input
              label="Height (cm)"
              placeholder="e.g. 175"
              value={heightCm}
              onChangeText={(t) => { setHeightCm(t); setErrors((e) => ({ ...e, heightCm: '' })); }}
              keyboardType="decimal-pad"
              error={errors.heightCm}
              icon="resize-outline"
              labelBg={isDark ? colors.card : '#fff'}
              containerStyle={styles.inputSpacing}
            />
            {heightCm && weightKg ? (
              <View style={[styles.bmiPreview, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}>
                <Ionicons name="information-circle-outline" size={16} color={colors.primaryMid} />
                <Text style={[styles.bmiPreviewText, { color: colors.primaryMid }]}>
                  BMI will be calculated by the server
                </Text>
              </View>
            ) : null}
          </SectionCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <SectionCard title="Progress Date" icon="calendar-outline" colors={colors} isDark={isDark}>
            <Input
              label="Date *"
              placeholder="YYYY-MM-DD"
              value={progressDate}
              onChangeText={(t) => { setProgressDate(t); setErrors((e) => ({ ...e, progressDate: '' })); }}
              error={errors.progressDate}
              icon="calendar-outline"
              onIconPress={() => setShowDatePicker(true)}
              labelBg={isDark ? colors.card : '#fff'}
              containerStyle={styles.inputSpacing}
            />
            {showDatePicker && (
              <DateTimePicker
                value={new Date(progressDate) && !isNaN(new Date(progressDate).getTime()) ? new Date(progressDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateSelect}
                maximumDate={new Date()}
              />
            )}
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              Format: YYYY-MM-DD — cannot be in the future (tap calendar icon to select)
            </Text>
          </SectionCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <SectionCard
            title="Body Measurements"
            icon="body-outline"
            colors={colors}
            isDark={isDark}
            rightAction={
              <TouchableOpacity onPress={() => setShowMeasurements((v) => !v)}>
                <Text style={[styles.toggleText, { color: colors.primaryMid }]}>
                  {showMeasurements ? 'Hide' : 'Add'}
                </Text>
              </TouchableOpacity>
            }
          >
            {showMeasurements && (
              <>
                <Text style={[styles.measureHint, { color: colors.textMuted }]}>
                  All measurements in centimeters (optional)
                </Text>
                <View style={styles.measureGrid}>
                  <View style={styles.measureCell}>
                    <Input label="Waist" placeholder="82" value={waistCm} onChangeText={setWaistCm} keyboardType="decimal-pad" icon="resize-outline" labelBg={isDark ? colors.card : '#fff'} containerStyle={styles.inputSpacing} />
                  </View>
                  <View style={styles.measureCell}>
                    <Input label="Chest" placeholder="95" value={chestCm} onChangeText={setChestCm} keyboardType="decimal-pad" icon="resize-outline" labelBg={isDark ? colors.card : '#fff'} containerStyle={styles.inputSpacing} />
                  </View>
                  <View style={styles.measureCell}>
                    <Input label="Arm" placeholder="34" value={armCm} onChangeText={setArmCm} keyboardType="decimal-pad" icon="resize-outline" labelBg={isDark ? colors.card : '#fff'} containerStyle={styles.inputSpacing} />
                  </View>
                  <View style={styles.measureCell}>
                    <Input label="Leg" placeholder="55" value={legCm} onChangeText={setLegCm} keyboardType="decimal-pad" icon="resize-outline" labelBg={isDark ? colors.card : '#fff'} containerStyle={styles.inputSpacing} />
                  </View>
                </View>
              </>
            )}
          </SectionCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <SectionCard title="Notes" icon="create-outline" colors={colors} isDark={isDark}>
            <Input
              label="Notes (optional)"
              placeholder="How are you feeling? Any observations..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              icon="create-outline"
              labelBg={isDark ? colors.card : '#fff'}
              containerStyle={styles.inputSpacing}
            />
          </SectionCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View
            style={[
              styles.shareCard,
              {
                backgroundColor: colors.card,
                shadowColor: colors.textPrimary,
                opacity: hasActiveCoach ? 1 : 0.6,
              },
            ]}
          >
            <View style={[styles.shareIcon, { backgroundColor: hexToRGBA(isShared ? colors.success : colors.textMuted, 0.12) }]}>
              <Ionicons name={isShared ? 'eye-outline' : 'eye-off-outline'} size={24} color={isShared ? colors.success : colors.textMuted} />
            </View>
            <View style={styles.shareText}>
              <Text style={[styles.shareTitle, { color: colors.textPrimary }]}>Share with Coach</Text>
              <Text style={[styles.shareSub, { color: colors.textSecondary }]}>
                {!hasActiveCoach
                  ? "You don't have an active personal coach"
                  : isShared
                    ? 'Your coach can see this record'
                    : 'This record is private'}
              </Text>
            </View>
            <Switch
              value={isShared}
              onValueChange={setIsShared}
              trackColor={{ false: hexToRGBA(colors.textMuted, 0.3), true: hexToRGBA(colors.success, 0.5) }}
              thumbColor={isShared ? colors.success : colors.textMuted}
              disabled={!hasActiveCoach}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1, shadowColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name={isEditing ? 'checkmark-circle-outline' : 'add-circle-outline'} size={24} color="#fff" />
                <Text style={styles.submitText}>
                  {isEditing ? 'Save Changes' : 'Add Progress'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SectionCard: React.FC<{
  title: string;
  icon: string;
  colors: any;
  isDark: boolean;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}> = ({ title, icon, colors, isDark, children, rightAction }) => (
  <View
    style={[
      cardStyles.container,
      {
        backgroundColor: colors.card,
        shadowColor: colors.textPrimary,
      },
    ]}
  >
    <View style={cardStyles.header}>
      <View style={cardStyles.titleRow}>
        <Ionicons name={icon as any} size={20} color={colors.primaryMid} />
        <Text style={[cardStyles.title, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {rightAction}
    </View>
    {children}
  </View>
);

const cardStyles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
});

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  inputSpacing: { marginBottom: 16 },
  hint: { fontSize: 12, fontFamily: Theme.Typography.fontFamily.medium, marginTop: 4 },
  measureHint: { fontSize: 12, fontFamily: Theme.Typography.fontFamily.medium, marginBottom: 16 },
  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  measureCell: { width: '48%' },
  bmiPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  bmiPreviewText: { fontSize: 12, fontFamily: Theme.Typography.fontFamily.medium },
  toggleText: { fontSize: 14, fontFamily: Theme.Typography.fontFamily.bold },
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  shareIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  shareText: { flex: 1 },
  shareTitle: { fontSize: 16, fontFamily: Theme.Typography.fontFamily.bold, marginBottom: 4 },
  shareSub: { fontSize: 13, fontFamily: Theme.Typography.fontFamily.medium, lineHeight: 18 },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  submitText: { fontSize: 16, fontFamily: Theme.Typography.fontFamily.bold, color: '#fff' },
});
