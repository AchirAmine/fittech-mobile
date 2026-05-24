export type ActivityCategory = 'courses' | 'attendance' | 'rewards' | 'payments' | 'personal' | 'coach' | 'other';

export interface ActivityLog {
  id: string;
  type: string;
  category: ActivityCategory;
  title: string;
  description: string;
  createdAt: string;
  status?: string;
  metadata?: Record<string, any>;
}

export interface ActivitySummary {
  fullName: string;
  starBalance: number;
  remainingCourses: number;
  remainingOpenSessions: number;
  stats: {
    attendedCount: number;
    noShowCount: number;
    reservedCount: number;
    attendanceRate: number;
  };
  subscription: {
    planName: string;
    endDate: string;
  } | null;
}

export interface ActivityPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActivityResponse {
  summary: ActivitySummary;
  logs: ActivityLog[];
  pagination: ActivityPagination;
}

export interface FetchActivityFilters {
  type?: string;
  page?: number;
  limit?: number;
}
