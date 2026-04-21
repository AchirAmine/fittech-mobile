import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { hexToRGBA } from '@shared/constants/colors';
const { width } = Dimensions.get('window');
interface CoachHeroProps {
  name: string;
  image: any;
  clientsCount: number;
  experience: string;
}
export const CoachHero = ({ name, image, clientsCount, experience }: CoachHeroProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.name}>{name.toUpperCase()}</Text>
          <View style={styles.row}>
            <View style={styles.ratingContainer}>
              <View style={[styles.starCircle, { backgroundColor: hexToRGBA(colors.warning, 0.2) }]}>
                <Ionicons name="star" size={12} color={colors.warning} />
              </View>
              <Text style={styles.stats}>{clientsCount} clients</Text>
            </View>
            <View style={styles.ratingContainer}>
              <View style={[styles.starCircle, { backgroundColor: hexToRGBA(colors.primary, 0.2) }]}>
                <Ionicons name="time" size={12} color={colors.primary} />
              </View>
              <Text style={styles.stats}>{experience} Exp.</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  content: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  name: {
    fontSize: 28,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: '#FFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  starCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: '#FFF',
  },
});
