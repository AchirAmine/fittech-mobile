import React from 'react';
import { ROUTES } from '@navigation/routes';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@navigation/AccountNavigator';
import { useDispatch } from 'react-redux';
import { logout } from '@features/auth/store/authSlice';

export const AccountMenu = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const dispatch = useDispatch();
  const handleLogout = () => { dispatch(logout()); };

  const navItems = [
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('ProfileMain'),
    },
    {
      id: 'health_profile',
      title: 'Health Profile',
      icon: 'medical-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('HealthProfile'),
    },
    {
      id: 'activity_history',
      title: 'Activity History',
      icon: 'time-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('ActivityHistory'),
    },
    {
      id: 'offers',
      title: 'Subscription Offers',
      icon: 'star-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('SettingsMain'),
    },
  ];

  return (
    <View style={styles.section}>
      {navItems.map((item, idx) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={item.onPress}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>{item.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: 'transparent' }]}
        onPress={handleLogout}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
          </View>
          <Text style={[styles.menuItemText, { color: colors.error }]}>Logout</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: Theme.Radius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
});
