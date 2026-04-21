import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
interface CoachCardProps {
  name: string;
  specialty: string;
  clientsCount: number;
  image: any;
  onPress?: () => void;
}
export const CoachCard = ({ name, specialty, clientsCount, image, onPress }: CoachCardProps) => {
  const { colors, isDark } = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: isDark ? hexToRGBA(colors.primary, 0.2) : colors.border,
          shadowColor: colors.shadow,
        }
      ]} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.imageContainer, { borderColor: colors.primary }]}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
        <Text style={[styles.specialty, { color: colors.textSecondary }]}>{specialty}</Text>
        <View style={styles.statsContainer}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={[styles.stats, { color: colors.textSecondary }]}>
            {clientsCount} clients
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Theme.Radius.lg,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    padding: 2,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stats: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});
