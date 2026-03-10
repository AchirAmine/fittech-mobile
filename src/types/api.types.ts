// API Response Types

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: number;
  field?: string | null;
  errors?: Record<string, string[]>;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  height: number;
  weight: number;
  fitnessObjective: string;
  medicalRestrictions?: string;
  profilePicture: string;
  status: string;
  role: string;
  createdAt: string;
}
