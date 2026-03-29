// Global Shared Types

export interface OfferSport {
  id: string;
  sportType: string;
  freeSessions: number;
  coachSessions: number;
}

export interface Offer {
  id: string;
  title: string;
  duration: number; // in months
  price: number;
  picture?: string;
  sports: OfferSport[];
}

export interface Payment {
  id: string;
  amount: number;
  method: 'ONLINE' | 'AT_CLUB';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paidAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  paymentMethod: 'ONLINE' | 'AT_CLUB';
  status?: 'ACTIVE' | 'PENDING_PAYMENT' | 'EXPIRED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  offer: Offer;
  payment?: Payment;
}

export interface PlanFeature {
  label: string;
  icon: string;
  details: string[];
}

export interface SubscriptionPlan {
  id: string;
  title: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  duration: number;
  badge?: string;
  image: any;
  features: PlanFeature[];
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoUrl?: string;
  photoLocalUri?: string | null;
  profilePicture?: { uri: string } | number | string;
  gender?: 'male' | 'female' | string;
  phone?: string;
  memberSince?: string;
  createdAt?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  fitnessObjective?: string;
  medicalRestrictions?: string;
  status?: string;
  role?: string;
  subscription?: {
    type: string;
    id?: string;
    expiryDate?: string;
    autoRenew?: boolean;
  };
  weeklyStats?: {
    sessions: number;
    goalSessions: number;
    calories: number;
  };
  healthProfile?: {
    heightValue?: number | null;
    heightUnit?: string;
    weightValue?: number | null;
    weightUnit?: string;
    goals?: string[];
    restrictions?: string;
  };
  absenceWarnings: number;
}

