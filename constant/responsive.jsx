import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const baseWidth = 750;
const baseHeight = 950;

export const horizontalScale = (size) => (SCREEN_WIDTH / baseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / baseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;
export const isTablet = SCREEN_WIDTH >= 768;