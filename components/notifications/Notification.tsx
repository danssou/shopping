'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { NotificationConfig } from '@/lib/notifications/types';
import { getNotificationTheme, getDefaultDuration } from '@/lib/notifications/utils';

interface NotificationProps extends NotificationConfig {
  onClose: () => void;
  className?: string;
}

const defaultIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
};

export default function Notification({
  type,
  title,
  message,
  duration,
  icon: CustomIcon,
  action,
  dismissible = true,
  persistent = false,
  onClose,
  className = ''
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);

  const theme = getNotificationTheme(type);
  const Icon = CustomIcon || defaultIcons[type];
  const notificationDuration = duration || getDefaultDuration(type);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 400);
  }, [onClose]);

  useEffect(() => {
    // Entrance animation
    setIsAnimating(true);
    const enterTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto-hide logic
    if (!persistent && notificationDuration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (notificationDuration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto-hide timer
      const hideTimer = setTimeout(() => {
        handleClose();
      }, notificationDuration);

      return () => {
        clearTimeout(enterTimer);
        clearTimeout(hideTimer);
        clearInterval(progressInterval);
      };
    }

    return () => clearTimeout(enterTimer);
  }, [notificationDuration, persistent, handleClose]);

  if (!isAnimating) return null;

  return (
    <div 
      className={`transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      } ${className}`}
    >
      <div className={`relative overflow-hidden rounded-lg border backdrop-blur-sm w-full max-w-xs sm:max-w-sm ${theme.background} ${theme.border} shadow-md`}>
        {/* Subtle animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-50"></div>
        
        {/* Enhanced border glow effect */}
        <div className={`absolute inset-0 rounded-lg opacity-15 blur-sm ${
          type === 'success' ? 'bg-emerald-300' :
          type === 'error' ? 'bg-red-300' :
          type === 'warning' ? 'bg-amber-300' :
          'bg-blue-300'
        }`}></div>
        
        <div className="relative p-2 sm:p-3">
          <div className="flex items-start space-x-2">
            {/* Icon with improved styling */}
            <div className="relative flex-shrink-0">
              {/* Pulsing background effect */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${theme.icon.replace('text-', 'bg-')}/20`}></div>
              {/* Icon container with gradient background */}
              <div className={`relative p-1 sm:p-1.5 rounded-full shadow-sm bg-gradient-to-br ${
                type === 'success' ? 'from-emerald-400 to-emerald-600' :
                type === 'error' ? 'from-red-400 to-red-600' :
                type === 'warning' ? 'from-amber-400 to-amber-600' :
                'from-blue-400 to-blue-600'
              }`}>
                <Icon className={`h-3 w-3 text-white drop-shadow-sm ${type === 'success' ? 'animate-bounce' : ''}`} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-xs sm:text-sm ${theme.text}`}>{title}</h3>
                {dismissible && (
                  <button 
                    onClick={handleClose}
                    className={`flex-shrink-0 p-0.5 rounded-md transition-all duration-200 transform hover:scale-110 hover:rotate-90 ${
                      type === 'success' ? 'text-emerald-600 hover:bg-emerald-100' :
                      type === 'error' ? 'text-red-600 hover:bg-red-100' :
                      type === 'warning' ? 'text-amber-600 hover:bg-amber-100' :
                      'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              {message && (
                <p className={`text-xs leading-tight mt-0.5 ${theme.text} opacity-90`}>
                  {message}
                </p>
              )}
              
              {action && (
                <button
                  onClick={action.onClick}
                  className={`text-xs font-medium px-2 py-0.5 mt-1 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm ${
                    type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' :
                    type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                    type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' :
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } text-white`}
                >
                  {action.label}
                </button>
              )}
            </div>
          </div>
          
          {/* Enhanced progress bar for auto-hide */}
          {!persistent && notificationDuration > 0 && (
            <div className="mt-1.5 h-0.5 sm:h-1 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className={`h-full rounded-full transition-all duration-100 ease-linear ${
                  type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                  type === 'error' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                  type === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                  'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                style={{ 
                  width: `${progress}%`,
                  boxShadow: `0 0 6px ${
                    type === 'success' ? '#10b981' : 
                    type === 'error' ? '#ef4444' : 
                    type === 'warning' ? '#f59e0b' : '#3b82f6'
                  }60`
                }}
              />
            </div>
          )}
        </div>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
      </div>
    </div>
  );
}