'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/lib/store';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className = '' }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    <nav className={`bg-light-100 border-b border-light-300 sticky top-0 z-50 ${className}`}>
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
                className="h-6 w-auto"
                style={{ filter: 'invert(1) brightness(0)' }}
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
                  className="text-dark-700 hover:text-dark-900 px-3 py-2 font-medium transition-colors duration-200 relative group"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-dark-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button 
              className="p-2 text-dark-700 hover:text-dark-900 transition-colors duration-200"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Shopping Cart */}
            <div className="relative">
              <button 
                className="p-2 text-dark-700 hover:text-dark-900 transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red text-light-100 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-dark-700 hover:text-dark-900 transition-colors duration-200"
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-light-300 bg-light-100">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-dark-700 hover:text-dark-900 block px-3 py-2 font-medium transition-colors duration-200"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
