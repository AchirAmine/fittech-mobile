import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { Modal } from '@shared/components/ui/Modal';
import { SubscriptionPlan } from '@appTypes/index';

interface SubscriptionConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  onConfirm: () => void;
}

export const SubscriptionConfirmationModal: React.FC<SubscriptionConfirmationModalProps> = ({
  visible,
  onClose,
  plan,
  onConfirm,
}) => {
  const { colors, isDark } = useTheme();

  if (!plan) return null;

  const rows = [
    ...plan.features.map(f => ({
      icon: f.icon,
      label: f.label,
      value: f.details.join(' · '),
      highlight: false,
    })),
    {
      icon: '📅',
      label: 'Duration',
      value: `${plan.duration} Days`,
      highlight: false,
    },
    {
      icon: '💰',
      label: 'Price',
      value: `${plan.price.toLocaleString()} ${plan.currency}`,
      highlight: true,
    },
  ];

  return (
    <Modal visible={visible} onClose={onClose} contentStyle={styles.modalContent} hideHeader={true}>

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.cardSecondary }]}>
          <Ionicons name="fitness-outline" size={24} color={colors.primaryMid} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.planLabel, { color: colors.textMuted }]}>SUBSCRIPTION</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{plan.title}</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: colors.cardSecondary }]}
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Details Card */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.cardSecondary, borderColor: colors.border }]}>
        {rows.map((row, index) => (
          <View
            key={index}
            style={[
              styles.detailRow,
              index < rows.length - 1 && styles.borderBottom,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.labelContainer}>
              <Text style={styles.emoji}>{row.icon}</Text>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{row.label}</Text>
            </View>
            <Text
              style={[
                styles.value,
                { color: row.highlight ? colors.primaryMid : colors.textSecondary },
                row.highlight && styles.highlightValue,
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>


      {/* Confirm Button */}
      <LinearGradient
        colors={[colors.primaryDark, colors.primaryMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.confirmButtonGradient}
      >
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={onConfirm}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
          <Text style={[styles.confirmButtonText, { color: colors.white }]}>
            Confirm & Join — {plan.price.toLocaleString()} {plan.currency}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  planLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
  value: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  highlightValue: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  confirmButtonGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmButton: {
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
