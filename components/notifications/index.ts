// Main exports for the notification system
export { NotificationProvider, useNotifications } from './NotificationProvider';
export { default as Notification } from './Notification';

// Re-export types and utilities
export * from '@/lib/notifications/types';
export * from '@/lib/notifications/utils';

// Legacy components (deprecated - use new modular system)
export { default as WelcomeNotification } from './WelcomeNotification';