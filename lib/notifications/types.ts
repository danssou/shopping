export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // Auto-hide duration in milliseconds (0 means no auto-hide)
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  persistent?: boolean; // If true, won't auto-hide
}

export type NotificationPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface NotificationPositionConfig {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface NotificationTheme {
  success: {
    background: string;
    border: string;
    text: string;
    icon: string;
  };
  error: {
    background: string;
    border: string;
    text: string;
    icon: string;
  };
  warning: {
    background: string;
    border: string;
    text: string;
    icon: string;
  };
  info: {
    background: string;
    border: string;
    text: string;
    icon: string;
  };
}

/**
 * Context interface for notification management
 */
export interface NotificationContextType {
  notifications: NotificationConfig[];
  success: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  error: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  warning: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  info: (title: string, message?: string, options?: Partial<NotificationConfig>) => string;
  addNotification: (notification: Omit<NotificationConfig, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}