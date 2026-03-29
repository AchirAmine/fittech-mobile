export interface Course {
  id: string;
  title: string;
  category: 'Gym' | 'Swimming' | 'Boxing' | 'Yoga' | 'Crossfit';
  days: string;
  startTime: string;
  duration: number;
  coach: {
    name: string;
    avatar: string;
  };
  location: string;
  status: 'OPEN' | 'RESERVED' | 'FULL' | 'WAITLISTED';
  enrolled: number;
  maxSlots: number;
  description: string;
  color: string;
  canCancel?: boolean;
}
