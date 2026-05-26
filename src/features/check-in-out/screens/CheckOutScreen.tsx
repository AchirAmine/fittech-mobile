import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { StatusModal } from '@shared/components/ui/StatusModal';
import { ScannerOverlay } from '../components/ScannerOverlay';
import { useCheckout, useOpenSession, useCheckInStatus } from '../hooks/useCheckInOut';
import { ROUTES } from '@navigation/routes';

/**
 * Formats the duration between checkInTime and checkOutTime into a human-readable string.
 * e.g., "2h 15m", "45 minutes 30s", "30 seconds"
 */
function formatDuration(checkInIsoString: string): string {
  const checkInTime = new Date(checkInIsoString).getTime();
  const checkOutTime = Date.now();
  const totalSeconds = Math.max(0, Math.floor((checkOutTime - checkInTime) / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else if (mins > 0) {
    return `${mins} min ${secs}s`;
  } else {
    return `${secs} seconds`;
  }
}

export const CheckOutScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);

  const { data: openSession } = useOpenSession();
  const { mutate: checkout, isPending: isSubmitting } = useCheckout();
  const { status, showSuccess, showError, hideStatus } = useCheckInStatus();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const scanLineAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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

    try {
      setScanned(true);
      const parsedData = JSON.parse(data);

      // Verify that it is a valid door QR code containing a zone
      if (!parsedData.zone) {
        throw new Error('INVALID_FORMAT');
      }

      // Calculate duration locally at the exact moment of scanning
      // This is always accurate regardless of backend timezone/rounding
      const durationText = openSession?.checkInAt
        ? formatDuration(openSession.checkInAt)
        : 'unknown';

      // Perform the checkout
      checkout(
        { sessionId: openSession?.id },
        {
          onSuccess: () => {
            showSuccess(
              'Checkout Successful',
              `You have successfully checked out.\nDuration: ${durationText}.`
            );
          },
          onError: (error: any) => {
            setScanned(false);
            showError('Checkout Failed', error?.message || 'An error occurred while checking out.');
          },
        }
      );
    } catch (e: any) {
      setScanned(false);
      let errorMsg = e.message || 'An unexpected error occurred.';
      let errorTitle = 'Checkout Failed';

      if (e instanceof SyntaxError || e.message?.includes('JSON') || e.message?.includes('INVALID_FORMAT')) {
        errorMsg = 'Invalid QR code. Please scan the official club gate code.';
        errorTitle = 'Scanning Error';
      }

      showError(errorTitle, errorMsg);
    }
  };

  const handleCloseStatus = () => {
    hideStatus();
    if (status.type === 'success') {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        (navigation as any).navigate(ROUTES.MAIN.HOME);
      }
    } else {
      setScanned(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    requestPermission();
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
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScannerOverlay
          scanLineAnim={scanLineAnim}
          hintText="Scan the official club gate QR code to check-out"
        />

        <View style={styles.footer} />
      </View>

      <StatusModal
        visible={status.visible}
        type={status.type}
        title={status.title}
        message={status.message}
        onConfirm={handleCloseStatus}
        onClose={handleCloseStatus}
        confirmText="Done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 60,
  },
});
