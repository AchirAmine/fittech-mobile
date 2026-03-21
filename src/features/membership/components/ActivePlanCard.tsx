import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

interface ActivePlanCardProps {
  title: string;
  subtitle: string;
  image: any;
  value: string;
  unit: string;
  onPress: () => void;
}

export const ActivePlanCard = ({ title, subtitle, image, value, unit, onPress }: ActivePlanCardProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.black }]}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <View style={[styles.activeBadge, { backgroundColor: colors.success }]}>
          <Text style={[styles.activeBadgeText, { color: colors.white }]}>ACTIVE</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <View>
            <Text style={[styles.valueText, { color: colors.primaryMid }]}>{value}</Text>
            <Text style={[styles.unitText, { color: colors.textMuted }]}>{unit}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.checkButton, { backgroundColor: colors.primaryMid }]} 
            onPress={onPress}
            activeOpacity={0.85}
          >
            <Text style={[styles.checkButtonText, { color: colors.white }]}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  activeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 28,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 34,
  },
  unitText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.semiBold,
    letterSpacing: 0.5,
  },
  checkButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  checkButtonText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
