import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Conversation, ConversationType } from '../services/chatApi';
import { getImageSource } from '@shared/utils/imageUtils';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';

type Props = {
  conversation: Conversation;
  onPress: (conversationId: string) => void;
};

function getCategoryColor(category: string, colors: any): string {
  switch (category) {
    case 'ANNOUNCEMENTS': return '#FF3B30';
    case 'ADMIN_CHATS': return '#FFCC00'; 
    case 'COURSE_CHATS': return colors.primary;
    case 'PERSONAL_COACHING': return '#34C759';
    default: return colors.textMuted;
  }
}

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
  }
  
  return date.toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' });
};

export const ChatListItem: React.FC<Props> = ({ conversation, onPress }) => {
  const { colors } = useTheme();
  const categoryColor = getCategoryColor(conversation.category, colors);
  
  const profilePicture = (conversation.type === ConversationType.COURSE_PRIVATE || 
                          conversation.type === ConversationType.PERSONAL_COACHING ||
                          conversation.type === ConversationType.ADMIN_COACH_PRIVATE)
                         ? (conversation.coach?.profilePicture || conversation.member?.profilePicture)
                         : null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }]}
      onPress={() => onPress(conversation.id)}
      activeOpacity={0.7}
    >
      {}
      <View style={styles.row}>
        
        {}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarContainer, { borderColor: hexToRGBA(categoryColor, 0.3) }]}>
            {profilePicture ? (
              <Image source={getImageSource(profilePicture)} style={styles.avatarImage} />
            ) : (
              <View style={[styles.placeholderAvatar, { backgroundColor: hexToRGBA(categoryColor, 0.1) }]}>
                <Ionicons 
                  name={conversation.type === ConversationType.COURSE_GROUP ? 'people' : 'person'} 
                  size={24} 
                  color={categoryColor} 
                />
              </View>
            )}
          </View>
          <View style={[styles.onlineDot, { backgroundColor: categoryColor, borderColor: colors.background }]} />
        </View>

        {}
        <View style={[styles.contentSection, { borderBottomColor: colors.border }]}>
          <View style={styles.topRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {conversation.title}
            </Text>
            {conversation.lastMessageAt && (
              <Text style={[styles.time, { color: colors.textMuted }]}>
                {formatRelativeDate(conversation.lastMessageAt)}
              </Text>
            )}
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.previewContainer}>
              {conversation.isLocked && (
                <Ionicons name="lock-closed" size={12} color={colors.warning} style={{ marginRight: 4 }} />
              )}
              <Text 
                style={[
                  styles.preview, 
                  { color: conversation.isLocked ? colors.warning : colors.textSecondary }
                ]} 
                numberOfLines={1}
              >
                {conversation.lastMessagePreview || 'New groupe'}
              </Text>
            </View>
            
            {}
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 16,
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    paddingVertical: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  contentSection: {
    flex: 1,
    marginLeft: 14,
    paddingVertical: 16,
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: Theme.Typography.fontFamily.bold,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preview: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.medium,
    lineHeight: 20,
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
