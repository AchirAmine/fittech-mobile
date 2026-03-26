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
  statusBadge?: string;
  statusColor?: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'gym', label: 'Gym', emoji: '🏋️' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'cardio', label: 'Cardio', emoji: '🏃' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊' },
  { id: 'boxing', label: 'Boxing', emoji: '🥊' },
];

export const MOCK_WEEK_DATES: DayInfo[] = [
  { day: 'MON', date: '24', hasEvent: true },
  { day: 'TUE', date: '25', hasEvent: false },
  { day: 'WED', date: '26', hasEvent: true },
  { day: 'THU', date: '27', hasEvent: false },
  { day: 'FRI', date: '28', hasEvent: true },
  { day: 'SAT', date: '29', hasEvent: false },
  { day: 'SUN', date: '30', hasEvent: false },
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    time: '07:00',
    title: 'Morning Yoga Flow',
    type: 'class',
    zone: 'Studio 1',
    coach: 'Sarah Jensen',
    duration: '60 min',
    enrolled: 12,
    capacity: 20,
    coachAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: 's2',
    time: '08:30',
    title: 'Open Gym Session',
    type: 'open',
    duration: 'Available until 12:00 PM',
    subtitle: 'Free training, no booking required.',
  },
  {
    id: 's3',
    time: '12:00',
    title: 'HIIT Burnout',
    type: 'class',
    zone: 'Crossfit Area',
    coach: 'Marcus Vane',
    duration: '45 min',
    enrolled: 15,
    capacity: 15,
    coachAvatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    statusBadge: 'FULL',
  },
  {
    id: 's4',
    time: '14:00',
    title: 'Afternoon Training',
    type: 'open',
    duration: 'Available until 05:00 PM',
    subtitle: 'Enjoy the quiet hours.',
  },
  {
    id: 's5',
    time: '18:00',
    title: 'Boxing Basics',
    type: 'class',
    zone: 'Combat Zone',
    coach: 'David Chen',
    duration: '75 min',
    enrolled: 8,
    capacity: 10,
    coachAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 's5-extra',
    time: '18:00',
    title: 'Beginner Boxing',
    type: 'class',
    zone: 'Combat Zone 2',
    coach: 'Mike Tyson',
    duration: '60 min',
    enrolled: 4,
    capacity: 10,
    coachAvatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    id: 's6',
    time: '19:30',
    title: 'Zumba Party',
    type: 'class',
    zone: 'Main Studio',
    coach: 'Elena Rodriguez',
    duration: '60 min',
    enrolled: 25,
    capacity: 30,
    coachAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];
