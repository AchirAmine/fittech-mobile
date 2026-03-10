import React, { memo } from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = memo(({ visible, onClose, title, children, contentStyle }) => {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.background }, contentStyle]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title || ''}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1, // Ensure overlay covers full screen
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.Spacing.lg,
  },
  container: {
    width: '100%',
    borderRadius: Theme.Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 18,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: Theme.Spacing.md,
  },
});
