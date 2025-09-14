'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { 
  UserIcon, 
  ComputerDesktopIcon,
  ShieldCheckIcon,
  BellIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { 
  PersonalInfoTab, 
  WishlistTab, 
  DevicesTab, 
  SecurityTab, 
  PreferencesTab 
} from '@/components/profile';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('personal');

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'devices', label: 'Connected Devices', icon: ComputerDesktopIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'preferences', label: 'Preferences', icon: BellIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab user={session.user} />;
      case 'wishlist':
        return <WishlistTab />;
      case 'devices':
        return <DevicesTab />;
      case 'security':
        return <SecurityTab />;
      case 'preferences':
        return <PreferencesTab />;
      default:
        return <PersonalInfoTab user={session.user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
              <ProfileAvatar 
                user={{
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image || undefined
                }} 
                size="xxl" 
                editable={true}
                className="flex-shrink-0" 
                onImageChange={(file) => {
                  // TODO: Implement image upload
                  console.log('Image upload:', file.name);
                }}
              />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {session.user.name || 'User Profile'}
                </h1>
                <p className="text-slate-300 text-lg mb-1">{session.user.email}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-sm text-slate-400">
                  <span>Member since {new Date(session.user.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-slate-700">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}