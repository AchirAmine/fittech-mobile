import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Input } from '@shared/components';
interface OtherOptionInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  maxLength?: number;
  onChangeText?: (text: string) => void;
}
export const OtherOptionInput: React.FC<OtherOptionInputProps> = memo(({
  control,
  name,
  label,
  placeholder,
  error,
  maxLength = 100,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, onBlur } }) => (
          <Input
            label={label}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              onChangeText?.(text);
            }}
            maxLength={maxLength}
            error={error}
          />
        )}
      />
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
});
