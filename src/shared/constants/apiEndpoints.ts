export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/member/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  MEMBER: {
    GET_ME: "/members/me",
    UPDATE_ME: "/members/me",
  },
  COURSES: {
    LIST: "/courses",
    DETAIL: (id: string) => `/courses/${id}`,
    MY_RESERVATIONS: "/courses/my-reservations",
    MY_WAITLIST: "/courses/my-waitlist",
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    WAITLIST: (id: string) => `/courses/${id}/waitlist`,
    MEMBER_PLANNING: (sport: string, day: string) => `/courses/member-planning/${sport}/${day}`,
  },
} as const;
