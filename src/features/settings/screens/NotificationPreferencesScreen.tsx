import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, Text, ScrollView } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@features/settings/hooks/useSettings';
import { AppScreen } from '@shared/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { Theme } from '@shared/constants/theme';
import { NeonButton } from '@shared/components/ui';

export const NotificationPreferencesScreen = () => {
  const { colors, isDark } = useTheme();
  const { data, isLoading, error, refetch } = useNotificationPreferences();
  const { mutate: updatePrefs, isPending, error: updateError, reset: resetUpdateError } = useUpdateNotificationPreferences();
  const [success, setSuccess] = useState(false);

  const [prefs, setPrefs] = useState({
    courseReminderEnabled: true,
    subscriptionExpirationEnabled: true,
    paymentNotificationEnabled: true,
    coachingNotificationEnabled: true,
    promotionNotificationEnabled: true,
  });

  useEffect(() => {
    if (data) {
      setPrefs({
        courseReminderEnabled: data.courseReminderEnabled ?? true,
        subscriptionExpirationEnabled: data.subscriptionExpirationEnabled ?? true,
        paymentNotificationEnabled: data.paymentNotificationEnabled ?? true,
        coachingNotificationEnabled: data.coachingNotificationEnabled ?? true,
        promotionNotificationEnabled: data.promotionNotificationEnabled ?? true,
      });
    }
  }, [data]);

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isAllEnabled = Object.values(prefs).every(Boolean);

  const handleToggleAll = () => {
    const newValue = !isAllEnabled;
    setPrefs({
      courseReminderEnabled: newValue,
      subscriptionExpirationEnabled: newValue,
      paymentNotificationEnabled: newValue,
      coachingNotificationEnabled: newValue,
      promotionNotificationEnabled: newValue,
    });
  };

  const handleSave = () => {
    setSuccess(false);
    updatePrefs(prefs, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  const renderSwitch = (title: string, description: string, key: keyof typeof prefs) => (
    <View style={[styles.switchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={isDark ? '#fff' : '#fff'}
        ios_backgroundColor={colors.border}
        onValueChange={() => handleToggle(key)}
        value={prefs[key]}
      />
    </View>
  );

  return (
    <AppScreen
      isLoading={isLoading}
      errorMessage={getErrorMessage(error || updateError)}
      successMessage={success ? 'Preferences saved successfully' : undefined}
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
            Stay up to date with your courses, payments, and special offers. Customize exactly what you want to be notified about.
          </Text>
        </View>

        <View style={[styles.switchContainer, styles.allSwitchContainer, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: '#fff' }]}>Toggle All Notifications</Text>
            <Text style={[styles.description, { color: '#ffffffcc' }]}>Enable or disable all notifications at once</Text>
          </View>
          <Switch
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#fff' }}
            thumbColor={isAllEnabled ? colors.primary : '#fff'}
            ios_backgroundColor='rgba(255,255,255,0.3)'
            onValueChange={handleToggleAll}
            value={isAllEnabled}
          />
        </View>

        {renderSwitch('Course Reminders', 'Get notified before your upcoming courses', 'courseReminderEnabled')}
        {renderSwitch('Subscription Alerts', 'Notifications about your active subscriptions', 'subscriptionExpirationEnabled')}
        {renderSwitch('Payment Updates', 'Receipts and billing information', 'paymentNotificationEnabled')}
        {renderSwitch('Coaching', 'Updates from your personal coach', 'coachingNotificationEnabled')}
        {renderSwitch('Promotions', 'Special offers and promo codes', 'promotionNotificationEnabled')}

        <View style={styles.footer}>
          <NeonButton
            title="Save Preferences"
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
  },

  headerDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: Theme.Radius.lg,
  },
  allSwitchContainer: {
    marginBottom: 24,
    borderWidth: 1,
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
