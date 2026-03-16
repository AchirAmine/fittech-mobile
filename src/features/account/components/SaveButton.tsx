import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NeonButton } from '@shared/components/ui';

interface SaveButtonProps {
  isEditing: boolean;
  onPress: () => void;
  isLoading?: boolean;
  title?: string;
  style?: ViewStyle;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  isEditing,
  onPress,
  isLoading = false,
  title = 'Save Changes',
  style,
}) => {
  if (!isEditing) return null;

  return (
    <Animated.View entering={FadeInDown.duration(400)}>
      <NeonButton
        title={title}
        onPress={onPress}
        loading={isLoading}
        style={[styles.button, style]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 58,
  },
});
