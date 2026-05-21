import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface AttendanceCheckInCardProps {
  courseTitle: string;
  startTime: string;
  onPress: () => void;
}

export const AttendanceCheckInCard = ({ courseTitle, startTime, onPress }: AttendanceCheckInCardProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress} 
      style={styles.container}
    >
      <LinearGradient
        colors={[colors.primaryLight, colors.primaryMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.bgIconContainer}>
          <MaterialCommunityIcons name="shield-check-outline" size={80} color="rgba(255,255,255,0.05)" style={styles.shieldBg} />
          <MaterialCommunityIcons name="clock-outline" size={100} color="rgba(255,255,255,0.05)" style={styles.clockBg} />
        </View>

        <View style={styles.header}>
          <View style={[styles.availableBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <View style={[styles.greenDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.availableText, { color: colors.white }]}>AVAILABLE TO SCAN</Text>
          </View>
          <MaterialCommunityIcons name="focus-field" size={24} color="rgba(255,255,255,0.4)" />
        </View>

        <Text style={[styles.mainTitle, { color: colors.white }]}>Course Attendance</Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="dumbbell" size={18} color={colors.white} />
          <Text style={[styles.infoText, { color: colors.white }]}>{courseTitle}</Text>
          <Text style={styles.separator}>|</Text>
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.white} />
          <Text style={[styles.infoText, { color: colors.white }]}>{startTime}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ctaLink}>
            <Text style={[styles.ctaText, { color: colors.white }]}>Check-in with Coach QR</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.white} />
          </View>

          <View style={[styles.qrButton, { backgroundColor: colors.white }]}>
            <MaterialCommunityIcons name="qrcode" size={28} color={colors.primaryMid} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  gradient: {
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  bgIconContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shieldBg: {
    position: 'absolute',
    right: -10,
    top: 10,
    transform: [{ rotate: '-15deg' }],
  },
  clockBg: {
    position: 'absolute',
    left: -20,
    bottom: -20,
    transform: [{ rotate: '15deg' }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availableText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginLeft: 6,
  },
  separator: {
    color: 'rgba(255,255,255,0.4)',
    marginHorizontal: 10,
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ctaLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  ctaText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginRight: 4,
  },
  qrButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});
