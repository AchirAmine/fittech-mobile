import { Dimensions } from 'react-native';

const BASE_WIDTH = 375; // iPhone 6/7/8 reference width

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const widthScale = SCREEN_WIDTH / BASE_WIDTH;

/**
 * Scales a size value proportionally to the screen width.
 * Use for horizontal dimensions (font sizes, padding, margins).
 *
 * @example
 * fontSize: scale(16) // 16 on 375px → larger on 414px, smaller on 320px
 */
export const scale = (size: number): number => Math.round(size * widthScale);

/**
 * Scales a size value proportionally to the screen height.
 * Use for vertical dimensions (heights, top/bottom padding).
 */
export const verticalScale = (size: number): number => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const BASE_HEIGHT = 667; // iPhone 6/7/8 reference height
  return Math.round(size * (SCREEN_HEIGHT / BASE_HEIGHT));
};

/**
 * A moderate scale that blends between the original size and a fully scaled size.
 * Ideal for font sizes — prevents extreme scaling on very large or very small screens.
 *
 * @param size - The original size
 * @param factor - Blend factor: 0 = no scaling, 1 = full scaling. Default is 0.5.
 *
 * @example
 * fontSize: moderateScale(14)       // gentle scaling
 * fontSize: moderateScale(14, 0.3)  // even gentler
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  Math.round(size + (scale(size) - size) * factor);
