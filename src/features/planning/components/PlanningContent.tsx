import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import SessionList from './SessionList';
import { Session } from '@appTypes/planning';
interface Props {
  sessions: Session[];
  isLoading: boolean;
}
const PlanningContent: React.FC<Props> = ({ sessions, isLoading }) => {
  const { colors } = useTheme();
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading schedule...</Text>
      </View>
    );
  }
  return <SessionList sessions={sessions} />;
};
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    gap: 16,
  },
  loadingText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
});
export default PlanningContent;
