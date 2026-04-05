import React, { memo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image,
  Dimensions, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { hexToRGBA } from '@shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { AuthHeader } from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'AboutUs'>;

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    id: '1',
    title: 'Easy Class Booking',
    description: 'Never miss a session. Browse our live schedules and book your favorite HIIT, Yoga, or Strength classes in seconds through our intuitive app interface.',
    icon: 'calendar-outline',
  },
  {
    id: '2',
    title: 'Personalized Training',
    description: 'Each coach consults your health profile before class. From back injuries to weight goals, every session is tailored to you.',
    icon: 'fitness-outline',
  },
  {
    id: '3',
    title: 'Smart Equipment Tracking',
    description: 'Our facility syncs seamlessly with IoT devices. Monitor your real-time performance data, health metrics, and intensity levels directly on your smartphone.',
    icon: 'bar-chart-outline',
  },
];

const SERVICES = [
  {
    id: '1',
    title: 'Gym Training',
    description: 'Elite strength equipment',
    rating: 4.9,
    image: 'weights',
  },
  {
    id: '2',
    title: 'Swimming',
    description: 'Heated olympic pool',
    rating: 4.8,
    image: 'swimming',
  },
];

const STATS = [
  { value: '2,000+', label: 'Active Members per year' },
  { value: '30+', label: 'Certified Coaches' },
  { value: '15+', label: 'Smart Locations' },
  { value: '98%', label: 'Success Rate' },
];

const FEEDBACKS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Professional Athlete',
    text: "The coaches here genuinely care. They looked at my health profile before every session and adjusted the workout around my back injury. I've never felt safer pushing my limits!",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Tech Entrepreneur',
    text: "As a busy professional, the easy class booking is a lifesaver. I can schedule a session between meetings and the AI trainer knows exactly what I need to focus on each day. It's like having a concierge for my health!",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
];

const ABOUT_US_IMAGE = require('../../assets/about-us-hero-illustration.png') as number;

const AboutUsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <AuthHeader
            title="About Us"
            showLogo={true}
            logoSize="large" />
          
          <View style={styles.heroSection}>
            <View style={styles.heroImageContainer}>
              <Image 
                source={ABOUT_US_IMAGE}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', hexToRGBA('#000000', 0.9)]}
                style={styles.heroOverlay}
              >
                <Text style={styles.heroTitle}>Elevate Your Fitness Journey</Text>
                <Text style={styles.heroDescription}>
                  FitTech is Sidi Bel Abbés' first connected gym — blending cutting-edge equipment, personalized coaching, and smart technology to push every member beyond their limits.
                </Text>
                
                <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: colors.primaryMid, shadowColor: colors.primary }]}>
                  <Text style={[styles.getStartedButtonText, { color: colors.white }]}>Get Started Today</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.statsSection}>
            {STATS.map((stat, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.centeredTitle, { color: colors.textPrimary }]}>Why Fit-Tech</Text>
            <View style={styles.featuresList}>
              {FEATURES.map(feature => (
                <View key={feature.id} style={[styles.featureCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                  <View style={styles.featureHeader}>
                    <View style={[styles.featureIconContainer, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
                      <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={24} color={colors.primary} />
                    </View>
                    <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                  </View>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.centeredTitle, { color: colors.textPrimary }]}>Our Services</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.servicesScroll}
            >
              {SERVICES.map(service => (
                <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.serviceImagePlaceholder, { backgroundColor: colors.background }]}>
                    <Ionicons name={service.id === '1' ? 'barbell-outline' : 'water-outline'} size={40} color={colors.primary} />
                  </View>
                  <View style={styles.serviceContent}>
                    <View style={styles.serviceRow}>
                      <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>{service.title}</Text>
                      <View style={styles.serviceRating}>
                        <Ionicons name="star" size={14} color="#FFA500" />
                        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{service.rating}</Text>
                      </View>
                    </View>
                    <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>{service.description}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.centeredTitle, { color: colors.textPrimary }]}>Best Feedbacks</Text>
            <View style={styles.feedbacksList}>
              {FEEDBACKS.map(feedback => (
                <View key={feedback.id} style={[styles.feedbackCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                  <View style={styles.feedbackHeader}>
                    <Image source={{ uri: feedback.avatar }} style={styles.feedbackAvatar} />
                    <View style={styles.feedbackInfo}>
                      <Text style={[styles.feedbackName, { color: colors.textPrimary }]}>{feedback.name}</Text>
                      <Text style={[styles.feedbackRole, { color: colors.primary }]}>{feedback.role}</Text>
                    </View>
                    <Ionicons name="chatbubbles-outline" size={30} color={hexToRGBA(colors.primary, 0.1)} style={styles.quoteIcon} />
                  </View>
                  <Text style={[styles.feedbackText, { color: colors.textSecondary }]}>{`"${feedback.text}"`}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerBrand}>
              <Ionicons name="flash-outline" size={24} color={colors.primary} />
              <Text style={[styles.footerLogo, { color: colors.textPrimary }]}>FitTech</Text>
            </View>
            
            <View style={styles.footerContactContainer}>
              <View style={styles.footerContactItem}>
                <Ionicons name="call" size={18} color={colors.primary} />
                <Text style={[styles.footerContactText, { color: colors.textPrimary }]}>+213 (0) 770 12 34 56</Text>
              </View>
              <View style={styles.footerContactItem}>
                <Ionicons name="location" size={18} color={colors.primary} />
                <Text style={[styles.footerContactText, { color: colors.textPrimary }]}>Cité 20 Août, Sidi Bel Abbés, Algeria</Text>
              </View>
            </View>
            <Text style={[styles.copyright, { color: colors.textMuted }]}>© {new Date().getFullYear()} FitTech Inc. All rights reserved.</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  heroImageContainer: {
    width: '100%',
    height: 480,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 28,
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heroDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 15,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    marginBottom: 32,
  },
  getStartedButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: Theme.Radius.lg,
    marginTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 18,
  },
  statsSection: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    marginBottom: 48,
    paddingVertical: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 32,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    paddingVertical: 48,
    marginBottom: 0,
  },
  centeredTitle: {
    textAlign: 'center',
    marginBottom: 36,
  },
  sectionTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 24,
  },
  featuresList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featureCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 18,
    flex: 1,
  },
  featureDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  servicesScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  serviceCard: {
    width: 240,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceImagePlaceholder: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    padding: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
  },
  serviceDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 13,
  },
  feedbacksList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  feedbackCard: {
    padding: 24,
    borderRadius: 20,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    position: 'relative',
  },
  feedbackAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  feedbackInfo: {
    flex: 1,
  },
  feedbackName: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
  },
  feedbackRole: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 12,
  },
  quoteIcon: {
    position: 'absolute',
    right: 0,
    top: -5,
  },
  feedbackText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {
    padding: 32,
    alignItems: 'flex-start',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  footerLogo: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 20,
  },
  footerContactContainer: {
    marginTop: 2,
    marginBottom: 16,
  },
  footerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerContactText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 13,
    marginLeft: 10,
  },
  copyright: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
  },
});

export default memo(AboutUsScreen);
