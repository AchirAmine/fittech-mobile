import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';
import { useTheme } from '@shared/hooks/useTheme';
import { Input } from '@shared/components/ui';
import { useGetAccount, useUpdateAccount } from '@features/account/hooks/useAccount';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SectionCard, InfoRow, ProfileAvatar, SaveButton } from '../components';
import { AppScreen } from '@shared/components';
import { getErrorMessage } from '@shared/constants/errorMessages';
import { useEditableHeader } from '../hooks/useEditableHeader';
const profileSchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
  phone: string().required('Phone number is required'),
});
export const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const { data: userData, isLoading: loading, error: fetchError, refetch } = useGetAccount();
  const { 
    mutate: updateMe, 
    isPending: updating, 
    error: updateError, 
    reset: resetMutation 
  } = useUpdateAccount();
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
  const onSubmit = (data: InferType<typeof profileSchema>) => {
    updateMe(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };
  const handleDismissError = () => {
    if (updateError) resetMutation();
    if (fetchError) refetch();
  };
  return (
    <AppScreen 
      isLoading={loading}
      errorMessage={getErrorMessage(fetchError || updateError)}
      onDismissError={handleDismissError}
      contentContainerStyle={styles.scrollContent}
    >
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
        <SaveButton
          isEditing={isEditing}
          onPress={handleSubmit(onSubmit)}
          isLoading={updating}
        />
      </View>
    </AppScreen>
  );
};
const styles = StyleSheet.create({
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  form: { 
    gap: 20, 
    paddingTop: 20 
  },
  inputSpacing: { 
    marginBottom: 16 
  },
});