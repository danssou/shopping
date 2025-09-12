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

export interface NotificationPosition {
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