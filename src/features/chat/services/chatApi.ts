import api from '@shared/services/axiosClient';

export enum ConversationType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ADMIN_COACH_PRIVATE = 'ADMIN_COACH_PRIVATE',
  COURSE_GROUP = 'COURSE_GROUP',
  COURSE_PRIVATE = 'COURSE_PRIVATE',
  PERSONAL_COACHING = 'PERSONAL_COACHING',
}

export enum FileAttachmentType {
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  senderName?: string;
  textContent: string | null;
  fileUrl: string | null;
  fileType: FileAttachmentType | null;
  fileName: string | null;
  fileMimeType: string | null;
  createdAt: string;
};

export type Conversation = {
  id: string;
  type: ConversationType;
  courseId: string | null;
  personalCoachingInvitationId: string | null;
  adminId: string | null;
  coachId: string | null;
  memberId: string | null;
  scheduledLockAt: string | null;
  isLocked: boolean;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
  category: string;
  title: string;
  canWrite: boolean;
  course?: { id: string; title: string };
  coach?: { id: string; firstName: string; lastName: string; profilePicture: string | null };
  member?: { id: string; firstName: string; lastName: string; profilePicture: string | null };
  admin?: { id: string; email: string };
};

export type ContactableCoach = {
  coachId: string;
  conversationId: string;
  courseId: string | null;
  courseTitle: string | null;
  coach: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
};

type ConversationsApiResponse = { success: boolean; data: Conversation[] };
type MessagesApiResponse = {
  success: boolean;
  data: { messages: Message[]; conversation: Conversation; pagination: { page: number; limit: number; total: number; totalPages: number } };
};
type UploadApiResponse = { success: boolean; data: { fileUrl: string; fileType: string; fileName: string; fileMimeType: string } };

export const chatApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await api.get<ConversationsApiResponse>('/chat/conversations');
    return data.data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const { data } = await api.get<MessagesApiResponse>(`/chat/conversations/${conversationId}/messages`);
    return data.data.messages;
  },

  uploadAttachment: async (fileUri: string, mimeType: string, fileName: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', { uri: fileUri, type: mimeType, name: fileName } as any);
    const { data } = await api.post<UploadApiResponse>('/chat/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.fileUrl;
  },

  getContactableCoaches: async (): Promise<ContactableCoach[]> => {
    const { data } = await api.get<{ success: boolean, data: ContactableCoach[] }>('/chat/my-coaches');
    return data.data;
  },
};
