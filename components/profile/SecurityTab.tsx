'use client';

import { 
  PasswordChangeForm,
  TwoFactorAuth,
  LoginHistory,
  SecurityTips
} from './security';

export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <p className="text-slate-400">Manage your account security and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Password Change Section */}
        <PasswordChangeForm />

        {/* Two-Factor Authentication Section */}
        <TwoFactorAuth />

        {/* Login History Section */}
        <LoginHistory />

        {/* Security Tips */}
        <SecurityTips />
      </div>
    </div>
  );
}