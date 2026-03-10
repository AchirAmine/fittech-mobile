// Global Shared Types

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoUrl?: string;
  photoLocalUri?: string | null;
  profilePicture?: string;
  gender?: 'male' | 'female' | string;
  phone?: string;
  memberSince?: string;
  createdAt?: string;
  dateOfBirth?: string;
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

