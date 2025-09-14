'use client';

import { useState } from 'react';
import { 
  BellIcon,
  EyeIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '@/components/notifications';

interface PreferencesData {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
  };
  theme: 'auto' | 'dark' | 'light';
}

export default function PreferencesTab() {
  const { error: showError } = useNotifications();
  
  const [preferences, setPreferences] = useState<PreferencesData>({
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false
    },
    theme: 'dark'
  });

  const handleNotificationChange = (key: keyof PreferencesData['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));

    // TODO: Implement server action to save notification preferences
    // For now, just show a placeholder notification
    showError('Not Implemented', 'Notification preferences saving is coming soon. Changes are not persisted.');
  };

  const handlePrivacyChange = (key: keyof PreferencesData['privacy'], value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));

    // TODO: Implement server action to save privacy preferences
    // For now, just show a placeholder notification
    showError('Not Implemented', 'Privacy preferences saving is coming soon. Changes are not persisted.');
  };

  const handleThemeChange = (theme: PreferencesData['theme']) => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));

    // TODO: Implement server action to save theme preference
    // For now, just show a placeholder notification
    showError('Not Implemented', 'Theme preferences saving is coming soon. Changes are not persisted.');
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return SunIcon;
      case 'dark': return MoonIcon;
      default: return ComputerDesktopIcon;
    }
  };

  const notificationItems = [
    { 
      id: 'email' as const, 
      label: 'Email notifications', 
      description: 'Receive order updates and promotions via email' 
    },
    { 
      id: 'push' as const, 
      label: 'Push notifications', 
      description: 'Get instant alerts on your device' 
    },
    { 
      id: 'marketing' as const, 
      label: 'Marketing emails', 
      description: 'Receive special offers and product updates' 
    },
  ];

  const themeOptions = [
    { id: 'auto' as const, label: 'Auto (system preference)' },
    { id: 'dark' as const, label: 'Dark theme' },
    { id: 'light' as const, label: 'Light theme' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
        <p className="text-slate-400">Customize your experience and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BellIcon className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="text-white font-medium">Notifications</h4>
          </div>
          <div className="space-y-4">
            {notificationItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{item.label}</p>
                  <p className="text-slate-400 text-xs">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications[item.id]}
                    onChange={(e) => handleNotificationChange(item.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <EyeIcon className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="text-white font-medium">Privacy</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Profile visibility</p>
                <p className="text-slate-400 text-xs">Control who can see your profile</p>
              </div>
              <select 
                value={preferences.privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as 'public' | 'private')}
                className="bg-slate-600 border border-slate-500 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Show email address</p>
                <p className="text-slate-400 text-xs">Allow others to see your email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy.showEmail}
                  onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4">Theme</h4>
          <div className="space-y-3">
            {themeOptions.map((theme) => {
              const IconComponent = getThemeIcon(theme.id);
              return (
                <label key={theme.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.id}
                    checked={preferences.theme === theme.id}
                    onChange={() => handleThemeChange(theme.id)}
                    className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 focus:ring-yellow-500 focus:ring-2"
                  />
                  <IconComponent className="h-4 w-4 text-slate-400" />
                  <span className="text-white text-sm">{theme.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4">Language & Region</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Language</p>
                <p className="text-slate-400 text-xs">Choose your preferred language</p>
              </div>
              <select 
                defaultValue="en"
                className="bg-slate-600 border border-slate-500 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Currency</p>
                <p className="text-slate-400 text-xs">Your preferred currency for pricing</p>
              </div>
              <select 
                defaultValue="usd"
                className="bg-slate-600 border border-slate-500 rounded text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
                <option value="cad">CAD (C$)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Storage Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4">Data & Storage</h4>
          <div className="space-y-4">
            <button className="w-full text-left p-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors">
              <p className="text-white text-sm font-medium">Download your data</p>
              <p className="text-slate-400 text-xs">Get a copy of all your account data</p>
            </button>
            
            <button className="w-full text-left p-3 bg-red-900/20 hover:bg-red-900/30 border border-red-500/50 rounded-lg transition-colors">
              <p className="text-red-400 text-sm font-medium">Delete your account</p>
              <p className="text-red-300/70 text-xs">Permanently delete your account and all data</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}