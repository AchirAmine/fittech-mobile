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
  { label: 'One number (0-9)',             test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special char (!@#$...)',   test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
];
