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
  firstName: string().min(2).max(50).required('First name is required'),
  lastName: string().min(2).max(50).required('Last name is required'),
  gender: string().oneOf(['male', 'female'], 'Must be male or female').required('Gender is required'),
  dateOfBirth: string().required('Date of birth is required'),
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
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      gender: (userData?.gender || 'male') as 'male' | 'female',
      dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
      email: userData?.email || '',
      phone: userData?.phone || '',
    },
  });
  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        gender: (userData.gender || 'male') as 'male' | 'female',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        email: userData.email,
        phone: userData.phone || ''
      });
    }
  }, [userData, reset]);
  const onSubmit = (data: InferType<typeof profileSchema>) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phone,
    };
    updateMe(payload, {
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
      safeArea={false}

    >
      <ProfileAvatar userData={userData} colors={colors} />
      <View style={styles.form}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <SectionCard title="Personal Information" colors={colors} isDark={isDark}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="First Name"
                  labelBg={colors.card}
                  value={value}
                  onChangeText={onChange}
                  error={errors.firstName?.message}
                  containerStyle={styles.inputSpacing}
                  icon="person-outline"
                  editable={isEditing}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Last Name"
                  labelBg={colors.card}
                  value={value}
                  onChangeText={onChange}
                  error={errors.lastName?.message}
                  containerStyle={styles.inputSpacing}
                  icon="person-outline"
                  editable={isEditing}
                />
              )}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Gender (male/female)"
                  labelBg={colors.card}
                  value={value}
                  onChangeText={onChange}
                  error={errors.gender?.message}
                  containerStyle={styles.inputSpacing}
                  icon="male-female-outline"
                  editable={false}
                />
              )}
            />
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Birth Date (YYYY-MM-DD)"
                  labelBg={colors.card}
                  value={value}
                  onChangeText={onChange}
                  error={errors.dateOfBirth?.message}
                  containerStyle={styles.inputSpacing}
                  icon="calendar-outline"
                  editable={false}
                />
              )}
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
                  labelBg={colors.card}
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  containerStyle={styles.inputSpacing}
                  icon="mail-outline"
                  editable={false}
                  selection={{ start: 0, end: 0 }}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Phone Number"
                  labelBg={colors.card}
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
    paddingHorizontal: 8,
    paddingBottom: 20
  },
  form: {
    gap: 20,
  },
  inputSpacing: {
    marginBottom: 16
  },
});