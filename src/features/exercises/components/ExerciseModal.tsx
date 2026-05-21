import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '@shared/components/ui/Modal';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { useExerciseDetailQuery } from '../hooks/useExercises';
import { Exercise } from '../services/exerciseService';

interface ExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseId: string | null;
  initialExercise: Exercise | null;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  onClose,
  exerciseId,
  initialExercise,
}) => {
  const { colors, isDark } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [gifLoading, setGifLoading] = useState(true);

  const { data: detailData, isLoading: isDetailLoading } = useExerciseDetailQuery(
    exerciseId,
    visible && !!exerciseId
  );

  const exercise = detailData?.data || initialExercise;

  if (!exercise) return null;

  const formatName = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const name = formatName(exercise.name);

  const bodyPart = exercise.bodyParts && exercise.bodyParts.length > 0 ? exercise.bodyParts[0] : null;
  const targetMuscle = exercise.targetMuscles && exercise.targetMuscles.length > 0 ? exercise.targetMuscles[0] : null;
  const equipment = exercise.equipments && exercise.equipments.length > 0 ? exercise.equipments[0] : null;
  const secondaryMuscles = exercise.secondaryMuscles || [];
  const instructions = exercise.instructions || [];

  const maxContentHeight = windowHeight * 0.75;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={name}
      contentStyle={{ paddingBottom: 0 }}
    >
      <ScrollView
        style={{ maxHeight: maxContentHeight }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.gifContainer,
            {
              backgroundColor: isDark ? colors.background : hexToRGBA(colors.black, 0.02),
              borderColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.05),
            },
          ]}
        >
          {exercise.gifUrl ? (
            <>
              <Image
                source={{ uri: exercise.gifUrl }}
                style={styles.gifImage}
                onLoadStart={() => setGifLoading(true)}
                onLoad={() => setGifLoading(false)}
                onError={() => setGifLoading(false)}
                resizeMode="contain"
              />
              {gifLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={colors.primaryMid} />
                </View>
              )}
            </>
          ) : (
            <View style={styles.noGifContainer}>
              <Ionicons name="barbell-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.noGifText, { color: colors.textSecondary }]}>No animation available</Text>
            </View>
          )}
        </View>

        {isDetailLoading && !instructions.length && (
          <View style={styles.detailLoadingContainer}>
            <ActivityIndicator size="small" color={colors.primaryMid} />
            <Text style={[styles.detailLoadingText, { color: colors.textSecondary }]}>
              Loading instructions & metadata...
            </Text>
          </View>
        )}

        <View style={styles.metadataGrid}>
          {bodyPart && (
            <View style={[styles.metadataCard, { backgroundColor: colors.cardSecondary }]}>
              <Ionicons name="body-outline" size={16} color={colors.primaryMid} />
              <Text style={[styles.metadataLabel, { color: colors.textSecondary }]}>BODY PART</Text>
              <Text style={[styles.metadataValue, { color: colors.textPrimary }]}>
                {bodyPart.toUpperCase()}
              </Text>
            </View>
          )}

          {targetMuscle && (
            <View style={[styles.metadataCard, { backgroundColor: colors.cardSecondary }]}>
              <Ionicons name="fitness-outline" size={16} color={colors.primaryMid} />
              <Text style={[styles.metadataLabel, { color: colors.textSecondary }]}>TARGET</Text>
              <Text style={[styles.metadataValue, { color: colors.textPrimary }]}>
                {targetMuscle.toUpperCase()}
              </Text>
            </View>
          )}

          {equipment && (
            <View style={[styles.metadataCard, { backgroundColor: colors.cardSecondary }]}>
              <Ionicons name="barbell-outline" size={16} color={colors.primaryMid} />
              <Text style={[styles.metadataLabel, { color: colors.textSecondary }]}>EQUIPMENT</Text>
              <Text style={[styles.metadataValue, { color: colors.textPrimary }]}>
                {equipment.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {secondaryMuscles.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>SECONDARY MUSCLES</Text>
            <View style={styles.secondaryMusclesRow}>
              {secondaryMuscles.map((muscle, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.secondaryMuscleTag,
                    {
                      backgroundColor: isDark ? hexToRGBA(colors.white, 0.05) : hexToRGBA(colors.black, 0.03),
                      borderColor: isDark ? hexToRGBA(colors.white, 0.1) : hexToRGBA(colors.black, 0.05),
                    },
                  ]}
                >
                  <Text style={[styles.secondaryMuscleText, { color: colors.textSecondary }]}>
                    {muscle.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {instructions.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>INSTRUCTIONS</Text>
            <View style={styles.instructionsList}>
              {instructions.map((step, index) => (
                <View key={index} style={styles.instructionStep}>
                  <View style={[styles.stepNumberBadge, { backgroundColor: colors.primaryMid }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: colors.textPrimary }]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View
          style={[
            styles.attributionContainer,
            {
              borderTopColor: isDark ? hexToRGBA(colors.white, 0.08) : hexToRGBA(colors.black, 0.05),
            },
          ]}
        >
          <Text style={[styles.attributionText, { color: colors.textMuted }]}>
            Powered by <Text style={[styles.attributionBold, { color: colors.textSecondary }]}>AscendAPI</Text>
          </Text>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  gifContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  noGifContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noGifText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  detailLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  detailLoadingText: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  metadataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  metadataCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 70,
  },
  metadataLabel: {
    fontSize: 8,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  metadataValue: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    marginBottom: 10,
  },
  secondaryMusclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  secondaryMuscleTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryMuscleText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  instructionsList: {
    gap: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 18,
  },
  attributionContainer: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  attributionText: {
    fontSize: 11,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  attributionBold: {
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});
