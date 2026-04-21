import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
type IoniconsName = keyof typeof Ionicons.glyphMap;
export interface IllustrationPlaceholderProps {
  icon?: IoniconsName;
  image?: ImageSourcePropType;
  size?: number;
  width?: number;
  height?: number;
  iconStyle?: object;
}
export const IllustrationPlaceholder: React.FC<IllustrationPlaceholderProps> = ({
  icon,
  image,
  size = 160,
  width,
  height,
  iconStyle,
}) => {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const baseWidth = 320;
  const baseHeight = 225;
  const scale = screenWidth >= 360 ? 1 : screenWidth / 360;
  const responsiveWidth = baseWidth * scale;
  const responsiveHeight = baseHeight * scale;
  const isCircular = !image;
  const containerSize = isCircular ? size : undefined;
  const containerWidth = width ?? (isCircular ? size : responsiveWidth);
  const containerHeight = height ?? (isCircular ? size : responsiveHeight);
  if (image) {
    return (
      <View style={[styles.imageWrap, { width: containerWidth, height: containerHeight }]}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.iconWrap,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize ? containerSize / 2 : 80,
          backgroundColor: '#F0F4FF',
        },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={80}
          color={colors.primary}
          style={[styles.icon, iconStyle]}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  iconWrap: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {},
  imageWrap: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
