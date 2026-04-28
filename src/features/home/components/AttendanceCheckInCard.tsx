import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const gradientColors = [colors.primaryMid, colors.primary];

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress} 
      style={[styles.container, { shadowColor: colors.primary }]}
    >
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.textInfo}>
              <Text style={styles.tagText}>ACTIVE CHECK-IN</Text>
              <Text style={styles.courseTitle} numberOfLines={1}>
                {courseTitle}
              </Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.timeText}>Starts at {startTime}</Text>
              </View>
            </View>
          </View>

          <Animated.View style={[styles.actionBtn, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.actionBtnText}>MARK PRESENT</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gradient: {
    borderRadius: 24,
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textInfo: {
    flex: 1,
  },
  tagText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  courseTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  actionBtnText: {
    color: '#000000',
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
