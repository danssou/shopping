// Security Components
export { default as PasswordChangeForm } from './PasswordChangeForm';
export { default as TwoFactorAuth } from './TwoFactorAuth';
export { default as LoginHistory } from './LoginHistory';
export { default as SecurityTips } from './SecurityTips';

// UI Components
export { default as PasswordStrengthIndicator } from './PasswordStrengthIndicator';
export { default as StatusIndicator } from './StatusIndicator';
export { default as LoadingSpinner, LoadingState } from './LoadingSpinner';

// Types
export interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrent: boolean;
}

export interface SecurityTip {
  id: string;
  text: string;
  importance: 'high' | 'medium' | 'low';
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}