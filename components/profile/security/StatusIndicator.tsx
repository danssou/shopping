'use client';

import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusIndicatorProps {
  type: StatusType;
  title: string;
  message: string;
  showIcon?: boolean;
  className?: string;
}

export default function StatusIndicator({ 
  type, 
  title, 
  message, 
  showIcon = true,
  className = '' 
}: StatusIndicatorProps) {
  const getStatusStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-500/10 border-green-500/20 text-green-400',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
        };
      case 'error':
        return {
          container: 'bg-red-500/10 border-red-500/20 text-red-400',
          icon: <XCircleIcon className="h-5 w-5 text-red-500" />
        };
      case 'warning':
        return {
          container: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
        };
      case 'info':
        return {
          container: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
        };
      default:
        return {
          container: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-slate-500" />
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`p-3 rounded-lg border ${styles.container} ${className}`}>
      <div className="flex items-start space-x-3">
        {showIcon && (
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs mt-1 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
}