import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { Input, NeonButton } from '@shared/components/ui';
import { useGetAccount, useUpdateAccount } from '@features/account/hooks/useAccount';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SectionCard, InfoRow, ProfileAvatar } from '../components';

import { useEditableHeader } from '../hooks/useEditableHeader';

const profileSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
});

export const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const { data: userData, isLoading: loading } = useGetAccount();
  const { mutate: updateMe, isPending: updating } = useUpdateAccount();
  
  const { isEditing, setIsEditing } = useEditableHeader({ 
    colors,
    isUpdating: updating 
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      email: userData?.email || '',
      phone: userData?.phone || '',
    },
  });

  useEffect(() => {
    if (userData) {
      reset({ 
        email: userData.email, 
        phone: userData.phone || '' 
      });
    }
  }, [userData, reset]);

  const onSubmit = (data: any) => {
    updateMe(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <ProfileAvatar userData={userData} colors={colors} />

        <View style={styles.form}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <SectionCard title="Personal Information" colors={colors} isDark={isDark}>
              <InfoRow label="First Name"  value={userData?.firstName || ''}  icon="person-outline" colors={colors} isDark={isDark} />
              <InfoRow label="Last Name"   value={userData?.lastName || ''}   icon="person-outline" colors={colors} isDark={isDark} />
              <InfoRow label="Gender"      value={userData?.gender || ''}     icon="male-female-outline" colors={colors} isDark={isDark} />
              <InfoRow
                label="Birth Date"
                value={userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : ''}
                icon="calendar-outline"
                colors={colors}
                isDark={isDark}
              />
            </SectionCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <SectionCard title="Contact Details" colors={colors} isDark={isDark}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Email Address"
                    labelBg={isDark ? colors.card : '#fff'}
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    containerStyle={styles.inputSpacing}
                    icon="mail-outline"
                    editable={isEditing}
                  />
                )}
              />
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Phone Number"
                    labelBg={isDark ? colors.card : '#fff'}
                    value={value}
                    onChangeText={onChange}
                    error={errors.phone?.message}
                    containerStyle={styles.inputSpacing}
                    icon="call-outline"
                    editable={isEditing}
                  />
                )}
              />
            </SectionCard>
          </Animated.View>

          {isEditing && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <NeonButton
                title="Save Changes"
                onPress={handleSubmit(onSubmit)}
                loading={updating}
                style={styles.saveButton}
              />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  form: { paddingHorizontal: 20, gap: 20 },
  inputSpacing: { marginBottom: 16 },
  saveButton: { marginTop: 10, height: 58 },
});