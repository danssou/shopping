import { NotificationType, NotificationTheme } from '@/types/notifications';

/**
 * Default notification theme configuration with modern, appealing colors
 */
export const defaultNotificationTheme: NotificationTheme = {
  success: {
    background: 'bg-gradient-to-br from-emerald-50 via-green-25 to-emerald-100/80',
    border: 'border-emerald-300/50',
    text: 'text-emerald-900',
    icon: 'text-emerald-500'
  },
  error: {
    background: 'bg-gradient-to-br from-red-50 via-rose-25 to-red-100/80',
    border: 'border-red-300/50',
    text: 'text-red-900',
    icon: 'text-red-500'
  },
  warning: {
    background: 'bg-gradient-to-br from-amber-50 via-yellow-25 to-orange-100/80',
    border: 'border-amber-300/50',
    text: 'text-amber-900',
    icon: 'text-amber-500'
  },
  info: {
    background: 'bg-gradient-to-br from-blue-50 via-sky-25 to-blue-100/80',
    border: 'border-blue-300/50',
    text: 'text-blue-900',
    icon: 'text-blue-500'
  }
};

/**
 * Generate a unique notification ID
 */
export const generateNotificationId = (): string => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get theme classes for a notification type
 */
export const getNotificationTheme = (type: NotificationType, customTheme?: Partial<NotificationTheme>) => {
  const theme = { ...defaultNotificationTheme, ...customTheme };
  return theme[type];
};

/**
 * Default notification durations (in milliseconds)
 */
export const defaultDurations = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000
};

/**
 * Get default duration for a notification type
 */
export const getDefaultDuration = (type: NotificationType): number => {
  return defaultDurations[type];
};

/**
 * Animation classes for notification entrance/exit
 */
export const notificationAnimations = {
  enter: {
    topRight: 'translate-x-0 opacity-100 scale-100',
    topLeft: '-translate-x-0 opacity-100 scale-100',
    topCenter: 'translate-y-0 opacity-100 scale-100',
    bottomRight: 'translate-x-0 opacity-100 scale-100',
    bottomLeft: '-translate-x-0 opacity-100 scale-100',
    bottomCenter: 'translate-y-0 opacity-100 scale-100'
  },
  exit: {
    topRight: 'translate-x-full opacity-0 scale-95',
    topLeft: '-translate-x-full opacity-0 scale-95',
    topCenter: '-translate-y-full opacity-0 scale-95',
    bottomRight: 'translate-x-full opacity-0 scale-95',
    bottomLeft: '-translate-x-full opacity-0 scale-95',
    bottomCenter: 'translate-y-full opacity-0 scale-95'
  }
};

/**
 * Get position classes for notification container
 */
export const getPositionClasses = (vertical: 'top' | 'bottom', horizontal: 'left' | 'center' | 'right') => {
  const verticalClass = vertical === 'top' ? 'top-2 sm:top-4' : 'bottom-2 sm:bottom-4';
  
  let horizontalClass = '';
  switch (horizontal) {
    case 'left':
      horizontalClass = 'left-2 sm:left-4';
      break;
    case 'right':
      horizontalClass = 'right-2 sm:right-4';
      break;
    case 'center':
      horizontalClass = 'left-1/2 transform -translate-x-1/2';
      break;
  }
  
  return `${verticalClass} ${horizontalClass}`;
};

/**
 * Validation helpers
 */
export const validateNotificationConfig = (config: unknown): boolean => {
  if (typeof config !== 'object' || config === null) {
    console.error('Invalid notification config');
    return false;
  }
  
  const notificationConfig = config as Record<string, unknown>;
  
  if (!notificationConfig.type || !['success', 'error', 'warning', 'info'].includes(notificationConfig.type as string)) {
    console.error('Invalid notification type');
    return false;
  }
  
  if (!notificationConfig.title || typeof notificationConfig.title !== 'string') {
    console.error('Notification title is required and must be a string');
    return false;
  }
  
  return true;
};