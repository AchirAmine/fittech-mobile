import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@shared/hooks/useTheme';

export interface AuthBottomSheetProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  variant?: 'modal' | 'full';
  minHeight?: string | number;
  showOverlay?: boolean;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  children,
  onDismiss,
  variant = 'modal',
  minHeight = '88%',
  showOverlay = false,
}) => {
  const { colors } = useTheme();

  const isModal = variant === 'modal';
  const containerBg = isModal ? 'transparent' : 'transparent';
  const sheetStyle: ViewStyle = isModal
    ? { height: minHeight as ViewStyle['height'] }
    : styles.sheetFull;

  const topArea = isModal && onDismiss ? (
    <Pressable style={styles.topArea} onPress={onDismiss} />
  ) : (
    <SafeAreaView style={styles.topAreaSafe} edges={['top']} />
  );

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: containerBg },
        isModal && styles.containerModal,
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {topArea}
      <View style={[styles.sheet, sheetStyle, { backgroundColor: colors.background }]}>
        <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerModal: { justifyContent: 'flex-end' },
  topArea: { flex: 1 },
  topAreaSafe: { flex: 0.1 },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetFull: { flex: 1 },
  dragHandle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
