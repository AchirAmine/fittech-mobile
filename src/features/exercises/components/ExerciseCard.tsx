import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { Exercise } from '../services/exerciseService';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: (exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const { colors, isDark } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);

  // Capitalize name helper: "barbell bench press" -> "Barbell Bench Press"
  const formatName = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const name = formatName(exercise.name);
  const primaryTag = exercise.bodyParts && exercise.bodyParts.length > 0 ? exercise.bodyParts[0] : null;
  const secondaryTag = exercise.targetMuscles && exercise.targetMuscles.length > 0 ? exercise.targetMuscles[0] : null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          borderColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05),
        },
      ]}
      onPress={() => onPress(exercise)}
    >
      <View style={styles.contentRow}>
        {/* GIF Preview Thumbnail */}
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: isDark ? colors.background : hexToRGBA(colors.black, 0.03),
            },
          ]}
        >
          {exercise.gifUrl ? (
            <>
              <Image
                source={{ uri: exercise.gifUrl }}
                style={styles.image}
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                resizeMode="cover"
              />
              {imageLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color={colors.primaryMid} />
                </View>
              )}
            </>
          ) : (
            <Ionicons name="barbell-outline" size={24} color={colors.textSecondary} />
          )}
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          {/* Tags */}
          <View style={styles.tagRow}>
            {primaryTag && (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: hexToRGBA(colors.primaryMid, 0.12),
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.primaryMid }]}>
                  {primaryTag.toUpperCase()}
                </Text>
              </View>
            )}
            {secondaryTag && (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: hexToRGBA(colors.success, 0.12),
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.success }]}>
                  {secondaryTag.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text style={[styles.exerciseName, { color: colors.textPrimary }]} numberOfLines={2}>
            {name}
          </Text>
        </View>

        {/* Action Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.3,
  },
  exerciseName: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.bold,
    lineHeight: 20,
  },
  iconContainer: {
    paddingLeft: 8,
  },
});
