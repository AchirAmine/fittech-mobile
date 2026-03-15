/**
 * Formats restrictions from API (comma-separated string) to UI (array of strings).
 */
export const parseRestrictions = (restrictions?: string): string[] => {
  if (!restrictions) return [];
  return restrictions.split(', ').filter(Boolean);
};

/**
 * Formats restrictions from UI (array of strings) to API (comma-separated string).
 */
export const formatRestrictions = (restrictions: string[]): string => {
  return restrictions.join(', ');
};

/**
 * Maps height/weight values safely.
 */
export const formatMetricValue = (value?: number): number => {
  return value || 0;
};
