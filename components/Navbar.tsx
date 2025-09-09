'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/lib/store';
import { useSession, signOut } from '@/lib/auth-client';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = '' }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const { data: session, isPending, error } = useSession();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Debug logging
  console.log('🔍 Navbar Debug:', {
    session,
    isPending,
    error,
    sessionUser: session?.user,
    hasSession: !!session,
    hasUser: !!session?.user
  });

  const navigationItems = [
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Kids', href: '/kids' },
    { name: 'Collections', href: '/collections' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`bg-slate-800 border-b border-slate-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="CODALWARE"
                width={60}
                height={24}
                className="h-6 w-auto brightness-0 invert"
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 font-medium transition-colors duration-200 relative group"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button 
              className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Shopping Cart */}
            <div className="relative">
              <button 
                className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-slate-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Authentication */}
            {isPending ? (
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-slate-600 rounded-full"></div>
              </div>
            ) : session?.user ? (
              <UserProfileDropdown className="text-white" />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link 
                  href="/sign-in"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700 bg-slate-800">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 font-medium transition-colors duration-200"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Authentication */}
              {!isPending && session?.user ? (
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="flex items-center px-3 py-2 space-x-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User avatar'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover ring-2 ring-yellow-500/20"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-300" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <Link
                      href="/profile"
                      className="text-gray-300 hover:text-white block px-3 py-2 font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/orders"
                      className="text-gray-300 hover:text-white block px-3 py-2 font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut({ 
                          fetchOptions: { 
                            onSuccess: () => {
                              window.location.href = '/';
                            }
                          } 
                        });
                      }}
                      className="w-full text-left text-red-400 hover:text-red-300 block px-3 py-2 font-medium transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : !isPending && !session?.user ? (
                <div className="border-t border-slate-700 pt-3 mt-3 space-y-1">
                  <Link
                    href="/sign-in"
                    className="text-gray-300 hover:text-white block px-3 py-2 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 block px-3 py-2 font-medium rounded-lg mx-3 text-center transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
