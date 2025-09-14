'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-slate-600 border-t-yellow-500"></div>
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export function LoadingState({ isLoading, message = 'Loading...', children }: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2 p-4">
        <LoadingSpinner />
        <span className="text-slate-400 text-sm">{message}</span>
      </div>
    );
  }

  return <>{children}</>;
}