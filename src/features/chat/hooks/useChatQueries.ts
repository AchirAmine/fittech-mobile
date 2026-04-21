import { useQuery, useMutation } from '@tanstack/react-query';
import { chatApi } from '../services/chatApi';
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  contactableCoaches: () => [...chatKeys.all, 'contactableCoaches'] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: chatApi.getConversations,
    staleTime: 30_000,
  });
}
export function useContactableCoaches() {
  return useQuery({
    queryKey: chatKeys.contactableCoaches(),
    queryFn: chatApi.getContactableCoaches,
    staleTime: 60_000,
  });
}
export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: () => chatApi.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10_000,
  });
}
export function useUploadAttachment() {
  return useMutation({
    mutationFn: ({ fileUri, mimeType, fileName }: { fileUri: string; mimeType: string; fileName: string }) =>
      chatApi.uploadAttachment(fileUri, mimeType, fileName),
  });
}
