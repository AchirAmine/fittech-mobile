


export const generateWeights = (): number[] => {
  const weights: number[] = [];
  for (let i = 20; i <= 200; i++) {
    weights.push(i);
  }
  return weights;
};




export const generateHeightsCm = (): number[] => {
  const heights: number[] = [];
  for (let i = 100; i <= 220; i++) {
    heights.push(i);
  }
  return heights;
};


export const formatCm = (cm: number): string => String(cm);
