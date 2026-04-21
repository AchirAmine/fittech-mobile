import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

export type RewardTab = 'unlocked' | 'locked' | 'vouchers' | 'history';

interface RewardsTabSelectorProps {
  activeTab: RewardTab;
  onTabChange: (tab: RewardTab) => void;
}

export const RewardsTabSelector: React.FC<RewardsTabSelectorProps> = ({ activeTab, onTabChange }) => {
  const { colors } = useTheme();

  const tabs: { key: RewardTab; label: string }[] = [
    { key: 'unlocked', label: 'Unlocked' },
    { key: 'locked', label: 'Locked' },
    { key: 'history', label: 'History' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.cardSecondary }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive && [
                styles.activeTab,
                { backgroundColor: colors.white, shadowColor: colors.black }
              ],
            ]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.primary : colors.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 30,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
