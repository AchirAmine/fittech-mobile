import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Linking, Platform, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, InferType } from 'yup';

import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { useTheme } from '@shared/hooks/useTheme';
import logger from '@shared/utils/logger';
import { Theme } from '@shared/constants/theme';
import { GENDER_OPTIONS } from '@shared/constants/authConstants';
import { AppScreen, Input, NeonButton, BackButton } from '@shared/components';
import { StepHeading, RegisterStepHeader } from '@features/auth/components';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep1'>;

const registerStep1Schema = object().shape({
  firstName: string().trim().required('First name is required'),
  lastName: string().trim().required('Last name is required'),
  phone: string().trim().required('Phone number is required'),
  dateOfBirth: string().trim().required('Date of birth is required')
    .test('is-valid-date', 'Invalid date', (value) => {
      if (!value) return false;
      const parts = value.split('/');
      if (parts.length !== 3) return false;
      const [d, m, y] = parts.map(Number);
      const date = new Date(y, m - 1, d);
      return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    })
    .test('age-range', 'Age must be between 5 and 80', (value) => {
      if (!value) return false;
      const parts = value.split('/');
      const [d, m, y] = parts.map(Number);
      const birthDate = new Date(y, m - 1, d);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 5 && age <= 80;
    }),
  gender: string().required('Please select your gender'),
  photo: string().optional(),
});

const RegisterStep1Screen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerStep1Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      gender: '' as 'male' | 'female' | '',
      photo: undefined as string | undefined,
    },
  });

  const photoUri = watch('photo');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Needed',
        'FitTech needs access to your camera roll to upload a profile photo.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0]) {
        setValue('photo', result.assets[0].uri);
      }
    } catch (error) {
      logger.error('Image picking error:', error);
    }
  }, [setValue]);

  const handleDateChange = useCallback((text: string, currentVal: string, onChange: (val: string) => void) => {
    const isDeleting = text.length < currentVal.length;
    let cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    
    if (!isDeleting && (cleaned.length === 2 || cleaned.length === 4)) {
      formatted += '/';
    }
    
    onChange(formatted);
  }, []);

  const handleDateSelect = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formatted = `${day}/${month}/${year}`;
      setValue('dateOfBirth', formatted, { shouldValidate: true });
    }
  }, [setValue]);

  const onSubmit = useCallback((data: InferType<typeof registerStep1Schema>) => {
    const signupData: SignupData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      dateOfBirth: data.dateOfBirth.trim(),
      gender: data.gender as 'male' | 'female',
      photo: data.photo,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP2, { data: signupData });
  }, [navigation]);

  return (
    <AppScreen
      header={
        <RegisterStepHeader
          currentStep={1}
          totalSteps={7}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <NeonButton title="Continue" onPress={handleSubmit(onSubmit)} style={styles.continueBtn} />
      }
    >

      <StepHeading title="Introduce yourself !" />


      <TouchableOpacity
        style={styles.avatarWrap}
        onPress={handlePickImage}
        activeOpacity={0.8}
      >
        <View style={[styles.avatarWrapper, { borderColor: colors.border }]}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.cardSecondary }]}>
              <Ionicons name="person" size={80 * 0.6} color={colors.primaryMid} />
            </View>
          )}
        </View>
        <View
          style={[
            styles.editBadge,
            {
              backgroundColor: colors.primary,
              borderColor: colors.white,
            },
          ]}
        >
          <Ionicons name="camera-outline" size={80 * 0.18} color={colors.white} />
        </View>
      </TouchableOpacity>


      <View style={styles.form}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="First Name"
              icon="person-outline"
              placeholder="First Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Last Name"
              icon="person-outline"
              placeholder="Last Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.lastName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Phone number"
              icon="call-outline"
              placeholder="+213 555 555 555"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Date of Birth"
              icon="calendar-outline"
              placeholder="DD/MM/YYYY"
              onBlur={onBlur}
              onChangeText={(text) => handleDateChange(text, value, onChange)}
              value={value}
              keyboardType="number-pad"
              maxLength={10}
              onIconPress={() => setShowDatePicker(true)}
              error={errors.dateOfBirth?.message}
            />
          )}
        />

        {showDatePicker && (
          <DateTimePicker
            value={(() => {
              const parts = dateOfBirth.split('/');
              if (parts.length === 3) {
                const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                return isNaN(d.getTime()) ? new Date() : d;
              }
              return new Date();
            })()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateSelect}
            maximumDate={(() => {
              const d = new Date();
              d.setFullYear(d.getFullYear() - 5);
              return d;
            })()}
            minimumDate={(() => {
              const d = new Date();
              d.setFullYear(d.getFullYear() - 80);
              return d;
            })()}
          />
        )}


        <View>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Gender</Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.genderBtn,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      value === opt.id && { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
                    ]}
                    onPress={() => onChange(opt.id)}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={value === opt.id ? colors.white : colors.textSecondary}
                    />
                    <Text style={[
                      styles.genderBtnText,
                      { color: colors.textSecondary },
                      value === opt.id && { color: colors.white },
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.gender?.message ? <Text style={[styles.errorText, { color: colors.error }]}>{String(errors.gender.message)}</Text> : null}
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  form: { gap: 16 },
  label: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 14,
    marginBottom: 8,
  },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Theme.Radius.lg,
    borderWidth: 1.5,
    height: 52,
  },
  genderBtnText: {
    fontFamily: Theme.Typography.fontFamily.medium,
    fontSize: 15,
  },
  errorText: {
    fontFamily: Theme.Typography.fontFamily.regular,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  continueBtn: { marginTop: 32 },
});

export default memo(RegisterStep1Screen);
