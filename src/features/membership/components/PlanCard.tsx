import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Theme } from '@shared/constants/theme';
import { ThemeColors, hexToRGBA } from '@shared/constants/colors';
import { SubscriptionPlan } from '@appTypes/index';
import { PlanFeaturesList } from './PlanFeaturesList';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface PlanCardProps {
  plan: SubscriptionPlan;
  colors: ThemeColors;
  isDark: boolean;
  onPress: () => void;
  index: number;
}

export const PlanCard = ({ plan, colors, isDark, onPress, index }: PlanCardProps) => {
  const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    'BEST VALUE': { bg: colors.error, text: colors.white },
    'POPULAR': { bg: colors.info, text: colors.white },
  };

  const badgeColors = plan.badge ? BADGE_COLORS[plan.badge] ?? { bg: colors.textMuted, text: colors.white } : null;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 150).duration(600)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          shadowColor: isDark ? colors.black : colors.primaryMid,
        },
      ]}
    >
      {}
      <View style={styles.imageContainer}>
        <Image
          source={typeof plan.image === 'string' ? { uri: plan.image } : plan.image}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', hexToRGBA(colors.black, 0.72)]}
          style={styles.imageGradient}
        >
          <View style={styles.imageOverlayContent}>
            <Text style={[styles.overlayTitle, { color: colors.white }]} numberOfLines={2}>
              {plan.title}
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.overlayPrice, { color: colors.white }]}>
                {plan.price.toLocaleString()} {plan.currency}
              </Text>
              <Text style={[styles.overlayPriceUnit, { color: hexToRGBA(colors.white, 0.75) }]}>
                /{plan.billingCycle === 'annual' ? 'yr' : 'mo'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {}
        {plan.badge && badgeColors && (
          <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
            <Text style={[styles.badgeText, { color: badgeColors.text }]}>{plan.badge}</Text>
          </View>
        )}

        {}
        <View style={[
          styles.starsBadge, 
          { 
            backgroundColor: colors.warning,
            right: plan.badge ? 100 : 12 
          }
        ]}>
          <Ionicons name="star" size={12} color={colors.white} />
          <Text style={styles.starsBadgeText}>{plan.starsAwarded}</Text>
        </View>
      </View>

      {}
      <View style={styles.body}>
        {}
        <PlanFeaturesList features={plan.features} alignment="center" />

        {}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Join Now</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  imageContainer: {
    height: 170,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  imageOverlayContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  overlayTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    flexShrink: 1,
    textAlign: 'left',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  overlayPrice: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.semiBold,
  },
  overlayPriceUnit: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  body: {
    padding: 18,
    gap: 14,
  },
  button: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  buttonIcon: {
    marginTop: 1,
  },
  starsBadge: {
    position: 'absolute',
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  starsBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
