import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

interface HomeExerciseCardProps {
  onPress?: () => void;
}

export const HomeExerciseCard: React.FC<HomeExerciseCardProps> = ({ onPress }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            borderColor: isDark
              ? hexToRGBA(colors.white, 0.05)
              : hexToRGBA(colors.black, 0.04),
          },
        ]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        {/* Left icon section */}
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: hexToRGBA(colors.primaryMid, isDark ? 0.2 : 0.1) },
          ]}
        >
          <Ionicons name="barbell-outline" size={26} color={colors.primaryMid} />
        </View>

        {/* Text content */}
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Exercise Database
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Explore 1,500+ exercises with animations & step-by-step instructions
          </Text>

          {/* Mini tag row */}
          <View style={styles.tagRow}>
            {['Chest', 'Back', 'Legs', 'Cardio'].map((tag) => (
              <View
                key={tag}
                style={[
                  styles.miniTag,
                  {
                    backgroundColor: isDark
                      ? hexToRGBA(colors.white, 0.06)
                      : hexToRGBA(colors.primaryMid, 0.08),
                  },
                ]}
              >
                <Text style={[styles.miniTagText, { color: colors.primaryMid }]}>{tag}</Text>
              </View>
            ))}
            <Text style={[styles.moreTag, { color: colors.textMuted }]}>+more</Text>
          </View>
        </View>

        {/* Chevron arrow */}
        <View
          style={[
            styles.arrowContainer,
            { backgroundColor: isDark ? colors.background : colors.cardSecondary },
          ]}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.primaryMid} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 17,
    opacity: 0.85,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  miniTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  miniTagText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.2,
  },
  moreTag: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
