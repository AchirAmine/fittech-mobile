import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { AppScreen } from '@shared/components';
import { Input } from '@shared/components/ui/Input';
import { CoachCard } from '../components/CoachCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '@navigation/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@appTypes/navigation.types';
import { useGetCoaches, Coach } from '../hooks/useCoaching';
import { hexToRGBA } from '@shared/constants/colors';
import { useCallback } from 'react';
export const PersonalCoachesScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: coaches = [], isLoading, refetch } = useGetCoaches();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const filteredCoaches = (coaches as Coach[]).filter(coach => 
    coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coach.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[
          styles.statusChip, 
          { backgroundColor: hexToRGBA(colors.primaryMid, 0.1) }
        ]}>
          <View style={[styles.statusDot, { backgroundColor: colors.primaryMid }]} />
          <Text style={[styles.statusText, { color: colors.primaryMid }]}>
            {filteredCoaches.length} COACHES
          </Text>
        </View>
      ),
    });
  }, [navigation, filteredCoaches.length, colors]);
  return (
    <AppScreen 
      safeArea={false} 
      scrollable={false} 
      style={{ backgroundColor: colors.background }}
      isLoading={isLoading}
      loadingMessage="Loading coaches..."
    >
      <FlatList
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              icon="search-outline"
            />
          </View>
        }
        data={filteredCoaches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CoachCard
            name={item.name}
            specialty={item.specialty}
            clientsCount={item.clientsCount}
            image={item.image}
            onPress={() => navigation.navigate(ROUTES.MAIN.COACH_PROFILE as any, { coachId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </AppScreen>
  );
};
const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: 20,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
});
