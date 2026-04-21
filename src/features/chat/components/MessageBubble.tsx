import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Palette } from '@shared/constants/colors';
import { Message, FileAttachmentType } from '../services/chatApi';
import { getImageSource } from '@shared/utils/imageUtils';

type Props = {
  message: Message;
  currentUserId: string;
};

export const MessageBubble: React.FC<Props> = ({ message, currentUserId }) => {
  const { colors } = useTheme();

  const isMine = message.senderId === currentUserId;

  return (
    <View style={[styles.wrapper, isMine ? styles.wrapperRight : styles.wrapperLeft]}>
      {!isMine && message.senderName && (
        <Text style={[styles.senderName, { color: colors.textSecondary }]}>
          {message.senderName}
        </Text>
      )}
      <View
        style={[
          styles.bubble,
          isMine
            ? { 
                backgroundColor: colors.primary, 
                borderBottomRightRadius: 4,
                shadowColor: colors.primary,
              }
            : { 
                backgroundColor: colors.card, 
                borderBottomLeftRadius: 4, 
                borderWidth: 1, 
                borderColor: colors.border,
                shadowColor: '#000',
              },
        ]}
      >
        {message.fileUrl && message.fileType === FileAttachmentType.IMAGE && (
          <Image
            source={getImageSource(message.fileUrl)}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {message.fileUrl && message.fileType === FileAttachmentType.FILE && (
          <View style={[styles.fileContainer, { backgroundColor: isMine ? Palette.translucent.white(0.15) : colors.cardSecondary }]}>
            <Ionicons name="document-outline" size={24} color={isMine ? colors.white : colors.primary} />
            <Text style={[styles.fileName, { color: isMine ? colors.white : colors.textPrimary }]} numberOfLines={1}>
              {message.fileName || 'Attachment'}
            </Text>
          </View>
        )}

        {message.textContent ? (
          <Text style={[styles.text, { color: isMine ? colors.white : colors.textPrimary }]}>
            {message.textContent}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={[styles.time, { color: isMine ? Palette.translucent.white(0.7) : colors.textMuted }]}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    maxWidth: '82%',
  },
  wrapperRight: {
    alignSelf: 'flex-end',
  },
  wrapperLeft: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  senderName: {
    fontSize: 11,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 2,
    marginLeft: 12,
  },
  image: {
    width: 240,
    height: 180,
    borderRadius: 14,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  time: {
    fontSize: 9,
    fontFamily: 'Poppins_400Regular',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 10,
    marginBottom: 4,
  },
  fileName: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
  },
});
