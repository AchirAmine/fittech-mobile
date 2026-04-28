import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export type CheckInModalType = 
  | 'confirm_free' 
  | 'confirm_course' 
  | 'success_free' 
  | 'success_course' 
  | 'no_sessions' 
  | 'suspended';

interface CheckInModalProps {
  visible: boolean;
  type: CheckInModalType;
  onConfirm: () => void;
  onClose: () => void;
  data?: {
    courseTitle?: string;
    zone?: string;
    schedule?: string;
    instructor?: string;
    instructorImage?: string;
    remainingSessions?: number;
    message?: string;
  };
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  visible,
  type,
  onConfirm,
  onClose,
  data,
}) => {
  const { colors, isDark } = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const renderContent = () => {
    switch (type) {
      case 'confirm_free':
        return (
          <View style={styles.content}>
            <View style={[styles.iconWrapper, { backgroundColor: '#ecfdf5' }]}>
              <MaterialCommunityIcons name="weight-lifter" size={40} color="#10b981" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirm Free Entry - Gym</Text>
            <TouchableOpacity 
              style={[styles.mainBtn, { backgroundColor: '#10b981' }]} 
              onPress={onConfirm}
            >
              <Text style={styles.mainBtnText}>Confirm Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );

      case 'confirm_course':
        return (
          <View style={styles.content}>
            <View style={[styles.iconWrapper, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="calendar" size={40} color="#3b82f6" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirm Course Check In</Text>
            
            <View style={[styles.courseInfoCard, { backgroundColor: '#f8fafc' }]}>
              <Text style={styles.infoLabel}>ACTIVE COURSE</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{data?.courseTitle || 'Strength Training'}</Text>
              <Text style={[styles.infoSubValue, { color: '#3b82f6' }]}>{data?.zone || 'Zone 2'}</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>SCHEDULE</Text>
                  <Text style={[styles.infoSmallValue, { color: colors.textPrimary }]}>{data?.schedule || 'MON 12:30 - 13:30'}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>INSTRUCTOR</Text>
                  <View style={styles.instructorRow}>
                    <Ionicons name="person-circle" size={16} color="#3b82f6" style={{marginRight: 4}} />
                    <Text style={[styles.infoSmallValue, { color: colors.textPrimary }]}>{data?.instructor || 'Coach Amine'}</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.mainBtn, { backgroundColor: colors.primaryMid }]} 
              onPress={onConfirm}
            >
              <Text style={styles.mainBtnText}>Confirm Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        );

      case 'success_free':
      case 'success_course':
        const isCourse = type === 'success_course';
        return (
          <View style={styles.content}>
            <View style={[styles.iconWrapper, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="checkmark-circle" size={50} color="#10b981" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Check-in successful!</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              {isCourse 
                ? `You're checked in to ${data?.courseTitle || 'Strength Training'}`
                : "You're checked in to Free session"}
            </Text>
            <Text style={[styles.timeText, { color: colors.textMuted }]}>{data?.schedule?.split('-')[0] || 'Mon 12:30'}</Text>
            
            {isCourse && data?.instructor && (
              <View style={[styles.coachBadge, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="person-circle" size={20} color="#3b82f6" />
                <Text style={[styles.coachName, { color: '#3b82f6' }]}>{data.instructor.toUpperCase()}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.doneBtn, { backgroundColor: colors.primaryMid }]} 
              onPress={onClose}
            >
              <Text style={styles.mainBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        );

      case 'no_sessions':
        return (
          <View style={styles.content}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fff7ed' }]}>
              <Ionicons name="time" size={50} color="#f97316" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>No sessions remaining</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              You've used all the sessions in your current pack. Renew to continue.
            </Text>
            <View style={[styles.errorFooter, { backgroundColor: '#fff7ed' }]} />
            <TouchableOpacity 
              style={[styles.doneBtn, { backgroundColor: colors.primaryMid }]} 
              onPress={onClose}
            >
              <Text style={styles.mainBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        );

      case 'suspended':
        return (
          <View style={styles.content}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="settings" size={50} color="#ef4444" />
            </View>
            <Text style={[styles.modalTitle, { color: '#ef4444' }]}>Account suspended</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              {data?.message || 'Your account is suspended until further notice.'}
            </Text>
            <View style={[styles.errorFooter, { backgroundColor: '#ef4444' }]} />
            <TouchableOpacity 
              style={[styles.doneBtn, { backgroundColor: colors.primaryMid }]} 
              onPress={onClose}
            >
              <Text style={styles.mainBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={[styles.overlay, { backgroundColor: hexToRGBA(colors.black, 0.6) }]}>
        <Animated.View 
          style={[
            styles.container, 
            { 
              backgroundColor: colors.white,
              opacity,
              transform: [{ translateY }]
            }
          ]}
        >
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: width - 40,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginBottom: 20,
  },
  courseInfoCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  infoSubValue: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 15,
  },
  infoCol: {
    flex: 1,
  },
  infoSmallValue: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainBtn: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  doneBtn: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelBtn: {
    padding: 10,
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  coachBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 25,
  },
  coachName: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginLeft: 6,
  },
  errorFooter: {
    width: '100%',
    height: 4,
    position: 'absolute',
    bottom: 0,
  }
});
