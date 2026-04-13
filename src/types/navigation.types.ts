import { ROUTES } from '@navigation/routes';
import { SubscriptionPlan } from './index';

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
  goals?: string[];
  activities?: string[];
  healthConcerns?: string[];
}

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  RegisterStep1: undefined;
  RegisterStep2: { data: SignupData };
  RegisterStep3: { data: SignupData };
  RegisterStep4: { data: SignupData };
  RegisterStep5: { data: SignupData };
  RegisterStep6: { data: SignupData };
  RegisterStep7: { data: SignupData };
  ForgotPassword: undefined;
  OTPVerification: { email: string; mode: 'register' | 'reset' };
  ResetPassword: { email: string };
  Success: { 
    type: 'login' | 'register'; 
    title?: string;
    subtitle?: string; 
  };
  AboutUs: undefined;
  Welcome: undefined;
  AuthChoice: undefined;
};

export type MembershipStackParamList = {
  [ROUTES.MAIN.MY_PLANS]: undefined;
  [ROUTES.MAIN.PLAN_DETAILS]: { planId: string; planName?: string };
  [ROUTES.MAIN.SUBSCRIPTION_OFFERS]: undefined;
  [ROUTES.MAIN.PAYMENT_DETAILS]: { plan: SubscriptionPlan };
};

export type CoursesStackParamList = {
  [ROUTES.MAIN.COURSES]: undefined;
  [ROUTES.MAIN.COURSE_DETAILS]: { courseId: string; courseTitle?: string; category?: string };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ProfileMain: undefined;
  [ROUTES.MAIN.SUBSCRIPTION_OFFERS]: undefined;
  [ROUTES.MAIN.PAYMENT_DETAILS]: { plan: SubscriptionPlan };
  [ROUTES.MAIN.PLANNING]: undefined;
  [ROUTES.MAIN.PERSONAL_COACHES]: undefined;
  [ROUTES.MAIN.COACH_PROFILE]: { coachId: string };
  [ROUTES.MAIN.MY_COACHING_DASHBOARD]: undefined;
  [ROUTES.MAIN.BOOK_SESSION]: undefined;
  [ROUTES.MAIN.COURSE_DETAILS]: { courseId: string; courseTitle?: string; category?: string };
  [ROUTES.MAIN.MY_PLANS]: undefined;
  [ROUTES.MAIN.PLAN_DETAILS]: { planId: string; planName?: string };
  [ROUTES.MAIN.REWARDS]: undefined;
};

export type MainTabParamList = {
  [ROUTES.MAIN.HOME]: undefined; 
  [ROUTES.MAIN.COURSES]: undefined;
  [ROUTES.MAIN.MEMBERSHIP]: undefined;
  [ROUTES.MAIN.ACCOUNT]: undefined;
};

