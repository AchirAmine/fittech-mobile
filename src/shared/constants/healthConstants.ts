import { Ionicons } from '@expo/vector-icons';

export interface GoalOption {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export interface HealthConcernOption {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const GOALS: GoalOption[] = [
  { id: 'lose_weight',     label: 'Lose weight',     subtitle: 'Fat burning and cardio',    icon: 'fitness-outline', color: '#FF9500' },
  { id: 'build_strength',  label: 'Build Strength',  subtitle: 'Muscle and power',          icon: 'barbell-outline', color: '#FF4B2B' },
  { id: 'gain_weight',     label: 'Gain Weight',     subtitle: 'Bulk and size',             icon: 'barbell-outline', color: '#5856D6' },
  { id: 'reduce_stress',   label: 'Reduce Stress',   subtitle: 'Mindfulness and recovery',  icon: 'body-outline',    color: '#00C897' },
  { id: 'improve_health',  label: 'Improve Health',  subtitle: 'Overall wellbeing',         icon: 'heart-outline',   color: '#007AFF' },
  { id: 'other',           label: 'Other',           subtitle: 'Custom fitness goal',       icon: 'create-outline',  color: '#8E8E93' },
];

export const HEALTH_CONCERNS: HealthConcernOption[] = [
  { id: 'diabetes', label: 'Diabetes',          subtitle: 'Blood sugar management', icon: 'water-outline', color: '#007AFF' },
  { id: 'heart',    label: 'Heart conditions',  subtitle: 'Cardiovascular focus',   icon: 'heart-outline', color: '#FF3B30' },
  { id: 'joint',    label: 'Joint problems',    subtitle: 'Mobility & bone health',  icon: 'body-outline',  color: '#FF9500' },
  { id: 'asthma',   label: 'Asthma',            subtitle: 'Respiratory awareness',  icon: 'pulse-outline', color: '#5856D6' },
  { id: 'none',     label: 'None of the above', subtitle: 'No medical limits',      icon: 'ban-outline',   color: '#8E8E93' },
  { id: 'other',    label: 'Other',             subtitle: 'Custom health concern',  icon: 'create-outline', color: '#8E8E93' },
];

export interface ActivityOption {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const ACTIVITIES: ActivityOption[] = [
  { id: 'gym',       label: 'Gym Training',  subtitle: 'Weight lifting & machines',   icon: 'barbell-outline'    },
  { id: 'running',   label: 'Running',       subtitle: 'Outdoor & treadmill',          icon: 'walk-outline'       },
  { id: 'swimming',  label: 'Swimming',      subtitle: 'Pool & open water',            icon: 'water-outline'      },
  { id: 'cycling',   label: 'Cycling',       subtitle: 'Road & stationary bike',       icon: 'bicycle-outline'    },
  { id: 'yoga',      label: 'Yoga',          subtitle: 'Flexibility & mindfulness',    icon: 'body-outline'       },
  { id: 'boxing',    label: 'Boxing',        subtitle: 'Combat & cardio',              icon: 'fitness-outline'    },
  { id: 'hiit',      label: 'HIIT',          subtitle: 'High-intensity intervals',     icon: 'flash-outline'      },
  { id: 'other',     label: 'Other',         subtitle: 'Custom activity',              icon: 'create-outline'     },
];
