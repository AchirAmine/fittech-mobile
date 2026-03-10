import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '@shared/hooks/useReduxHooks';
import { logout } from '@features/auth/store/authSlice';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.error }]} 
        onPress={() => dispatch(logout())}
      >
        <Text style={[styles.logoutText, { color: colors.white }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Theme.Radius.md,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
