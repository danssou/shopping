'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationConfig, NotificationContextType, NotificationPositionConfig } from '@/lib/notifications/types';
import { generateNotificationId, getPositionClasses } from '@/lib/notifications/utils';
import Notification from '@/components/notifications/Notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  position?: NotificationPositionConfig;
  maxNotifications?: number;
}

export function NotificationProvider({ 
  children, 
  position = { vertical: 'top', horizontal: 'right' },
  maxNotifications = 5 
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);

  const addNotification = useCallback((config: Omit<NotificationConfig, 'id'>) => {
    const id = generateNotificationId();
    const notification: NotificationConfig = {
      id,
      dismissible: true,
      persistent: false,
      ...config
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // Limit the number of notifications
      return newNotifications.slice(0, maxNotifications);
    });

    return id;
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return addNotification({ type: 'success', title, message, ...options });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return addNotification({ type: 'error', title, message, ...options });
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return addNotification({ type: 'warning', title, message, ...options });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, options?: Partial<NotificationConfig>) => {
    return addNotification({ type: 'info', title, message, ...options });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info
  };

  const positionClasses = getPositionClasses(position.vertical, position.horizontal);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className={`fixed ${positionClasses} z-50 space-y-1 pointer-events-none`}>
        <div className="max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] pointer-events-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="mb-1">
              <Notification
                {...notification}
                onClose={() => removeNotification(notification.id)}
                className="transition-all duration-300 ease-out"
              />
            </div>
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}