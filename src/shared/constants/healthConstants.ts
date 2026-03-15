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
  { id: 'diabetes', label: 'Diabetes',          icon: 'water-outline', color: '#007AFF' },
  { id: 'heart',    label: 'Heart conditions',  icon: 'heart-outline', color: '#FF3B30' },
  { id: 'joint',    label: 'Joint problems',    icon: 'body-outline',  color: '#FF9500' },
  { id: 'asthma',   label: 'Asthma',            icon: 'pulse-outline', color: '#5856D6' },
  { id: 'none',     label: 'None of the above', icon: 'ban-outline',   color: '#8E8E93' },
  { id: 'other',    label: 'Other concerns',    icon: 'medical-outline', color: '#00C897' },
];
