export interface Course {
  id: string;
  title: string;
  category: 'Gym' | 'Swimming' | 'Boxing' | 'Yoga' | 'Crossfit';
  days: string;
  startTime: string;
  duration: number; // Duration in minutes
  coach: {
    name: string;
    avatar: string;
  };
  location: string;
  status: 'OPEN' | 'RESERVED' | 'FULL';
  enrolled: number;
  maxSlots: number;
  description: string;
  color: string;
  canCancel?: boolean;
}

export const COURSES_MOCK_DATA: Course[] = [
  {
    id: '1',
    title: 'HIIT Advanced Cardio',
    category: 'Gym',
    days: 'Mon 24 Mar',
    startTime: '12:00 PM',
    duration: 90,
    coach: {
      name: 'Coach Marcus',
      avatar: 'https://i.pravatar.cc/150?u=marcus'
    },
    location: 'ZONE A',
    status: 'OPEN',
    enrolled: 8,
    maxSlots: 12,
    description: 'High-intensity interval training designed to push your limits and maximize calorie burn.',
    color: '#3D5AFE'
  },
  {
    id: '2',
    title: 'Olympic Technique Drills',
    category: 'Swimming',
    days: 'Tue 25 Mar',
    startTime: '12:00 PM',
    duration: 60,
    coach: {
      name: 'Coach Sarah',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    location: 'POOL 1',
    status: 'RESERVED',
    enrolled: 10,
    maxSlots: 10,
    description: 'Focus on stroke efficiency, underwater phase, and explosive starts for competitive edge.',
    color: '#00BFA5'
  },
  {
    id: '3',
    title: 'Power Boxing Basics',
    category: 'Boxing',
    days: 'Thu 27 Mar',
    startTime: '12:00 PM',
    duration: 60,
    coach: {
      name: 'Coach Viktor',
      avatar: 'https://i.pravatar.cc/150?u=viktor'
    },
    location: 'RING 2',
    status: 'FULL',
    enrolled: 12,
    maxSlots: 12,
    description: 'Master the fundamentals of footwork, stance, and basic punch combinations in a high-energy environment.',
    color: '#FF6D00'
  },
  {
    id: '4',
    title: 'Yoga Flow & Stability',
    category: 'Yoga',
    days: 'Fri 28 Mar',
    startTime: '09:00 AM',
    duration: 90,
    coach: {
      name: 'Coach Elena',
      avatar: 'https://i.pravatar.cc/150?u=elena'
    },
    location: 'STUDIO 3',
    status: 'OPEN',
    enrolled: 5,
    maxSlots: 15,
    description: 'Balance your body and mind with a series of fluid movements and deep breathing exercises.',
    color: '#AA00FF',
    canCancel: true
  },
  {
    id: '5',
    title: 'Extreme Crossfit Challenge',
    category: 'Crossfit',
    days: 'Wed 25 Mar',
    startTime: '02:00 AM',
    duration: 90,
    coach: {
      name: 'Coach Alex',
      avatar: 'https://i.pravatar.cc/150?u=alex'
    },
    location: 'BOX 1',
    status: 'RESERVED',
    enrolled: 15,
    maxSlots: 20,
    description: 'High-intensity functional movements that will test your strength and endurance to the limit.',
    color: '#D50000',
    canCancel: false
  }
];
