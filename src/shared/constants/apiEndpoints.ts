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
  MEMBER_EXTENDED: {
    HOME_SUMMARY: "/members/home-summary",
  },
  PERSONAL_COACHING: {
    COACHES: "/personal-coaching/coaches",
    COACH_DETAIL: (id: string) => `/personal-coaching/coaches/${id}`,
    INVITE_COACH: (id: string) => `/personal-coaching/coaches/${id}/invite`,
    MY_COACH_SLOTS: "/personal-coaching/my-coach/slots",
    BOOK_SLOT: (id: string) => `/personal-coaching/my-coach/slots/${id}/book`,
    PAY_INVITATION: (id: string) => `/personal-coaching/invitations/${id}/pay`,
  },
  PROMO: {
    ACTIVE: "/promo/active",
    REDEEM: (id: string) => `/promo/${id}/redeem`,
    HISTORY: "/promo/star-transactions",
    MY_CODES: "/promo/my-codes",
    APPLY_CODE: "/promo/apply-code",
  },
  SUBSCRIPTIONS: {
    ME: "/subscriptions/me",
    CREATE: "/subscriptions",
  },
  OFFERS: {
    LIST: "/offers",
    PUBLIC: "/offers/public",
  },
} as const;
