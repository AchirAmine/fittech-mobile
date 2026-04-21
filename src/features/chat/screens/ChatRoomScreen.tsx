import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@shared/hooks/useTheme';
import { useSelector } from 'react-redux';
import { selectUser } from '@features/auth/store/authSelectors';
import { useMessages, useConversations, useUploadAttachment } from '../hooks/useChatQueries';
import { useChatSocket } from '../hooks/useChatSocket';
import { MessageBubble } from '../components/MessageBubble';
import { FileAttachmentType, ConversationType } from '../services/chatApi';
import { ChatStackParamList } from '@navigation/ChatNavigator';
import { getImageSource } from '@shared/utils/imageUtils';
import { hexToRGBA } from '@shared/constants/colors';
type Props = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;
export default function ChatRoomScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { colors } = useTheme();
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.id ?? '';
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const { data: conversations } = useConversations();
  const { sendMessage } = useChatSocket();
  const { mutateAsync: uploadAttachment, isPending: isUploading } = useUploadAttachment();
  const flatListRef = React.useRef<FlatList>(null);
  const conversation = conversations?.find((c) => c.id === conversationId);
  const [text, setText] = useState('');
  const { title, profilePic } = React.useMemo(() => {
    let t = 'Chat';
    let p: string | null = null;
    if (conversation) {
      t = conversation.title;
      if (conversation.type === ConversationType.COURSE_PRIVATE || 
          conversation.type === ConversationType.PERSONAL_COACHING ||
          conversation.type === ConversationType.ADMIN_COACH_PRIVATE) {
        p = conversation.coach?.profilePicture || conversation.member?.profilePicture || null;
      }
    }
    return { title: t, profilePic: p };
  }, [conversation]);
  React.useLayoutEffect(() => {
    navigation.setOptions({ 
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          {profilePic ? (
            <Image source={getImageSource(profilePic)} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatar, { backgroundColor: colors.cardSecondary, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons 
                name={conversation?.type === ConversationType.COURSE_GROUP ? 'people' : 'person'} 
                size={16} 
                color={colors.primary} 
              />
            </View>
          )}
          <View>
            <Text style={[styles.headerName, { color: colors.textPrimary }]} numberOfLines={1}>{title}</Text>
            {conversation?.isLocked && (
              <Text style={[styles.headerStatus, { color: colors.warning }]}>Locked 🔒</Text>
            )}
            {!conversation?.isLocked && conversation?.type === ConversationType.COURSE_GROUP && (
              <Text style={[styles.headerStatus, { color: colors.textSecondary }]}>Group Chat</Text>
            )}
          </View>
        </View>
      )
    });
  }, [navigation, title, profilePic, conversation?.isLocked, conversation?.type, colors]);
  const handleSendText = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    sendMessage({ conversationId, textContent: trimmed });
  }, [text, conversationId, sendMessage]);
  const handlePickImage = useCallback(async () => {
    if (conversation?.isLocked) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    try {
      const { uri } = result.assets[0];
      const fileName = uri.split('/').pop() || 'image.jpg';
      const fileUrl = await uploadAttachment({ fileUri: uri, mimeType: 'image/jpeg', fileName });
      sendMessage({ conversationId, fileUrl, fileType: FileAttachmentType.IMAGE });
    } catch {
      Alert.alert('Error', 'Failed to send image. Please try again.');
    }
  }, [conversation, conversationId, uploadAttachment, sendMessage]);
  const sortedMessages = React.useMemo(() => {
    console.log('[ChatRoom] Items in messages:', messages.length);
    const messageMap = new Map(messages.map(m => [m.id, m]));
    return Array.from(messageMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [messages]);
  React.useEffect(() => {
    console.log('[ChatRoom] sortedMessages updated, length:', sortedMessages.length);
    if (sortedMessages.length > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [sortedMessages.length]);
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <FlatList
        ref={flatListRef}
        data={sortedMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} currentUserId={currentUserId} />
        )}
        inverted
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyAvatarContainer, { borderColor: hexToRGBA(colors.primary, 0.2) }]}>
              {profilePic ? (
                <Image source={getImageSource(profilePic)} style={styles.emptyAvatar} />
              ) : (
                <View style={[styles.emptyAvatar, { backgroundColor: colors.cardSecondary, justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons 
                    name={conversation?.type === ConversationType.COURSE_GROUP ? 'people' : 'person'} 
                    size={40} 
                    color={colors.primary} 
                  />
                </View>
              )}
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
              {conversation?.type === ConversationType.COURSE_GROUP ? 'Welcome to the Team!' : 'Start the Conversation'}
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
              {conversation?.type === ConversationType.COURSE_GROUP 
                ? `This is the beginning of your shared journey in the ${conversation?.title}. Feel free to introduce yourself to the group!` 
                : `Your coaching journey with ${conversation?.title || 'your coach'} starts right here. Send your first message to get things moving!`}
            </Text>
          </View>
        }
        contentContainerStyle={[styles.listContent, messages.length === 0 && { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      />
      {(!conversation?.canWrite || conversation?.isLocked) ? (
        <View style={[styles.lockedBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.lockedText, { color: colors.textMuted }]}>
            {conversation?.isLocked ? 'This conversation is locked' : 'You do not have permission to write here'}
          </Text>
        </View>
      ) : (
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.background }]}
            onPress={handlePickImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="add" size={26} color={colors.primary} />
            )}
          </TouchableOpacity>
          <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.cardSecondary }]}
            onPress={handleSendText}
            disabled={!text.trim() || isUploading}
          >
            <Ionicons name="arrow-up" size={22} color={text.trim() ? colors.white : colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
  headerStatus: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    marginTop: -2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  lockedText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
    transform: [{ rotate: '180deg' }], 
  },
  emptyAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    padding: 3,
    marginBottom: 20,
  },
  emptyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});
