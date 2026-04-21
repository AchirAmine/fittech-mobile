import { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectToken } from '@features/auth/store/authSelectors';
import { initializeSocket, disconnectSocket, getSocket, registerOnce } from '../services/socketClient';
import { chatKeys } from './useChatQueries';
import { Message, Conversation } from '../services/chatApi';
type SendMessagePayload = {
  conversationId: string;
  textContent?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  fileMimeType?: string;
};
export function useChatSocket() {
  const queryClient = useQueryClient();
  const token = useSelector(selectToken);
  useEffect(() => {
    if (!token) return;
    const socket = initializeSocket(token);
    const onConnect = () => {
      socket.emit('chat:sync-rooms');
    };
    if (socket.connected) {
      onConnect();
    }
    registerOnce('connect', onConnect);
    registerOnce('chat:message', (newMessage: Message) => {
      console.log('[Chat] Message received:', newMessage.id, newMessage.textContent);
      queryClient.setQueryData<Message[]>(
        chatKeys.messages(newMessage.conversationId),
        (old) => {
          const list = old ?? [];
          const messageMap = new Map(list.map(m => [m.id, m]));
          messageMap.set(newMessage.id, newMessage);
          return Array.from(messageMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );
      queryClient.setQueryData<Conversation[]>(
        chatKeys.conversations(),
        (old) => {
          if (!old) return old;
          const convMap = new Map(old.map(c => [c.id, c]));
          const existing = convMap.get(newMessage.conversationId);
          if (existing) {
            convMap.set(newMessage.conversationId, {
              ...existing,
              lastMessagePreview: newMessage.textContent || (newMessage.fileUrl ? 'Attachment' : ''),
              lastMessageAt: newMessage.createdAt,
            });
          }
          return Array.from(convMap.values()).sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return timeB - timeA;
          });
        }
      );
    });
    registerOnce('chat:conversation-locked', ({ conversationId, isLocked }: { conversationId: string; isLocked: boolean }) => {
      queryClient.setQueryData<Conversation[]>(
        chatKeys.conversations(),
        (old) => old?.map((conv) => conv.id === conversationId ? { ...conv, isLocked } : conv)
      );
    });
    registerOnce('connect_error', (error: any) => {
      console.error('[Chat] Connection error:', error?.message);
    });
    registerOnce('chat:error', (error: unknown) => {
      console.error('[Chat] Socket error:', error);
      Alert.alert('Chat Error', 'An error occurred with the chat connection.');
    });
    return () => {
    };
  }, [token, queryClient]);
  const sendMessage = useCallback(
    (
      payload: SendMessagePayload,
      onSuccess?: (message: Message) => void,
      onError?: (error: unknown) => void
    ) => {
      const socket = getSocket();
      if (!socket?.connected) {
        console.warn('[Chat] Cannot send message: socket not connected');
        Alert.alert('Connection Error', 'Not connected to the chat server. Please check your internet.');
        onError?.({ message: 'Not connected to chat server' });
        return;
      }
      console.log('[Chat] Sending message to conversation:', payload.conversationId);
      socket.emit('chat:send-message', payload, (response: { success: boolean; data?: Message; message?: string }) => {
        if (response.success && response.data) {
          console.log('[Chat] Message sent successfully:', response.data.id);
          queryClient.setQueryData<Message[]>(
            chatKeys.messages(payload.conversationId),
            (old) => {
              const list = old ?? [];
              const messageMap = new Map(list.map(m => [m.id, m]));
              messageMap.set(response.data!.id, response.data!);
              return Array.from(messageMap.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            }
          );
          onSuccess?.(response.data);
        } else {
          console.error('[Chat] Failed to send message:', response.message);
          Alert.alert('Send Error', response.message || 'Failed to send message');
          onError?.(response);
        }
      });
    },
    [queryClient]
  );
  return { sendMessage };
}
