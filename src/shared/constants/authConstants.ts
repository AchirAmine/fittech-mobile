import { Ionicons } from '@expo/vector-icons';
import { PasswordRule } from '@features/auth/components/registration/PasswordRequirements';

export interface GenderOption {
  id: 'male' | 'female';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const GENDER_OPTIONS: GenderOption[] = [
  { id: 'male',   label: 'Male',   icon: 'male-outline'   },
  { id: 'female', label: 'Female', icon: 'female-outline' },
];

export const PASSWORD_RULES: PasswordRule[] = [
  { label: 'At least 8 characters',        test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A–Z)',   test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a–z)',   test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number or special char',   test: (pw) => /[\d!@#$%^&*(),.?":{}|<>]/.test(pw) },
];
