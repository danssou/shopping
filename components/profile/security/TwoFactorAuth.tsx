'use client';

import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTwoFactorAuth } from '@/hooks/security';
import { LoadingState } from './LoadingSpinner';
import StatusIndicator from './StatusIndicator';

export default function TwoFactorAuth() {
  const {
    isEnabled,
    backupCodesRemaining,
    isLoading,
    isToggling,
    toggle2FA
  } = useTwoFactorAuth();

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
      </div>
      <p className="text-slate-400 text-sm mb-4">
        Add an extra layer of security to your account with 2FA.
      </p>
      
      <LoadingState isLoading={isLoading} message="Loading 2FA status...">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">
                Status: <span className={isEnabled ? 'text-green-400' : 'text-red-400'}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isEnabled 
                  ? 'Your account is protected with 2FA' 
                  : 'Protect your account with an authenticator app'
                }
              </p>
              {isEnabled && backupCodesRemaining > 0 && (
                <p className="text-xs text-yellow-400 mt-1">
                  {backupCodesRemaining} backup codes remaining
                </p>
              )}
            </div>
            <button
              onClick={() => toggle2FA(!isEnabled)}
              disabled={isToggling}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isEnabled
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
              }`}
            >
              {isToggling 
                ? (isEnabled ? 'Disabling...' : 'Setting up...')
                : (isEnabled ? 'Disable 2FA' : 'Enable 2FA')
              }
            </button>
          </div>

          {/* Status Indicators */}
          {isEnabled ? (
            <StatusIndicator
              type="success"
              title="Two-Factor Authentication Active"
              message="You&apos;ll need your authenticator app to sign in. Keep your backup codes safe."
            />
          ) : (
            <StatusIndicator
              type="warning"
              title="Two-Factor Authentication Disabled"
              message="Your account is more vulnerable without 2FA. Enable it for better security."
            />
          )}

          {/* 2FA Information */}
          <div className="bg-slate-600/50 rounded-lg p-4">
            <h5 className="text-white font-medium text-sm mb-2">About 2FA</h5>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Protects your account even if your password is compromised</li>
              <li>• Works with authenticator apps like Google Authenticator or Authy</li>
              <li>• Backup codes provided for account recovery</li>
              <li>• Can be disabled anytime from this page</li>
            </ul>
          </div>
        </div>
      </LoadingState>
    </div>
  );
}