export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface DayInfo {
  day: string;
  date: string;
  hasEvent: boolean;
}

export interface Session {
  id: string;
  time: string;
  title: string;
  type: 'open' | 'class';
  duration?: string;
  subtitle?: string;
  zone?: string;
  coach?: string;
  coachAvatar?: string;
  enrolled?: number;
  capacity?: number;
  statusBadge?: 'RESERVED' | 'WAITLISTED' | 'FULL' | string;
  statusColor?: string;
}

export const PLANNING_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'gym', label: 'Gym', emoji: '🏋️' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊' },
];
