'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuthState';
import { ShoppingBagIcon, UserPlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface CheckoutProtectionProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that protects checkout flow and handles guest-to-user conversion
 * Allows guests to browse and add to cart, but requires auth for checkout
 */
export default function CheckoutProtection({ 
  children, 
  redirectTo = '/checkout' 
}: CheckoutProtectionProps) {
  const { isAuthenticated, isLoading, guestSession } = useAuthState();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Check if this is a checkout attempt
  useEffect(() => {
    if (!isLoading && !isAuthenticated && guestSession) {
      setShowAuthPrompt(true);
    }
  }, [isAuthenticated, isLoading, guestSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (showAuthPrompt) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-700 rounded-lg shadow-lg p-8 border border-slate-600">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-600 mb-6">
              <ShoppingBagIcon className="h-8 w-8 text-slate-200" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-100 mb-4">
              Ready to Checkout?
            </h2>
            
            <p className="text-slate-300 mb-8">
              Create an account or sign in to complete your purchase and save your items for later.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => router.push(`/sign-up?callbackUrl=${encodeURIComponent(redirectTo)}`)}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Create Account
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
              
              <button
                onClick={() => router.push(`/sign-in?callbackUrl=${encodeURIComponent(redirectTo)}`)}
                className="w-full flex items-center justify-center px-6 py-3 border border-slate-500 text-base font-medium rounded-lg text-slate-200 bg-slate-600 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors duration-200"
              >
                Sign In Instead
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-600">
              <p className="text-sm text-slate-400">
                Don&apos;t worry - your cart items are saved and will be waiting for you after you sign in!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
