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
import { useScanDoor, useCheckInStatus } from '../hooks/useCheckIn';
import { ROUTES } from '@navigation/routes';

export const CheckInScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = React.useState(false);

  
  const { mutateAsync: scanDoor, isPending: isSubmitting } = useScanDoor();
  const { status, showError, hideStatus } = useCheckInStatus();

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
      
      if (!parsedData.zone || !parsedData.sessionType) {
        throw new Error('INVALID_FORMAT');
      }

      (navigation as any).navigate(ROUTES.MAIN.CHECK_IN_SELECTION, {
        zone: parsedData.zone,
      });
      return;
    } catch (e: any) {
      setScanned(false);
      let errorMsg = e.message || 'An unexpected error occurred.';
      let errorTitle = e.code === 0 ? 'Connection Issue' : 'Check-in Failed';

      if (e instanceof SyntaxError || e.message?.includes('JSON') || e.message?.includes('INVALID_FORMAT')) {
        errorMsg = 'Invalid QR code. Please scan the official club gate code.';
        errorTitle = 'Scanning Error';
      }

      showError(errorTitle, errorMsg);
    }
  };

  if (!permission) return <View style={styles.container} />;

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
          hintText="Scan the official club gate QR code" 
        />

        <View style={styles.footer} />
      </View>

      <StatusModal
        visible={status.visible}
        type={status.type}
        title={status.title}
        message={status.message}
        onConfirm={hideStatus}
        onClose={hideStatus}
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
