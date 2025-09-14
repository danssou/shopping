'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { ChevronDownIcon, CogIcon, ShoppingBagIcon, HeartIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import ProfileAvatar from '@/components/profile/ProfileAvatar';

interface UserProfileDropdownProps {
  className?: string;
}

export default function UserProfileDropdown({ className = '' }: UserProfileDropdownProps) {
  const { data: session, isPending } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="user-profile"]')) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-8 bg-slate-600 rounded-full"></div>
      </div>
    );
  }

  const user = session?.user;
  if (!user) return null;

  return (
    <div className={`relative ${className}`} data-dropdown="user-profile">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg p-2 transition-colors duration-200"
      >
        <ProfileAvatar 
          user={{
            name: user.name,
            email: user.email,
            image: user.image || undefined
          }} 
          size="sm" 
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-gray-400">
            {user.email}
          </p>
        </div>
        <ChevronDownIcon 
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <ProfileAvatar 
                user={{
                  name: user.name,
                  email: user.email,
                  image: user.image || undefined
                }} 
                size="md" 
              />
              <div>
                <p className="text-sm font-medium text-white">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              <CogIcon className="h-4 w-4 mr-3" />
              Profile Settings
            </Link>
            <Link
              href="/orders"
              className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              <ShoppingBagIcon className="h-4 w-4 mr-3" />
              Order History
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              <HeartIcon className="h-4 w-4 mr-3" />
              Wishlist
            </Link>
          </div>

          <div className="border-t border-slate-700 py-2">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
