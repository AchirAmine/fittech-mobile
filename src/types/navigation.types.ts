// Navigation Types

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  photo?: string;
  height?: { value: number; unit: string };
  weight?: { value: number; unit: string };
  gender?: 'male' | 'female';
  subscription?: string;
  healthProfile?: {
    goals?: string[];
    restrictions?: string;
    heightValue?: number;
    heightUnit?: string;
    weightValue?: number;
    weightUnit?: string;
  };
}

// Shared data object passed step-to-step through the multi-step signup flow
export interface SignupData {
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  email?: string;
  password?: string;
  weightValue?: number;
  weightUnit?: 'kg';
  heightValue?: number;
  heightUnit?: 'cm';
  goal?: string;
  activities?: string[];
  healthConcerns?: string[];
}

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  // Multi-step signup
  RegisterStep1: undefined;
  RegisterStep2: { data: SignupData };
  RegisterStep3: { data: SignupData };
  RegisterStep4: { data: SignupData };
  RegisterStep5: { data: SignupData };
  RegisterStep6: { data: SignupData };
  RegisterStep7: { data: SignupData };
  // Existing auth screens
  ForgotPassword: undefined;
  OTPVerification: { email: string; mode: 'register' | 'reset' };
  ResetPassword: { token: string };
  Success: { 
    type: 'login' | 'register'; 
    title?: string;
    subtitle?: string; 
  };
  AboutUs: undefined;
  Welcome: undefined;
  AuthChoice: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

