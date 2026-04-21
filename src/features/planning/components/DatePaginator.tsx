import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
interface Props {
  onPrev: () => void;
  onNext: () => void;
  onCalendarPress: () => void;
}
const DatePaginator: React.FC<Props> = ({ onPrev, onNext, onCalendarPress }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onPrev} 
        style={styles.arrowBtn} 
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCalendarPress} style={styles.centerSection}>
        <Ionicons name="calendar-outline" size={26} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={onNext} 
        style={styles.arrowBtn} 
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginRight: -8,
  },
  arrowBtn: {
    padding: 4,
  },
  centerSection: {
    padding: 4,
  },
});
export default memo(DatePaginator);
