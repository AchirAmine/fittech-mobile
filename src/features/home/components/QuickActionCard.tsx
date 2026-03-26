import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
}

const QuickActionCard: React.FC<Props> = ({ title, icon, iconBg, iconColor, onPress }) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: isDark ? hexToRGBA(colors.white, 0.03) : '#F8F9FA',
          borderColor: isDark ? hexToRGBA(colors.white, 0.05) : '#EEE',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default QuickActionCard;
