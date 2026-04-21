import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');
export type StatusModalType = 'success' | 'confirm' | 'error';
interface StatusModalProps {
  visible: boolean;
  type: StatusModalType;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}
export const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  type,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const { colors, isDark } = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
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
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={80} color={colors.primary} />;
      case 'confirm':
        return <Ionicons name="help-circle" size={80} color={colors.primary} />;
      case 'error':
        return <Ionicons name="alert-circle" size={80} color={colors.error} />;
    }
  };
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: hexToRGBA(colors.black, 0.7) }]}>
        <Animated.View 
          style={[
            styles.container, 
            { 
              backgroundColor: isDark ? colors.card : colors.white,
              opacity,
              transform: [{ scale }]
            }
          ]}
        >
          {}
          <LinearGradient
            colors={[
              type === 'success' ? colors.primary : (type === 'confirm' ? colors.primary : colors.error),
              hexToRGBA(colors.white, 0)
            ]}
            style={styles.topGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          <View style={styles.buttonContainer}>
            {type === 'confirm' && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { borderColor: hexToRGBA(colors.textSecondary, 0.2) }]} 
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: colors.textSecondary }]}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={() => {
                onConfirm();
                if (type !== 'confirm') onClose();
              }}
            >
              <LinearGradient
                colors={type === 'success' ? [colors.primary, hexToRGBA(colors.primary, 0.8)] : (type === 'confirm' ? [colors.primary, hexToRGBA(colors.primary, 0.8)] : [colors.error, hexToRGBA(colors.error, 0.8)])}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <Text style={[styles.buttonText, { color: colors.white }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 400,
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    opacity: 0.15,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
  },
  buttonText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
  },
});
