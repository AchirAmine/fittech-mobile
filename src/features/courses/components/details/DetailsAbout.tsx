import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';

interface Props {
  description: string;
}

const DetailsAbout: React.FC<Props> = ({ description }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.aboutSection}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About this session</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  aboutSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 22,
  },
});

export default DetailsAbout;
