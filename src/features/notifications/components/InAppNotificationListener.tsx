import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Dimensions,
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { Theme } from '@shared/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@navigation/routes';
import { registerOnce } from '@features/chat/services/socketClient';
import { useSelector } from 'react-redux';
import { selectToken } from '@features/auth/store/authSelectors';
import { useQueryClient } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

export const InAppNotificationListener = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const token = useSelector(selectToken);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((data: any) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setNotification(data);
    setVisible(true);
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: insets.top + 10,
        useNativeDriver: true,
        bounciness: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(hide, 7000);
  }, [translateY, opacity, insets.top]);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setNotification(null);
    });
  }, [translateY, opacity]);

  useEffect(() => {
    if (!token) return;
    
    registerOnce('notification:new', (newNotification: any) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['member-home-summary'] });
      
      show(newNotification);
    });
  }, [token, queryClient, show]);

  if (!visible || !notification) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          transform: [{ translateY }],
          opacity,
          shadowColor: '#000',
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        activeOpacity={0.9}
        onPress={() => {
          hide();
          (navigation as any).navigate(ROUTES.MAIN.HOME, {
            screen: ROUTES.MAIN.NOTIFICATIONS,
          });
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryMid + '20' }]}>
          <Ionicons name="notifications" size={24} color={colors.primaryMid} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
            {notification.body || notification.message || ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={hide}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 16,
    padding: 12,
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
    lineHeight: 16,
  },
  closeBtn: {
    padding: 4,
  },
});
