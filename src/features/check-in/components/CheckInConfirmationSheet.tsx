import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

const { width } = Dimensions.get('window');

interface CheckInConfirmationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'FREE' | 'COURSE';
  data?: {
    title: string;
    zone: string;
    schedule: string;
    instructor: string;
  };
  loading?: boolean;
}

export const CheckInConfirmationSheet = ({
  visible,
  onClose,
  onConfirm,
  type,
  data,
  loading,
}: CheckInConfirmationSheetProps) => {
  const { colors } = useTheme();
  
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.popup, { backgroundColor: colors.background }]}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: type === 'FREE' ? '#ecfdf5' : '#f0f4ff' }]}>
              <MaterialCommunityIcons 
                name={type === 'FREE' ? "weight-lifter" : "calendar-blank-outline"} 
                size={40} 
                color={type === 'FREE' ? "#10b981" : "#3b82f6"} 
              />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {type === 'FREE' ? 'Confirm Free Entry' : 'Confirm Check-In'}
            </Text>
            
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {type === 'FREE' 
                ? 'Are you sure you want to start a free training session now?' 
                : `Are you sure you want to check-in for the ${data?.title || 'course'}?`}
            </Text>

            {type === 'COURSE' && data && (
              <View style={[styles.courseDetails, { backgroundColor: colors.cardSecondary }]}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{data.zone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.textPrimary }]}>{data.schedule}</Text>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.cancelBtn, { borderColor: colors.border }]} 
                onPress={onClose} 
                disabled={loading}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.confirmBtn, 
                  { backgroundColor: type === 'FREE' ? '#10b981' : colors.primaryMid }
                ]}
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popup: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 30,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  courseDetails: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  confirmBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
