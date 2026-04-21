import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface NearestCourseCardProps {
  title: string;
  startTime: string;
  gymZone: string | null;
  onPress?: () => void;
}

export const NearestCourseCard: React.FC<NearestCourseCardProps> = ({ 
  title, 
  startTime, 
  gymZone, 
  onPress 
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.outerContainer}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>NEXT CLASS</Text>
      
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
          }
        ]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        {}
        <View style={[styles.accentLine, { backgroundColor: colors.primaryMid }]} />
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.primaryMid }]} />
            <Text style={[styles.statusText, { color: colors.primaryMid }]}>UPCOMING</Text>
          </View>
          
          <Text style={[styles.courseTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          
          <View style={styles.footerRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>{startTime}</Text>
            </View>
            
            <View style={[styles.infoDivider, { backgroundColor: hexToRGBA(colors.textSecondary, 0.3) }]} />
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>{gymZone ? `Zone ${gymZone}` : 'Zone A'}</Text>
            </View>
          </View>
        </View>
        
        {}
        <View style={[styles.iconContainer, { backgroundColor: colors.cardSecondary }]}>
          <Ionicons name="barbell-outline" size={20} color={colors.primaryMid} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 24,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
    minHeight: 100,
  },
  accentLine: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  infoDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 16,
  },
});
