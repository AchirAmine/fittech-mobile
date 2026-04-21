export const parseRestrictions = (restrictions?: string): string[] => {
  if (!restrictions) return [];
  return restrictions.split(', ').filter(Boolean);
};
export const formatRestrictions = (restrictions: string[]): string => {
  return restrictions.join(', ');
};
export const formatMetricValue = (value?: number): number => {
  return value || 0;
};
