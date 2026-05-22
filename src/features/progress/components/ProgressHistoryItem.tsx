import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { ProgressRecord, getBMICategory } from '../types/progress.types';

interface ProgressHistoryItemProps {
  record: ProgressRecord;
  onEdit: (record: ProgressRecord) => void;
  onDelete: (id: string) => void;
  onViewFeedback?: (record: ProgressRecord) => void;
  isDeleting?: boolean;
}

const BMI_COLORS: Record<string, string> = {
  underweight: '#60B8FF',
  normal: '#00C897',
  overweight: '#F4A800',
  obese: '#FF3B30',
};

export const ProgressHistoryItem: React.FC<ProgressHistoryItemProps> = ({
  record,
  onEdit,
  onDelete,
  onViewFeedback,
  isDeleting,
}) => {
  const { colors, isDark } = useTheme();
  const bmiCategory = record.bmi ? getBMICategory(record.bmi) : null;
  const bmiColor = bmiCategory ? BMI_COLORS[bmiCategory] : colors.textMuted;

  const formattedDate = new Date(record.progressDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this progress record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(record.id) },
      ],
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          shadowColor: colors.textPrimary,
          opacity: isDeleting ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.dateBlock}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.date, { color: colors.textSecondary }]}>{formattedDate}</Text>
          {record.isSharedWithCoach && (
            <View style={[styles.sharedBadge, { backgroundColor: hexToRGBA(colors.success, 0.12) }]}>
              <Ionicons name="eye-outline" size={12} color={colors.success} />
              <Text style={[styles.sharedText, { color: colors.success }]}>Shared</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onEdit(record)}
            style={[styles.actionBtn, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.primaryMid} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.actionBtn, { backgroundColor: hexToRGBA(colors.error, 0.1) }]}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <MaterialCommunityIcons name="weight-kilogram" size={20} color={colors.primaryMid} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {record.weightKg} <Text style={[styles.statUnit, { color: colors.textMuted }]}>kg</Text>
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Weight</Text>
        </View>

        {record.bmi && (
          <View style={[styles.divider, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.08) : hexToRGBA(colors.black, 0.06) }]} />
        )}

        {record.bmi && (
          <View style={styles.stat}>
            <MaterialCommunityIcons name="human" size={20} color={bmiColor} />
            <Text style={[styles.statValue, { color: bmiColor }]}>
              {record.bmi.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>BMI</Text>
          </View>
        )}

        {record.waistCm && (
          <>
            <View style={[styles.divider, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.08) : hexToRGBA(colors.black, 0.06) }]} />
            <View style={styles.stat}>
              <Ionicons name="body-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {record.waistCm} <Text style={[styles.statUnit, { color: colors.textMuted }]}>cm</Text>
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Waist</Text>
            </View>
          </>
        )}
      </View>

      {record.notes && (
        <View style={[styles.notesBox, { backgroundColor: isDark ? hexToRGBA(colors.white, 0.04) : hexToRGBA(colors.black, 0.03) }]}>
          <Text style={[styles.notesText, { color: colors.textSecondary }]} numberOfLines={2}>
            {record.notes}
          </Text>
        </View>
      )}

      {record.isSharedWithCoach && onViewFeedback && (
        <TouchableOpacity
          style={[styles.feedbackBtn, { borderColor: isDark ? hexToRGBA(colors.white, 0.08) : hexToRGBA(colors.black, 0.06) }]}
          onPress={() => onViewFeedback(record)}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primaryMid} />
          <Text style={[styles.feedbackBtnText, { color: colors.primaryMid }]}>
            {record.feedback && record.feedback.length > 0
              ? `View Feedback (${record.feedback.length})`
              : 'View Coach Feedback'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sharedText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginTop: 2,
  },
  statUnit: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  notesBox: {
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  notesText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 20,
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  feedbackBtnText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
