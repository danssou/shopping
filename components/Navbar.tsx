'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingBagIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/lib/stores';
import { useWishlist } from '@/hooks/useStore';
import { useSession, signOut } from '@/lib/auth-client';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import CartSidebar from '@/components/cart/CartSidebar';
import { useCartPersistence } from '@/hooks/useCartPersistence';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = '' }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore(state => state.getCartCount());
  const hasHydrated = useCartStore(state => state.hasHydrated);
  const setHasHydrated = useCartStore(state => state.setHasHydrated);
  const { count: wishlistCount } = useWishlist();
  const { data: session, isPending } = useSession();
  const { showWelcomeNotification } = useCartPersistence();

  // Handle hydration for cart store
  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  const navigationItems = [
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Kids', href: '/kids' },
    { name: 'Collections', href: '/collections' },
    { name: 'Recommendations', href: '/recommendations' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover:opacity-80 transition-all duration-300 group">
              <Image
                src="/logo.svg"
                alt="CODALWARE"
                width={60}
                height={24}
                className="h-6 w-auto brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-200 hover:text-yellow-400 px-3 py-2 font-medium transition-all duration-300 relative group"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button 
              className="p-2 text-slate-200 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Wishlist */}
            {session && (
              <Link href="/wishlist" className="relative group">
                <button 
                  className="p-2 text-slate-200 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="h-6 w-6" />
                  {hasHydrated && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-300 text-slate-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow border border-yellow-400/30">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>
            )}

            {/* Shopping Cart */}
            <div className="relative">
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`p-2 text-slate-200 hover:text-yellow-400 transition-all duration-300 hover:scale-110 ${
                  hasHydrated && showWelcomeNotification ? 'animate-pulse' : ''
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingBagIcon className={`h-6 w-6 ${
                  hasHydrated && showWelcomeNotification ? 'animate-bounce text-yellow-400' : ''
                }`} />
                {hasHydrated && totalItems > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-yellow-300 text-slate-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow border border-yellow-400/30 ${
                    showWelcomeNotification ? 'animate-ping' : ''
                  }`}>
                    {totalItems}
                  </span>
                )}
                {/* Flashing ring effect when notification is showing */}
                {hasHydrated && showWelcomeNotification && (
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-300/40 animate-ping opacity-20 scale-105 blur-sm"></div>
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
                  className="px-4 py-2 text-slate-200 hover:text-yellow-400 transition-all duration-300 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
                    <ProfileAvatar 
                      user={{
                        name: session.user.name,
                        email: session.user.email,
                        image: session.user.image || undefined
                      }} 
                      size="sm" 
                    />
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

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
