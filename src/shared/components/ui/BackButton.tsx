import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, style }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.container, 
        style
      ]}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
