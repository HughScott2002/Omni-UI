// Notification Types for Real-time WebSocket Integration

export interface Notification {
  notification_id: string;
  account_id: string;
  is_read: boolean;
  was_dismissed: boolean;
  label: string;
  content: string;
  date: string; // ISO 8601 format
  type?: 'info' | 'success' | 'warning' | 'action' | null;
  icon?: string | null;
  priority: 'normal' | 'high' | 'low';
  category?: 'account' | 'wallet' | 'kyc' | 'transaction' | 'request' | 'security' | 'system' | 'promotion' | 'contact' | null;
  action_url?: string | null;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  page_size: number;
  unread_count: number;
}

// WebSocket Message Types
export type WebSocketMessageType =
  | 'connected'
  | 'notification'
  | 'unread_count_update'
  | 'pong';

export interface ConnectedMessage {
  type: 'connected';
  data: {
    message: string;
    account_id: string;
    unread_count: number;
  };
}

export interface NotificationMessage {
  type: 'notification';
  data: Notification;
}

export interface UnreadCountUpdateMessage {
  type: 'unread_count_update';
  data: {
    unread_count: number;
  };
}

export interface PongMessage {
  type: 'pong';
  data: {
    timestamp: string;
  };
}

// Discriminated union: switching on `type` narrows `data` automatically.
export type WebSocketMessage =
  | ConnectedMessage
  | NotificationMessage
  | UnreadCountUpdateMessage
  | PongMessage;
