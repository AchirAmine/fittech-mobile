import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
interface CoachInfoCardProps {
  name: string;
  image: any;
  onMessagePress?: () => void;
}
export const CoachInfoCard = ({ name, image, onMessagePress }: CoachInfoCardProps) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.card : '#FFF', shadowColor: colors.shadow }]}>
      <View style={styles.header}>
        <Image source={image} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{name.toUpperCase()}</Text>
          <TouchableOpacity 
            style={[styles.messageBtn, { borderColor: colors.primary }]}
            onPress={onMessagePress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
            <Text style={[styles.messageText, { color: colors.primary }]}>Message Coach</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
