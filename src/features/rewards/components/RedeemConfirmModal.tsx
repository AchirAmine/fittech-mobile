import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export type RedemptionState = 'confirm' | 'loading' | 'success' | 'error';

interface RedeemConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  rewardName: string;
  starsRequired: number;
  currentBalance: number;
  onRedeem: () => void;
  isLoading: boolean;
  promoCode?: string;
  error?: string | null;
  expiryDate?: string;
}

export const RedeemConfirmModal: React.FC<RedeemConfirmModalProps> = ({
  visible,
  onClose,
  rewardName,
  starsRequired,
  currentBalance,
  onRedeem,
  isLoading,
  promoCode,
  error,
  expiryDate,
}) => {
  const { colors, isDark } = useTheme();
  const [internalState, setInternalState] = useState<RedemptionState>('confirm');
  const [copied, setCopied] = useState(false);
  
  const remainingBalance = currentBalance - starsRequired;

  const getExpiryLabel = () => {
    if (!expiryDate) return 'N/A';
    const date = new Date(expiryDate);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const expiryStr = getExpiryLabel();

  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      setInternalState('confirm');
      setCopied(false);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (isLoading) {
      setInternalState('loading');
    } else if (promoCode) {
      setInternalState('success');
    } else if (error) {
      setInternalState('error');
    }
  }, [isLoading, promoCode, error]);

  const handleCopy = () => {
    if (promoCode) {
      Clipboard.setString(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => {
    switch (internalState) {
      case 'confirm':
        return (
          <>
            <View style={[styles.iconContainer, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
              <Ionicons name="cart" size={40} color={colors.primary} />
            </View>
            
            <Text style={[styles.title, { color: colors.textPrimary }]}>Redeem Offer</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Confirm your redemption for the {rewardName}.
            </Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Current Balance</Text>
                <View style={styles.pointsValue}>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>{currentBalance}</Text>
                  <Ionicons name="star" size={12} color={colors.textPrimary} style={{ marginLeft: 4 }} />
                </View>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Cost</Text>
                <View style={styles.pointsValue}>
                  <Text style={[styles.value, { color: colors.error }]}>-{starsRequired}</Text>
                  <Ionicons name="star" size={12} color={colors.error} style={{ marginLeft: 4 }} />
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: hexToRGBA(colors.textSecondary, 0.1) }]} />

              <View style={styles.tableRow}>
                <Text style={[styles.labelBold, { color: colors.textPrimary }]}>Remaining Balance</Text>
                <View style={styles.pointsValue}>
                  <Text style={[styles.valueBold, { color: colors.primary }]}>{remainingBalance}</Text>
                  <Ionicons name="star" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.mainButton} onPress={onRedeem}>
              <LinearGradient
                colors={[colors.primary, colors.primaryMid]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.mainButtonText}>Confirm Redemption</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </>
        );

      case 'loading':
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Processing redemption...</Text>
          </View>
        );

      case 'success':
        return (
          <>
            <View style={[styles.iconContainer, { backgroundColor: hexToRGBA(colors.success, 0.1) }]}>
              <Ionicons name="checkmark-circle" size={40} color={colors.success} />
            </View>
            
            <Text style={[styles.title, { color: colors.textPrimary }]}>Redemption Successful!</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              Your promo code is ready to use
            </Text>

            <View style={[styles.divider, { backgroundColor: hexToRGBA(colors.textSecondary, 0.05), width: '100%', marginVertical: 15 }]} />

            <View style={styles.offerSummary}>
              <View style={[styles.offerIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="star" size={14} color={colors.white} />
              </View>
              <View style={styles.offerText}>
                <Text style={[styles.offerName, { color: colors.textPrimary }]}>{rewardName}</Text>
                <Text style={[styles.offerExpiry, { color: colors.textSecondary }]}>Valid until: {expiryStr}</Text>
              </View>
            </View>

            <View style={[styles.balanceBar, { backgroundColor: hexToRGBA(colors.primary, 0.05) }]}>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Your New Balance:</Text>
              <View style={styles.balanceValueContainer}>
                <Ionicons name="star" size={16} color="#FFBA08" style={{ marginRight: 4 }} />
                <Text style={[styles.balanceValue, { color: "#FFBA08" }]}>{remainingBalance} Stars</Text>
              </View>
            </View>

            <View style={[styles.codeContainer, { backgroundColor: colors.cardSecondary, borderColor: colors.primary, marginTop: 15 }]}>
              <Text style={[styles.codeText, { color: colors.textPrimary }]}>{promoCode}</Text>
              <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
                <Ionicons name={copied ? "checkmark" : "copy-outline"} size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.mainButton} onPress={onClose}>
              <LinearGradient colors={[colors.primary, colors.primaryMid]} style={StyleSheet.absoluteFill} />
              <Text style={styles.mainButtonText}>Done</Text>
            </TouchableOpacity>
          </>
        );

      case 'error':
        return (
          <>
            <View style={[styles.iconContainer, { backgroundColor: hexToRGBA(colors.error, 0.1) }]}>
              <Ionicons name="alert-circle" size={60} color={colors.error} />
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Oops!</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>{error || 'Something went wrong.'}</Text>
            <TouchableOpacity style={styles.mainButton} onPress={onClose}>
              <LinearGradient colors={[colors.error, '#D32F2F']} style={StyleSheet.absoluteFill} />
              <Text style={styles.mainButtonText}>Try again later</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
        <Animated.View 
          style={[
            styles.container, 
            { 
              backgroundColor: colors.card,
              opacity,
              transform: [{ scale }]
            }
          ]}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
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
    width: width - 50,
    maxWidth: 360,
    borderRadius: 32,
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  table: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 0,
    marginTop: 15,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  pointsValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  value: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  labelBold: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  valueBold: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  offerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  offerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  offerText: {
    flex: 1,
  },
  offerName: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  offerExpiry: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  balanceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  balanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  mainButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  cancelButton: {
    marginTop: 10,
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  centerContent: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  codeText: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 2,
  },
  copyBtn: {
    padding: 6,
  }
});
