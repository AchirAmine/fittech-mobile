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
  id: string;         // course ID (for classes) or slot ID (for open sessions)
  slotId?: string;    // planning slot ID
  time: string;       // startTime HH:MM
  endTime?: string;   // endTime HH:MM
  date?: string;      // ISO date string of the specific course (YYYY-MM-DD)
  title: string;
  type: 'open' | 'class';
  duration?: string;
  subtitle?: string;
  zone?: string | null;
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
