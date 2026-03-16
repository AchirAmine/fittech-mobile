import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Theme } from '@shared/constants/theme';
import { User } from '@appTypes/index';
import { ThemeColors } from '@shared/constants/colors';

interface ProfileAvatarProps {
  userData: User | null | undefined;
  colors: ThemeColors;
}

export const ProfileAvatar = ({ userData, colors }: ProfileAvatarProps) => {
  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.avatarSection}>
      <View style={[styles.avatarWrapper, { borderColor: colors.primary + '30', shadowColor: colors.primary }]}>
        {userData?.profilePicture ? (
          <Image
            source={typeof userData.profilePicture === 'string' ? { uri: userData.profilePicture } : userData.profilePicture}
            style={styles.avatarImage}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '10' }]}>
            <Ionicons name="person" size={50} color={colors.primary} />
          </View>
        )}
      </View>
      <Text style={[styles.userName, { color: colors.textPrimary }]}>
        {userData?.firstName} {userData?.lastName}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    padding: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 50 },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginTop: 16,
  },
});
