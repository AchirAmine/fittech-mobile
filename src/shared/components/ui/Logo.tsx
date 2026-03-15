import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  textColor,
  style 
}) => {
  const { colors } = useTheme();
  
  const iconSize = size === 'large' ? 44 : size === 'medium' ? 28 : 20;
  const fontSize = size === 'large' ? 48 : size === 'medium' ? 32 : 24;
  const gap = size === 'large' ? 12 : size === 'medium' ? 8 : 6;
  
  const activeColor = textColor || colors.primaryMid;

  return (
    <View style={[styles.container, { gap }, style]}>
      <View style={styles.textContainer}>
        <Text style={[
          styles.text, 
          { fontSize, color: activeColor, fontFamily: Theme.Typography.fontFamily.bold }
        ]}>
          FitTech
        </Text>
        <View style={styles.iconWrap}>
          <Ionicons 
            name="barbell" 
            size={iconSize} 
            color={activeColor} 
            style={styles.icon}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    letterSpacing: -0.5,
  },
  iconWrap: {
    marginLeft: 4,
    transform: [{ rotate: '-45deg' }],
  },
  icon: {
    marginTop: 2,
  }
});
