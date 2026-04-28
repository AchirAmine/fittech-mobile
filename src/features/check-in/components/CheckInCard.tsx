import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';

export const CheckInCard = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.textPrimary }]}>
          QUICK CHECK-IN
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate(ROUTES.MAIN.CHECK_IN as any)}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.cardSecondary }]}>
          <Ionicons name="qr-code-outline" size={28} color={colors.primaryMid} />
        </View>
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Ready to check in?</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Scan the QR code at the entrance
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.success }]}>OPEN NOW</Text>
          </View>
        </View>
        <View style={[styles.qrBadge, { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }]}>
          <Ionicons name="scan-outline" size={20} color={colors.primaryMid} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
    opacity: 0.7,
  },
  qrBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
