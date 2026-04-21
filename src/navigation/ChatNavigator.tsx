import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shared/hooks/useTheme';
import { ROUTES } from './routes';
import { Theme } from '../shared/constants/theme';
import ChatListScreen from '@features/chat/screens/ChatListScreen';
import ChatRoomScreen from '@features/chat/screens/ChatRoomScreen';
export type ChatStackParamList = {
  [ROUTES.MAIN.CHAT_MAIN]: undefined;
  [ROUTES.MAIN.CHAT_ROOM]: { conversationId: string };
};
const Stack = createNativeStackNavigator<ChatStackParamList>();
export const ChatNavigator = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: Theme.Typography.fontFamily.bold,
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.MAIN.CHAT_MAIN}
        component={ChatListScreen as any}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name={ROUTES.MAIN.CHAT_ROOM}
        component={ChatRoomScreen as any}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
};
