// ─── Weight picker ─────────────────────────────────────────────────────────────

/**
 * Generates a list of weight values in kg from 20 to 200 (inclusive).
 */
export const generateWeights = (): number[] => {
  const weights: number[] = [];
  for (let i = 20; i <= 200; i++) {
    weights.push(i);
  }
  return weights;
};

// ─── Height picker ─────────────────────────────────────────────────────────────

/**
 * Generates a list of height values in cm from 100 to 220 (inclusive).
 */
export const generateHeightsCm = (): number[] => {
  const heights: number[] = [];
  for (let i = 100; i <= 220; i++) {
    heights.push(i);
  }
  return heights;
};

/**
 * Formats a height value in cm for display.
 * e.g. 170 → "170"
 */
export const formatCm = (cm: number): string => String(cm);
