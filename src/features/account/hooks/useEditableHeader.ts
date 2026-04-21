import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '@shared/constants/theme';
import { ThemeColors } from '@shared/constants/colors';
interface UseEditableHeaderProps {
  colors: ThemeColors;
  onSave?: () => void;
  onCancel?: () => void;
  isUpdating?: boolean;
}
export const useEditableHeader = ({ colors, onSave, onCancel, isUpdating }: UseEditableHeaderProps) => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => {
    if (isEditing && onCancel) {
      onCancel();
    }
    setIsEditing(!isEditing);
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        React.createElement(TouchableOpacity, {
          onPress: toggleEdit,
          activeOpacity: 0.7,
          style: styles.headerButton,
          disabled: isUpdating,
        }, 
          React.createElement(Text, {
            style: {
              color: isEditing ? colors.error : colors.primary,
              fontFamily: Theme.Typography.fontFamily.semiBold,
              fontSize: 16,
              opacity: isUpdating ? 0.5 : 1,
            }
          }, isEditing ? 'Cancel' : 'Edit')
        )
      ),
    });
  }, [navigation, isEditing, colors, isUpdating]);
  return { isEditing, setIsEditing, toggleEdit };
};
const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 8,
  },
});
