import { ImageSourcePropType } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const BASE_URL = API_URL?.split('/api')[0] || '';


export const getImageSource = (path: string | any): ImageSourcePropType | undefined => {
  if (!path) return undefined;

  
  if (typeof path === 'object' && path.uri) return path;
  if (typeof path === 'number') return path;

  if (typeof path === 'string') {
    if (path.startsWith('http')) {
      return { uri: path };
    }
    
    
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return { uri: `${BASE_URL}${normalizedPath}` };
  }

  return undefined;
};
