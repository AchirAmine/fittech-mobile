import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@navigation/AccountNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Modal } from '@shared/components/ui/Modal';

type SettingsNavigation = NativeStackNavigationProp<ProfileStackParamList>;

type SectionItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
};

type Section = {
  title: string;
  items: SectionItem[];
};

const CONTACT_CHANNELS = [
  {
    id: 'email',
    label: 'Email',
    value: 'support.fittech@gmail.com',
    icon: 'mail-outline' as keyof typeof Ionicons.glyphMap,
    color: '#06B6D4',
    onPress: () => Linking.openURL('mailto:support@fittech.dz'),
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+213 12 345 678',
    icon: 'call-outline' as keyof typeof Ionicons.glyphMap,
    color: '#10B981',
    onPress: () => Linking.openURL('tel:+213XXXXXXXXX'),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: 'Chat with us',
    icon: 'logo-whatsapp' as keyof typeof Ionicons.glyphMap,
    color: '#25D366',
    onPress: () => Linking.openURL('https://wa.me/213XXXXXXXXX'),
  },
];

export const SettingsScreen = () => {
  const { colors, theme, setTheme } = useTheme();
  const navigation = useNavigation<SettingsNavigation>();
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const themeOptions = [
    { id: 'light', color: '#4A7FD4', icon: 'sunny', label: 'Light' },
    { id: 'dark', color: '#162850', icon: 'moon', label: 'Dark' },
    { id: 'rose', color: '#DB7093', icon: 'heart', label: 'Rose' },
    { id: 'purple', color: '#7B1FA2', icon: 'leaf', label: 'Purple' },
    { id: 'system', color: '#999999', icon: 'settings', label: 'Auto' },
  ];

  const sections: Section[] = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Customize your alerts & reminders',
          icon: 'notifications-outline',
          iconBg: '#10B981',
          onPress: () => navigation.navigate('NotificationPreferences'),
        },
        {
          id: 'privacy',
          title: 'Privacy',
          description: 'Control your data sharing preferences',
          icon: 'shield-checkmark-outline',
          iconBg: '#3B82F6',
          onPress: () => navigation.navigate('PrivacySettings'),
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'password',
          title: 'Change Password',
          description: 'Update your account password',
          icon: 'lock-closed-outline',
          iconBg: '#8B5CF6',
          onPress: () => navigation.navigate('ChangePassword'),
        },
      ],
    },
    {
      title: 'Support & Info',
      items: [
        {
          id: 'contact',
          title: 'Contact Support',
          description: 'Get help from our team',
          icon: 'chatbubble-ellipses-outline',
          iconBg: '#06B6D4',
          onPress: () => setSupportModalVisible(true),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {sections.map((section, sIdx) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(100 + sIdx * 80).duration(500)}
          >
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>

              {section.title === 'Preferences' && (
                <View style={[styles.themeSection, { borderBottomColor: colors.border }]}>
                  <View style={styles.themeHeader}>
                    <View style={[styles.iconBox, { backgroundColor: '#F59E0B' + '25', width: 42, height: 42, marginRight: 12 }]}>
                      <Ionicons name="color-palette-outline" size={22} color="#F59E0B" />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Appearance</Text>
                      <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>Choose your app theme</Text>
                    </View>
                  </View>
                  <View style={styles.themeSelector}>
                    {themeOptions.map((option) => {
                      const isActive = theme === option.id;
                      return (
                        <View key={option.id} style={{ alignItems: 'center', gap: 6 }}>
                          <TouchableOpacity
                            onPress={() => setTheme(option.id as any)}
                            style={[
                              styles.themeSwatchWrapper,
                              isActive && { borderColor: option.color },
                            ]}
                            activeOpacity={0.8}
                          >
                            <View style={[styles.themeSwatch, { backgroundColor: option.color }]}>
                              {isActive && (
                                <Ionicons name={option.icon as any} size={16} color="#fff" />
                              )}
                            </View>
                          </TouchableOpacity>
                          <Text style={{
                            fontSize: 11,
                            fontFamily: Theme.Typography.fontFamily.medium,
                            color: isActive ? colors.textPrimary : colors.textSecondary,
                          }}>
                            {option.label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.row,
                    idx < section.items.length - 1 && [styles.rowBorder, { borderBottomColor: colors.border }],
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg + '25' }]}>
                    <Ionicons name={item.icon} size={22} color={item.iconBg} />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>
                      {item.description}
                    </Text>
                  </View>
                  {item.rightElement ? (
                    item.rightElement
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        <Text style={[styles.version, { color: colors.textMuted }]}>FitTech v1.0.0</Text>
      </ScrollView>

      {/* ── Contact Support Modal ── */}
      <Modal
        visible={supportModalVisible}
        onClose={() => setSupportModalVisible(false)}
        title="Contact Support"
      >
        <View style={styles.supportIntro}>
          <View style={[styles.supportIconWrap, { backgroundColor: '#06B6D4' + '20' }]}>
            <Ionicons name="headset-outline" size={32} color="#06B6D4" />
          </View>
          <Text style={[styles.supportTitle, { color: colors.textPrimary }]}>
            We're here to help!
          </Text>
          <Text style={[styles.supportSubtitle, { color: colors.textSecondary }]}>
            Reach out through any of the channels below and our team will get back to you as soon as possible.
          </Text>
        </View>

        <View style={styles.channelList}>
          {CONTACT_CHANNELS.map((ch, idx) => (
            <TouchableOpacity
              key={ch.id}
              style={[
                styles.channelItem,
                { backgroundColor: colors.cardSecondary },
                idx < CONTACT_CHANNELS.length - 1 && { marginBottom: 10 },
              ]}
              onPress={ch.onPress}
              activeOpacity={0.75}
            >
              <View style={[styles.channelIcon, { backgroundColor: ch.color + '20' }]}>
                <Ionicons name={ch.icon} size={22} color={ch.color} />
              </View>
              <View style={styles.channelText}>
                <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>{ch.label}</Text>
                <Text style={[styles.channelValue, { color: colors.textPrimary }]}>{ch.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingBottom: 40,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: Theme.Radius.xl,
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginTop: 8,
  },
  themeSection: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  themeSwatchWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },

  supportIntro: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 6,
  },
  supportSubtitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  channelList: {},
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelText: { flex: 1 },
  channelLabel: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 2,
  },
  channelValue: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
});
