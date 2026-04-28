import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen, Loader } from '@shared/components';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { ScannerOverlay } from '../components/ScannerOverlay';
import { useScanCoach, useCheckInStatus } from '../hooks/useCheckIn';
import { ROUTES } from '@navigation/routes';

export const CourseAttendanceScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  const { mutateAsync: scanCoach, isPending: isSubmitting } = useScanCoach();
  const { status, showSuccess, showError, hideStatus } = useCheckInStatus();

  const scanLineAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission?.granted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [permission, scanLineAnim]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isSubmitting) return;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data);
    if (!isUUID) return;

    setScanned(true);

    try {
      const result = await scanCoach(data);
      if (result.success) {
        showSuccess(
          'Attendance Marked!',
          'Your presence in the course has been recorded successfully.'
        );
      }
    } catch (error: any) {
      showError(
        'Check-in Failed',
        error.response?.data?.message || 'Invalid or expired course token.'
      );
    }
  };

  const handleStatusClose = () => {
    hideStatus();
    if (status.type === 'success') {
      if (navigation.canGoBack()) navigation.goBack();
      else (navigation as any).navigate(ROUTES.MAIN.HOME);
    } else {
      setScanned(false);
    }
  };

  if (!permission) return <Loader />;
  if (!permission.granted) {
    return (
      <AppScreen>
        <View style={styles.centerContainer}>
          <Text style={[styles.permissionText, { color: colors.textPrimary }]}>
            Camera permission is required to scan course QR.
          </Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primaryMid }]} onPress={requestPermission}>
            <Text style={styles.btnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </AppScreen>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.canGoBack() ? navigation.goBack() : (navigation as any).navigate(ROUTES.MAIN.HOME)} 
            style={styles.backBtn}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>COURSE ATTENDANCE</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScannerOverlay 
          scanLineAnim={scanLineAnim} 
          hintText="Scan the QR Code shown by your coach" 
        />

        <View style={styles.footer}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>Hold your phone steady in front of the coach's screen</Text>
          </View>
        </View>
      </View>

      <StatusModal
        visible={status.visible}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={handleStatusClose}
        onConfirm={handleStatusClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  backBtn: {
    padding: 8,
  },
  footer: {
    paddingHorizontal: 30,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    flex: 1,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#fff',
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
