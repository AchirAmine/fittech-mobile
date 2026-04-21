import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, ActivityIndicator, 
  TouchableOpacity, ScrollView, TextInput, Image 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { useConversations, useContactableCoaches } from '../hooks/useChatQueries';
import { useChatSocket } from '../hooks/useChatSocket';
import { ChatListItem } from '../components/ChatListItem';
import { ChatStackParamList } from '@navigation/ChatNavigator';
import { Theme } from '@shared/constants/theme';
import { hexToRGBA } from '@shared/constants/colors';
import { getImageSource } from '@shared/utils/imageUtils';
import { ConversationType, Conversation } from '../services/chatApi';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatMain'>;

export default function ChatListScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useChatSocket();

  const { data: conversations, isLoading, isError, refetch, isFetching } = useConversations();
  const { data: contactableCoaches, isLoading: isLoadingCoaches } = useContactableCoaches();

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'GROUPS', label: 'Groups' },
    { id: 'PRIVATE', label: 'Private' },
    { id: 'COACHING', label: 'Coaching' },
  ];

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    
    const filtered = conversations.filter(conv => {
      const matchSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (conv.lastMessagePreview?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchCategory = false;
      if (selectedCategory === 'ALL') {
        matchCategory = true;
      } else if (selectedCategory === 'GROUPS') {
        matchCategory = conv.type === ConversationType.COURSE_GROUP;
      } else if (selectedCategory === 'PRIVATE') {
        matchCategory = conv.type === ConversationType.COURSE_PRIVATE;
      } else if (selectedCategory === 'COACHING') {
        matchCategory = conv.type === ConversationType.PERSONAL_COACHING;
      }

      
      
      const isActive = !!conv.lastMessagePreview || conv.type === ConversationType.COURSE_GROUP; 
      
      return matchCategory && matchSearch && isActive;
    });

    
    const deduped = new Map<string, Conversation>(filtered.map((c: Conversation) => [c.id, c]));
    return Array.from(deduped.values());
  }, [conversations, selectedCategory, searchQuery]);

  const newCoaches = useMemo(() => {
    if (!contactableCoaches) return [];
    
    const filtered = contactableCoaches.filter(coach => {
      
      const hasActiveChat = conversations?.some(conv => conv.id === coach.conversationId && !!conv.lastMessagePreview);
      return !hasActiveChat;
    });

    
    const deduped = new Map<string, any>(filtered.map((c: any) => [c.coachId, c]));
    return Array.from(deduped.values());
  }, [contactableCoaches, conversations]);

  if (isLoading && !isFetching) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="wifi-outline" size={64} color={colors.textMuted} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Network problem. Check connection.</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
          <Text style={[styles.retryText, { color: colors.white }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: hexToRGBA(colors.textMuted, 0.08) }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {}
        <View style={styles.tabsWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.tabsContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.tab,
                  selectedCategory === cat.id && { borderBottomColor: colors.primary }
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[
                  styles.tabLabel, 
                  { color: selectedCategory === cat.id ? colors.primary : colors.textMuted }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredConversations as Conversation[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Conversation }) => (
          <ChatListItem
            conversation={item}
            onPress={(id) => navigation.navigate('ChatRoom', { conversationId: id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: hexToRGBA(colors.primary, 0.05) }]}>
              <Ionicons 
                name={selectedCategory === 'GROUPS' ? 'people-outline' : 'chatbubble-ellipses-outline'} 
                size={48} 
                color={colors.primary} 
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {searchQuery ? 'No results found' : 
               selectedCategory === 'GROUPS' ? 'No group chats yet' :
               selectedCategory === 'COACHING' ? 'No coaching sessions' : 'Your inbox is empty'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {searchQuery ? 'Try searching for something else' : 
               'Active conversations and groups will appear here once you start messaging.'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {newCoaches.length > 0 && (selectedCategory === 'ALL' || selectedCategory === 'PRIVATE') && !searchQuery && (
              <View style={styles.newChatsSection}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>My Coaches</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.newChatsScroll}
                >
                  {newCoaches.map((item) => (
                    <TouchableOpacity 
                      key={item.coachId} 
                      style={styles.coachCircleWrapper}
                      onPress={() => navigation.navigate('ChatRoom', { conversationId: item.conversationId })}
                    >
                      <View style={[styles.coachCircle, { borderColor: colors.primary }]}>
                        {item.coach.profilePicture ? (
                          <Image source={getImageSource(item.coach.profilePicture)} style={styles.coachImage} />
                        ) : (
                          <View style={[styles.coachPlaceholder, { backgroundColor: hexToRGBA(colors.primary, 0.1) }]}>
                            <Ionicons name="person" size={24} color={colors.primary} />
                          </View>
                        )}
                      </View>
                      <Text style={[styles.coachName, { color: colors.textPrimary }]} numberOfLines={1}>
                        {item.coach.firstName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {conversations && conversations.length > 0 && (
               <View style={[styles.mainListHeader, { borderTopColor: colors.border }]}>
                 <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Recent Messages</Text>
               </View>
            )}
          </>
        }
        contentContainerStyle={styles.listContent}
        refreshing={isFetching}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  tabsWrapper: {
    marginTop: 12,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 20,
  },
  tab: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: Theme.Typography.fontFamily.bold,
    fontSize: 14,
  },
  listContent: {
    flexGrow: 1,
  },
  newChatsSection: {
    marginBottom: 8,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 12,
    opacity: 0.6,
  },
  mainListHeader: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  newChatsScroll: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 8,
  },
  coachCircleWrapper: {
    alignItems: 'center',
    width: 70,
  },
  coachCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    padding: 2,
    marginBottom: 6,
  },
  coachImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  coachPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachName: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
  },
});
