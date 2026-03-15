import React from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

export interface NeonButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  outlined?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export const NeonButton: React.FC<NeonButtonProps> = ({ title, onPress, style, textStyle, outlined, disabled, loading, icon }) => {
  const { colors, isDark } = useTheme();

  const content = loading ? (
    <ActivityIndicator color={outlined ? colors.success : colors.white} />
  ) : (
    <>
      {icon && (
        <Ionicons 
          name={icon} 
          size={18} 
          color={outlined ? colors.success : (disabled ? colors.textMuted : colors.white)} 
          style={styles.btnIcon} 
        />
      )}
      <Text style={[
        styles.neonBtnText, 
        { color: colors.white },
        outlined && { color: colors.success }, 
        disabled && { color: colors.textMuted }, 
        textStyle
      ]}>
        {title}
      </Text>
    </>
  );

  if (outlined || disabled) {
    return (
      <TouchableOpacity
        style={[
          styles.neonBtn, 
          { borderColor: colors.success },
          outlined && styles.neonBtnOutlined, 
          disabled && { backgroundColor: isDark ? colors.cardSecondary : colors.background, borderWidth: 0 }, 
          style
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.neonBtn,
        { backgroundColor: isDark ? colors.primaryDark : colors.primaryMid },
        style
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  neonBtn: {
    borderRadius: Theme.Radius.md,
    paddingVertical: 16,
    paddingHorizontal: Theme.Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: { 
    marginRight: 8 
  },
  neonBtnText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  neonBtnOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
});
