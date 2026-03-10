import React, { memo, useRef, useCallback, useState } from 'react';
import {
  View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onRightIconPress?: () => void;
  onIconPress?: () => void;
  containerStyle?: object;
}

export const Input: React.FC<InputProps> = memo(({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  onIconPress,
  containerStyle,
  value,
  onFocus,
  onBlur,
  placeholder,
  ...rest
}) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [isFocused, setIsFocused] = useState(false);

  const animateLabel = useCallback((toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>((e) => {
    setIsFocused(true);
    animateLabel(1);
    onFocus?.(e);
  }, [onFocus, animateLabel]);

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>((e) => {
    setIsFocused(false);
    if (!value) {
      animateLabel(0);
    }
    onBlur?.(e);
  }, [onBlur, value, animateLabel]);
  
  const hasValue = Boolean(value) || isFocused;

  // labelStyle contains Animated interpolations which are not strictly typed
  // but are valid at runtime by react-native's Animated API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelStyle: Record<string, any> = {
    position: 'absolute',
    left: icon ? 48 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    color: isFocused || hasValue ? colors.primary : colors.textMuted,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
    fontFamily: Theme.Typography.fontFamily.medium,
    zIndex: 10,
  };


  return (
    <View style={containerStyle}>
      <View style={[
        styles.inputWrap,
        {  borderColor: error ? colors.error : (hasValue ? colors.primaryMid : colors.border) }
      ]}>
        {icon && (
          onIconPress ? (
            <TouchableOpacity onPress={onIconPress} style={styles.inputIcon}>
              <Ionicons name={icon} size={20} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <Ionicons name={icon} size={20} color={colors.primary} style={styles.inputIcon} />
          )
        )}

        {label && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}

        <TextInput
          style={[styles.input, { color: colors.textPrimary, paddingTop: label ? 12 : 8 }]}
          placeholderTextColor="transparent"
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label ? undefined : placeholder}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconBtn}>
            <Ionicons name={rightIcon} size={20} color={hasValue ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.Radius.lg,
    borderWidth: 1,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  rightIconBtn: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 15,
    minHeight: 48,
  },
  errorText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
