import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.75;

interface ScannerOverlayProps {
  scanLineAnim: Animated.Value;
  hintText: string;
}

export const ScannerOverlay = ({ scanLineAnim, hintText }: ScannerOverlayProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.scannerWrapper}>
      <View style={styles.scannerFrame}>
        <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
        <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
        <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
        <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
        
        <Animated.View 
          style={[
            styles.scanLine, 
            { 
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              transform: [{
                translateY: scanLineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, SCAN_SIZE]
                })
              }]
            }
          ]} 
        />
      </View>
      <Text style={styles.hintText}>{hintText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerWrapper: {
    alignItems: 'center',
  },
  scannerFrame: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: '100%',
    height: 3,
    position: 'absolute',
    top: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },
  hintText: {
    color: '#fff',
    marginTop: 30,
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
  },
});
