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
import { Palette } from '@shared/constants/colors';

export const AccountMenu = () => {
  const { colors, theme, setTheme } = useTheme();
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
      id: 'offers',
      title: 'Subscription Offers',
      icon: 'star-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate(ROUTES.MAIN.SUBSCRIPTION_OFFERS),
    },
  ];

  const themeOptions = [
    { id: 'light', label: 'Light', icon: 'sunny-outline' as keyof typeof Ionicons.glyphMap },
    { id: 'dark', label: 'Dark', icon: 'moon-outline' as keyof typeof Ionicons.glyphMap },
    { id: 'rose', label: 'Rose', icon: 'heart-outline' as keyof typeof Ionicons.glyphMap },
    { id: 'purple', label: 'Purple', icon: 'leaf-outline' as keyof typeof Ionicons.glyphMap },
    { id: 'system', label: 'Auto', icon: 'settings-outline' as keyof typeof Ionicons.glyphMap },
  ];

  return (
    <View style={styles.section}>

      {navItems.map((item) => (
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


      <View style={[styles.themeSection, { borderBottomColor: colors.border }]}>
        <View style={styles.themeHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.info + '15' }]}>
            <Ionicons name="color-palette-outline" size={22} color={colors.info} />
          </View>
          <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>Appearance</Text>
        </View>
        
        <View style={[styles.themeSelector, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {themeOptions.map((option) => {
            const isActive = theme === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => setTheme(option.id as 'light' | 'dark' | 'system' | 'rose' | 'purple')}
                style={[
                  styles.themeOption,
                  isActive && { backgroundColor: colors.primary }
                ]}
              >
                <Ionicons 
                  name={option.icon} 
                  size={16} 
                  color={isActive ? colors.white : colors.textSecondary} 
                />
                <Text style={[
                  styles.themeOptionLabel, 
                  { color: isActive ? colors.white : colors.textSecondary }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>


      <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: 'transparent' }]}
        onPress={handleLogout}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: '#e74c3c15' }]}>
            <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
          </View>
          <Text style={[styles.menuItemText, { color: '#e74c3c' }]}>Logout</Text>
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
  themeSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    gap: 2,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  themeOptionLabel: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});
