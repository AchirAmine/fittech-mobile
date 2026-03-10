// Only declare modules that have NO published type definitions
// @react-navigation/*, @expo/vector-icons, jwt-decode, yup, react-native-reanimated
// all ship with proper types - do NOT override them here.

// react-native-calendars: no official @types package
declare module 'react-native-calendars';

// redux-persist: suppress until peer-dep version aligns
declare module 'redux-persist';
declare module 'redux-persist/lib/storage';
