export const ROUTES = {
  AUTH: {
    SPLASH: 'Splash',
    LOGIN: 'Login',
    REGISTER_STEP1: 'RegisterStep1',
    REGISTER_STEP2: 'RegisterStep2',
    REGISTER_STEP3: 'RegisterStep3',
    REGISTER_STEP4: 'RegisterStep4',
    REGISTER_STEP5: 'RegisterStep5',
    REGISTER_STEP6: 'RegisterStep6',
    REGISTER_STEP7: 'RegisterStep7',
    FORGOT_PASSWORD: 'ForgotPassword',
    OTP_VERIFICATION: 'OTPVerification',
    RESET_PASSWORD: 'ResetPassword',
    SUCCESS: 'Success',
    ABOUT_US: 'AboutUs',
    WELCOME: 'Welcome',
    AUTH_CHOICE: 'AuthChoice',
  },
  MAIN: {
    HOME: 'Home',
    PLANNING: 'Planning',
    COURSES: 'Courses',
    COURSES_MAIN: 'CoursesMain',
    ACCOUNT: 'Account',
    PROFILE: 'Profile',
    HEALTH_PROFILE: 'HealthProfile',
    SUBSCRIPTION_OFFERS: 'SubscriptionOffers',
    PAYMENT_DETAILS: 'PaymentDetails',
    MY_PLANS: 'MyPlans',
    PLAN_DETAILS: 'PlanDetails',
    MEMBERSHIP: 'Membership',
    COURSE_DETAILS: 'CourseDetails',
    COACH_PROFILE: 'CoachProfile',
    MY_COACHING_DASHBOARD: 'MyCoachingDashboard',
    BOOK_SESSION: 'BookSession',
    PERSONAL_COACHES: 'PersonalCoaches',
    REWARDS: 'Rewards',
    MY_VOUCHERS: 'MyVouchers',
    CHAT: 'Chat',
    CHAT_MAIN: 'ChatMain',
    CHAT_ROOM: 'ChatRoom',
  },
} as const;

export type CoursesStackParamList = {
  [ROUTES.MAIN.COURSES_MAIN]: undefined;
  [ROUTES.MAIN.COURSE_DETAILS]: { courseId: string; courseTitle?: string; category?: string };
};
