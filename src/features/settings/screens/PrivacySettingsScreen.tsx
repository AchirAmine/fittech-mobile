import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, Text, ScrollView } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { usePrivacySettings, useUpdatePrivacySettings } from '@features/settings/hooks/useSettings';
import { AppScreen } from '@shared/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { Theme } from '@shared/constants/theme';
import { NeonButton } from '@shared/components/ui';

export const PrivacySettingsScreen = () => {
  const { colors, isDark } = useTheme();
  const { data, isLoading, error, refetch } = usePrivacySettings();
  const { mutate: updatePrefs, isPending, error: updateError, reset: resetUpdateError } = useUpdatePrivacySettings();
  const [success, setSuccess] = useState(false);

  const [shareProgressWithCoachByDefault, setShare] = useState(false);

  useEffect(() => {
    if (data) {
      setShare(data.shareProgressWithCoachByDefault ?? false);
    }
  }, [data]);

  const handleSave = () => {
    setSuccess(false);
    updatePrefs({ shareProgressWithCoachByDefault }, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  return (
    <AppScreen
      isLoading={isLoading}
      errorMessage={getErrorMessage(error || updateError)}
      successMessage={success ? 'Privacy settings saved successfully' : undefined}
      onDismissError={() => {
        if (error) refetch();
        if (updateError) resetUpdateError();
      }}
      onDismissSuccess={() => setSuccess(false)}
      contentContainerStyle={styles.container}
    >
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerDescription, { color: colors.textSecondary }]}>
            Manage how your data is shared. Your privacy is our priority, and you have full control over who sees your fitness journey.
          </Text>
        </View>

        <View style={[styles.switchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Share Progress with Coach</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Automatically share your progress tracking data with your active personal coach.
            </Text>
          </View>
          <Switch
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDark ? '#fff' : '#fff'}
            ios_backgroundColor={colors.border}
            onValueChange={setShare}
            value={shareProgressWithCoachByDefault}
          />
        </View>

        <View style={styles.footer}>
          <NeonButton
            title="Save Privacy Settings"
            onPress={handleSave}
            loading={isPending}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: Theme.Radius.lg,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  footer: { marginTop: 24 },
});
