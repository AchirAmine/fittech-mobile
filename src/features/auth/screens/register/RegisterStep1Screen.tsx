import React, { useState, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Alert, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, SignupData } from '@appTypes/navigation.types';
import { ROUTES } from '@navigation/routes';
import { Theme } from '@shared/constants/theme';
import { useTheme } from '@shared/hooks/useTheme';
import { NeonButton, Input, BackButton, Modal, AppScreen } from '@shared/components';
import {
  StepIndicator,
  StepHeading,
  RegisterStepHeader,
} from '@features/auth/components';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import logger from '@shared/utils/logger';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterStep1'>;

const GENDER_OPTIONS = [
  { id: 'male' as const, label: 'Male', icon: 'male-outline' as const },
  { id: 'female' as const, label: 'Female', icon: 'female-outline' as const },
];

const RegisterStep1Screen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | undefined>(undefined);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      logger.error('Image picking error:', error);
    }
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const parts = dateOfBirth.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts.map(Number);
        const inputDate = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if values are within basic ranges
        const isValidMonth = m >= 1 && m <= 12;
        const isValidDay = d >= 1 && d <= 31;
        const isValidYear = y > 1900 && y < today.getFullYear();

        // Check if the Date object construction matches the input (handles cases like Feb 30 -> Mar 1)
        const matchesInput = inputDate.getFullYear() === y && 
                            inputDate.getMonth() === m - 1 && 
                            inputDate.getDate() === d;

        if (!isValidMonth || !isValidDay || parts[2].length !== 4 || !matchesInput) {
          newErrors.dateOfBirth = 'Invalid date';
        } else if (inputDate >= today) {
          newErrors.dateOfBirth = 'Birth date must be in the past';
        }
      } else {
        newErrors.dateOfBirth = 'Format must be DD/MM/YYYY';
      }
    }
    if (!gender) newErrors.gender = 'Please select your gender';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [firstName, lastName, phone, gender, dateOfBirth]);

  const handleDateChange = useCallback((text: string) => {
    const isDeleting = text.length < dateOfBirth.length;
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
    
    setDateOfBirth(formatted);
    if (errors.dateOfBirth) {
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  }, [dateOfBirth, errors.dateOfBirth]);

  const handleDateSelect = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDateOfBirth(`${day}/${month}/${year}`);
      if (errors.dateOfBirth) {
        setErrors(prev => ({ ...prev, dateOfBirth: '' }));
      }
    }
  }, [errors.dateOfBirth]);

  const handleContinueFixed = useCallback(() => {
    if (!validate()) return;
    const data: SignupData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      dateOfBirth: dateOfBirth.trim(),
      gender,
      photo: photoUri ?? undefined,
    };
    navigation.navigate(ROUTES.AUTH.REGISTER_STEP2, { data });
  }, [navigation, firstName, lastName, phone, dateOfBirth, gender, photoUri, validate]);

  return (
    <AppScreen
      header={
        <RegisterStepHeader
          currentStep={1}
          totalSteps={7}
          onBack={() => navigation.goBack()}
        />
      }
    >
      {/* Title */}
      <StepHeading title="Introduce yourself !" />

      {/* Avatar Picker */}
      <TouchableOpacity style={styles.avatarWrap} onPress={handlePickImage}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={[styles.avatar, { borderColor: colors.primaryMid }]} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.cardSecondary }]}>
            <Ionicons name="person" size={48} color={colors.primaryMid} />
          </View>
        )}
        <View style={[styles.editBadge, { backgroundColor: colors.primaryMid, borderColor: colors.white }]}>
          <Ionicons name="pencil" size={14} color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Form */}
      <View style={styles.form}>
        {/* First Name */}
        <Input
          label="First Name"
          icon="person-outline"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          icon="person-outline"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
        />

        {/* Phone */}
        <Input
          label="Phone number"
          icon="call-outline"
          placeholder="+213 555 555 555"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          icon="calendar-outline"
          placeholder="DD/MM/YYYY"
          value={dateOfBirth}
          onChangeText={handleDateChange}
          keyboardType="number-pad"
          maxLength={10}
          error={errors.dateOfBirth}
          onIconPress={() => setShowDatePicker(true)}
        />

        {/* Gender */}
        <View>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.genderBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  gender === opt.id && { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
                ]}
                onPress={() => setGender(opt.id)}
              >
                <Ionicons
                  name={opt.icon}
                  size={18}
                  color={gender === opt.id ? colors.white : colors.textSecondary}
                />
                <Text style={[
                  styles.genderBtnText,
                  { color: colors.textSecondary },
                  gender === opt.id && { color: colors.white },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.gender}</Text> : null}
        </View>
      </View>

      <NeonButton title="Continue" onPress={handleContinueFixed} style={styles.continueBtn} />

      {/* Date Picker (Native) */}
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
          maximumDate={new Date()}
        />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
