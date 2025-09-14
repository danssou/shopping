'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';

interface NavigationHelperProps {
  className?: string;
  showBackButton?: boolean;
  showContinueShoppingButton?: boolean;
  customBackPath?: string;
  customBackLabel?: string;
}

export default function NavigationHelper({
  className = '',
  showBackButton = true,
  showContinueShoppingButton = true,
  customBackPath,
  customBackLabel
}: NavigationHelperProps) {
  const pathname = usePathname();
  
  // Don't show on home page, auth pages, or checkout page
  const isHomePage = pathname === '/' || pathname === '';
  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up');
  const isCheckoutPage = pathname === '/checkout';
  
  if (isHomePage || isAuthPage || isCheckoutPage) {
    return null;
  }

  const getPageContext = () => {
    switch (pathname) {
      case '/profile':
        return {
          title: 'Your Profile',
          description: 'Manage your account settings and preferences',
          backPath: '/',
          backLabel: 'Back to Shopping'
        };
      case '/wishlist':
        return {
          title: 'Your Wishlist',
          description: 'Items you&apos;ve saved for later',
          backPath: '/',
          backLabel: 'Continue Shopping'
        };
      case '/checkout':
        return {
          title: 'Checkout',
          description: 'Review and complete your order',
          backPath: '/',
          backLabel: 'Back to Shopping'
        };
      case '/orders':
        return {
          title: 'Order History',
          description: 'Track your orders and view past purchases',
          backPath: '/',
          backLabel: 'Continue Shopping'
        };
      default:
        return {
          title: 'Shopping',
          description: 'Find what you&apos;re looking for',
          backPath: '/',
          backLabel: 'Back to Home'
        };
    }
  };

  const context = getPageContext();
  const backPath = customBackPath || context.backPath;
  const backLabel = customBackLabel || context.backLabel;

  return (
    <div className={`bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Page Context */}
          <div className="flex items-center space-x-4 flex-1">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="border-l border-slate-300 dark:border-slate-600 pl-4">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                {context.title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {context.description}
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {showContinueShoppingButton && (
              <Link href={backPath}>
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  {pathname === '/' ? (
                    <HomeIcon className="h-4 w-4" />
                  ) : (
                    <ShoppingBagIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{backLabel}</span>
                  <span className="sm:hidden">Shop</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}