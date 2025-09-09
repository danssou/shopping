'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from '@/lib/auth-client';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/';
          },
        },
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isPending) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 w-8 bg-slate-300 rounded-full"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <div className={`relative ${className}`} data-dropdown="user-profile">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg p-2 transition-colors duration-200"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || 'User avatar'}
            width={32}
            height={32}
            className="rounded-full object-cover ring-2 ring-yellow-500/20"
          />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-gray-300" />
        )}
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
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User avatar'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-slate-400" />
              )}
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
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              Profile Settings
            </a>
            <a
              href="/orders"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              Order History
            </a>
            <a
              href="/cart"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsDropdownOpen(false)}
            >
              Shopping Cart
            </a>
          </div>

          <div className="border-t border-slate-700 py-2">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
