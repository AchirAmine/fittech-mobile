export type GoalType =
  | 'LOSE_WEIGHT'
  | 'GAIN_MUSCLE'
  | 'MAINTAIN_WEIGHT'
  | 'IMPROVE_ENDURANCE'
  | 'IMPROVE_FLEXIBILITY'
  | 'GENERAL_FITNESS';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Goal {
  id: string;
  memberId: string;
  goalType: GoalType;
  startWeightKg?: number | null;
  targetWeightKg?: number | null;
  startDate: string;
  targetDate?: string | null;
  status: GoalStatus;
  progressPercentage?: number | null;
  currentWeightKg?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CoachFeedback {
  id: string;
  progressId?: string;
  memberId?: string;
  coachId?: string;
  comment: string;
  createdAt: string;
  coach?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
  };
}

export interface ProgressRecord {
  id: string;
  memberId: string;
  weightKg: number;
  heightCm?: number | null;
  bmi?: number | null;
  waistCm?: number | null;
  chestCm?: number | null;
  armCm?: number | null;
  legCm?: number | null;
  notes?: string | null;
  progressDate: string;
  isSharedWithCoach: boolean;
  createdAt: string;
  updatedAt: string;
  feedback?: CoachFeedback[];
}

export interface CreateProgressPayload {
  weightKg: number;
  heightCm?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  legCm?: number;
  notes?: string;
  progressDate: string;
  isSharedWithCoach: boolean;
}

export interface UpdateProgressPayload {
  weightKg?: number;
  heightCm?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  legCm?: number;
  notes?: string;
  progressDate?: string;
  isSharedWithCoach?: boolean;
}

export interface CreateGoalPayload {
  goalType: GoalType;
  startWeightKg?: number;
  targetWeightKg?: number;
  startDate: string;
  targetDate?: string;
}

export interface UpdateGoalPayload {
  goalType?: GoalType;
  startWeightKg?: number;
  targetWeightKg?: number;
  startDate?: string;
  targetDate?: string;
}

export interface PaginatedProgressResponse {
  success: boolean;
  data: {
    items: ProgressRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DeleteProgressResponse {
  success: boolean;
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface ProgressResponse {
  success: boolean;
  data: ProgressRecord;
}

export interface GoalResponse {
  success: boolean;
  data: Goal | null;
}

export interface FeedbackResponse {
  success: boolean;
  data: CoachFeedback[];
}

export interface LatestProgressResponse {
  success: boolean;
  data: ProgressRecord | null;
}

export interface CoachMemberProgressResponse {
  success: boolean;
  data: {
    member: {
      id: string;
      fullName: string;
      profilePicture?: string | null;
    };
    goal: Pick<Goal, 'goalType' | 'startWeightKg' | 'currentWeightKg' | 'targetWeightKg' | 'progressPercentage'> | null;
    progress: Array<ProgressRecord & { feedbacks?: Pick<CoachFeedback, 'id' | 'comment' | 'createdAt'>[] }>;
  };
}

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

export const getBMILabel = (category: BMICategory): string => {
  const labels: Record<BMICategory, string> = {
    underweight: 'Underweight',
    normal: 'Normal',
    overweight: 'Overweight',
    obese: 'Obese',
  };
  return labels[category];
};

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  LOSE_WEIGHT: 'Lose Weight',
  GAIN_MUSCLE: 'Gain Muscle',
  MAINTAIN_WEIGHT: 'Maintain Weight',
  IMPROVE_ENDURANCE: 'Improve Endurance',
  IMPROVE_FLEXIBILITY: 'Improve Flexibility',
  GENERAL_FITNESS: 'General Fitness',
};

export const GOAL_TYPE_ICONS: Record<GoalType, string> = {
  LOSE_WEIGHT: 'trending-down',
  GAIN_MUSCLE: 'barbell-outline',
  MAINTAIN_WEIGHT: 'remove-outline',
  IMPROVE_ENDURANCE: 'walk-outline',
  IMPROVE_FLEXIBILITY: 'body-outline',
  GENERAL_FITNESS: 'fitness-outline',
};
