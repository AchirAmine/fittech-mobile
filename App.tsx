import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@shared/services/queryClient';
import { store, persistor } from '@store/store';
import { injectStore } from '@shared/services';
import { AppNavigator } from '@navigation/AppNavigator';
import SplashScreen from '@features/auth/screens/core/SplashScreen';
import { ThemeProvider } from '@shared/context/ThemeContext';
import { LightColors } from '@shared/constants/colors';

injectStore(store);


export default function App(): React.ReactElement {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: LightColors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={LightColors.primary} size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <PersistGate loading={<SplashScreen />} persistor={persistor}>
              <AppNavigator />
            </PersistGate>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
