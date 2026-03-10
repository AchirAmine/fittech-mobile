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
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@appTypes/navigation.types';
import { NeonButton } from '@shared/components/ui';
import { AuthHeader } from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'AboutUs'>;

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    id: '1',
    title: 'Smart Equipment Tracking',
    description: 'Monitor your progress with advanced equipment tracking',
    icon: 'bar-chart-outline',
  },
  {
    id: '2',
    title: 'Easy Class Booking',
    description: 'Book classes instantly with our streamlined system',
    icon: 'calendar-outline',
  },
  {
    id: '3',
    title: 'Personalized Training Programs',
    description: 'Custom workouts tailored to your fitness goals',
    icon: 'fitness-outline',
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
  {
    id: '3',
    title: 'Boxing',
    description: 'Professional boxing ring',
    rating: 4.9,
    image: 'boxing',
  },
];

const COACHES = [
  {
    id: '1',
    name: 'Itmuluke Idoye',
    specialty: 'Strength Coach',
    avatar: 'coach1',
  },
  {
    id: '2',
    name: 'Ijaso Adebayo',
    specialty: 'Swimming Coach',
    avatar: 'coach2',
  },
  {
    id: '3',
    name: 'Ayo Amara',
    specialty: 'Boxing Trainer',
    avatar: 'coach3',
  },
];

const ABOUT_US_IMAGE = require('@features/auth/assets/about-us-hero-illustration.png') as number;

const AboutUsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <AuthHeader
          title="About Us"
          showLogo={true}
          logoSize="large" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroImageContainer}>
              <Image 
                source={ABOUT_US_IMAGE}
                style={styles.heroImage}
                resizeMode="contain"
              />

            </View>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Next-gen Fitness Experience</Text>
            <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
              FitTech combines fitness and technology to deliver smarter training, personalized programs, and an improved gym experience.
            </Text>
            <View style={styles.heroButtons}>
              <NeonButton title="Join Now" onPress={() => {}} style={styles.joinButton} />
              <TouchableOpacity style={[styles.exploreButton, { borderColor: colors.primary }]}>
                <Text style={[styles.exploreButtonText, { color: colors.primary }]}>Explore Services</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Why FitTech Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Why FitTech</Text>
            <View style={styles.featuresGrid}>
              {FEATURES.map(feature => (
                <View key={feature.id} style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.featureIcon, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
                    <Ionicons name={feature.icon as any} size={32} color={colors.primary} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Our Services Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Our Services</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.servicesScroll}
            >
              {SERVICES.map(service => (
                <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.serviceImage, { backgroundColor: colors.border }]}>
                    <Ionicons name="barbell-outline" size={40} color={colors.primary} />
                  </View>
                  <View style={styles.serviceContent}>
                    <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>{service.title}</Text>
                    <View style={styles.serviceRating}>
                      <Ionicons name="star" size={14} color="#FFA500" />
                      <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{service.rating}</Text>
                    </View>
                    <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>{service.description}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Meet Our Coaches Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Meet Our Coaches</Text>
            <View style={styles.coachesGrid}>
              {COACHES.map(coach => (
                <View key={coach.id} style={[styles.coachCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.coachAvatar, { backgroundColor: colors.border }]}>
                    <Ionicons name="person-outline" size={40} color={colors.primary} />
                  </View>
                  <Text style={[styles.coachName, { color: colors.textPrimary }]}>{coach.name}</Text>
                  <Text style={[styles.coachSpecialty, { color: colors.primary }]}>{coach.specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <View style={[styles.ctaSection, { backgroundColor: colors.primary }]}>
            <Text style={[styles.ctaTitle, { color: colors.white }]}>Start Your Fitness Journey Today</Text>
            <Text style={[styles.ctaDescription, { color: colors.white }]}>
              Transform your life with personalized coaching and smart technology.
            </Text>
            <TouchableOpacity style={[styles.ctaButton, { backgroundColor: colors.white }]}>
              <Text style={[styles.ctaButtonText, { color: colors.info }]}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerLogo, { color: colors.primary }]}>FitTech</Text>
            <View style={styles.footerInfo}>
              <View style={styles.footerItem}>
                <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>+213 550 123 456</Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>123 Tech Avenue, Fitness Plaza, CyberCity</Text>
              </View>
            </View>
            <Text style={[styles.copyright, { color: colors.textMuted }]}>© 2024 FitTech Inc. All rights reserved.</Text>
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
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 40,
  },
  heroImageContainer: {
    width: width * 0.9,
    height: 250,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  joinButton: {
    flex: 1,
    height: 50,
  },
  exploreButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.Radius.md,
    borderWidth: 2,
  },
  exploreButtonText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 20,
    marginBottom: 20,
  },
  featuresGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  featureCard: {
    padding: 20,
    borderRadius: Theme.Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  seeAllText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
  },
  servicesScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  serviceCard: {
    width: 160,
    borderRadius: Theme.Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    padding: 16,
  },
  serviceTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 12,
    marginLeft: 4,
  },
  serviceDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  coachesGrid: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  coachCard: {
    flex: 1,
    padding: 20,
    borderRadius: Theme.Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  coachAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  coachName: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  coachSpecialty: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 13,
  },
  ctaSection: {
    marginHorizontal: 24,
    padding: 32,
    borderRadius: Theme.Radius.lg,
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaTitle: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: Theme.Radius.md,
  },
  ctaButtonText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerLogo: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 24,
    marginBottom: 16,
  },
  footerInfo: {
    marginBottom: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 14,
    marginLeft: 8,
  },
  copyright: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
  },
});

export default memo(AboutUsScreen);
