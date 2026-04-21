import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { PlanFeature } from '@appTypes/index';

interface PlanFeaturesListProps {
  features: PlanFeature[];
  alignment?: 'center' | 'start';
  
  forceDarkText?: boolean;
}

export const PlanFeaturesList: React.FC<PlanFeaturesListProps> = ({ 
  features, 
  alignment = 'center',
  forceDarkText = false 
}) => {
  const { colors, isDark } = useTheme();

  const isCenter = alignment === 'center';
  const labelColor = forceDarkText ? colors.white : colors.textSecondary;
  const dividerColor = forceDarkText ? colors.border : (isDark ? colors.cardSecondary : colors.border);

  return (
    <View style={[styles.featuresRow, { justifyContent: isCenter ? 'center' : 'flex-start' }]}>
      {features.map((feature, i) => (
        <React.Fragment key={i}>
          <View style={[styles.featureColumn, { alignItems: isCenter ? 'center' : 'flex-start', flex: isCenter ? 1 : undefined }]}>
            <Text style={[
              styles.featureLabel, 
              { color: labelColor },
              !isCenter && styles.featureLabelSmall
            ]}>
              {feature.label}
            </Text>
            <View style={styles.badgesRow}>
              {feature.details.map((detail, dIndex) => {
                const isFreeOrSolo = detail.includes('SOLO') || detail.includes('FREE');
                return (
                  <View 
                    key={dIndex} 
                    style={[
                      styles.detailBadge, 
                      { backgroundColor: isFreeOrSolo ? colors.soloBadgeBg : colors.courseBadgeBg },
                    ]}
                  >
                    <Text style={[styles.detailBadgeText, { color: colors.white }]}>
                      {detail}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          {i < features.length - 1 && (
            <View style={[
              styles.featureDivider, 
              { backgroundColor: dividerColor },
              !isCenter && styles.featureDividerSmall
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  featureColumn: {
    gap: 8,
  },
  featureLabel: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  featureLabelSmall: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.medium,
    letterSpacing: 0.5,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
  },
  detailBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailBadgeText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  featureDivider: {
    width: 1,
    height: '80%',
    marginHorizontal: 12,
  },
  featureDividerSmall: {
    height: 24,
    marginHorizontal: 16,
    marginTop: 14,
  },
});
