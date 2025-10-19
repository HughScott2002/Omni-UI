import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Notification,
  NotificationResponse,
  WebSocketMessage
} from '@/types/notification';

const API_BASE = process.env.NEXT_PUBLIC_NOTIFICATION_API || 'http://localhost:8000';
const WS_BASE = process.env.NEXT_PUBLIC_NOTIFICATION_WS || 'ws://localhost:8000';

export function useNotifications(accountId: string | null | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  // Fetch notifications via REST API
  const fetchNotifications = useCallback(async (
    page = 1,
    pageSize = 10,
    category?: string
  ) => {
    if (!accountId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        account_id: accountId,
        page: page.toString(),
        page_size: pageSize.toString(),
        ...(category && { category })
      });

      console.log('🔍 Fetching notifications from:', `${API_BASE}/api/notifications?${params}`);

      const response = await fetch(`${API_BASE}/api/notifications?${params}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
      }

      const data: NotificationResponse = await response.json();

      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);

      console.log('✅ Notifications loaded:', data.notifications.length);

      return data;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Don't throw - allow app to continue even if notifications fail
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!accountId) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}/read?account_id=${accountId}`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const data = await response.json();

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(data.unread_count);

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, [accountId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!accountId) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/read-all?account_id=${accountId}`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      const data = await response.json();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      return data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }, [accountId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!accountId) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/notifications/${notificationId}?account_id=${accountId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.notification_id !== notificationId));

      return await response.json();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }, [accountId]);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!accountId) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    console.log('🔌 Connecting to WebSocket:', `${WS_BASE}/api/notifications/ws/${accountId}`);

    const ws = new WebSocket(`${WS_BASE}/api/notifications/ws/${accountId}`);

    ws.onopen = () => {
      console.log('✅ WebSocket connected to notification service');
      setIsConnected(true);

      // Start ping interval (every 30 seconds)
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'connected':
            console.log('🔔 Connected to notification service');
            setUnreadCount(message.data.unread_count);
            break;

          case 'notification':
            // Add new notification to the top of the list
            const newNotification = message.data as Notification;
            console.log('📬 New notification received:', newNotification.label);

            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Show browser notification if permission granted (client-side only)
            if (typeof window !== 'undefined' && 'Notification' in window && window.Notification) {
              if (window.Notification.permission === 'granted') {
                new window.Notification(newNotification.label, {
                  body: newNotification.content,
                  icon: newNotification.icon || undefined,
                  badge: '/notification-badge.png',
                  tag: newNotification.notification_id
                });
              }
            }

            // Optional: Play notification sound
            // const audio = new Audio('/notification.mp3');
            // audio.play().catch(e => console.log('Audio play failed:', e));
            break;

          case 'unread_count_update':
            setUnreadCount(message.data.unread_count);
            break;

          case 'pong':
            // Keepalive response - no action needed
            break;

          default:
            console.warn('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);

      // Clear ping interval
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }

      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Attempting to reconnect WebSocket...');
        connectWebSocket();
      }, 3000);
    };

    wsRef.current = ws;
  }, [accountId]);

  // Initialize: fetch notifications and connect WebSocket
  useEffect(() => {
    if (!accountId) return;

    fetchNotifications();
    connectWebSocket();

    // Request browser notification permission (client-side only)
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification) {
      if (window.Notification.permission === 'default') {
        window.Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [accountId, fetchNotifications, connectWebSocket]);

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
