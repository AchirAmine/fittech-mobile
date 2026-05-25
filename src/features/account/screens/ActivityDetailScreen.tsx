import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStackParamList } from '@navigation/AccountNavigator';
import { hexToRGBA } from '@shared/constants/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ActivityDetail'>;

export const ActivityDetailScreen: React.FC<Props> = ({ route }) => {
  const { colors } = useTheme();
  const { title, description, status, iconName, iconColor, iconBg, time } = route.params;

  const formattedDate = new Date(time).toLocaleString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName as any} size={40} color={iconColor} />
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

      {/* Date */}
      <View style={[styles.dateBadge, { backgroundColor: hexToRGBA(colors.primaryMid, 0.08) }]}>
        <Ionicons name="time-outline" size={14} color={colors.primaryMid} />
        <Text style={[styles.dateText, { color: colors.primaryMid }]}>{formattedDate}</Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Description */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DETAILS</Text>
      <Text style={[styles.description, { color: colors.textPrimary }]}>{description}</Text>

      {/* Status */}
      {status && (
        <>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>STATUS</Text>
          <View style={[styles.statusPill, { backgroundColor: iconBg }]}>
            <Text style={[styles.statusText, { color: iconColor }]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 28,
  },
  dateText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1.2,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 24,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
});
