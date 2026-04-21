import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
export interface LoaderProps {
  size?: number | 'small' | 'large';
  color?: string;
  inline?: boolean;
}
export const Loader: React.FC<LoaderProps> = ({ size = 'large', color, inline = false }) => {
  const { colors } = useTheme();
  if (inline) {
    return <ActivityIndicator size={size} color={color || colors.primary} />;
  }
  return (
    <View style={styles.center}>
      <ActivityIndicator size={size} color={color || colors.primary} />
    </View>
  );
};
const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
});
