'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useCartStore } from '@/lib/stores';
import { useNotifications } from '@/components/notifications';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

/**
 * Hook to manage cart persistence based on authentication status
 * - Authenticated users: Cart is saved to their account and restored on sign-in
 * - Guest users: Cart persists in localStorage until they authenticate
 */
export const useCartPersistence = () => {
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();
  const { success } = useNotifications();
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
    // Clear welcome tracking on page load/refresh to ensure it only shows on actual sign-in
    const welcomeShownFor = localStorage.getItem('welcome-shown-for');
    const currentUserId = session?.user?.id || null;
    
    // If there's a welcome tracking but user is currently signed in, clear it
    // This prevents the message from showing again on page refreshes
    if (welcomeShownFor && currentUserId && welcomeShownFor === currentUserId) {
      setHasShownWelcome(true);
    }
  }, [session?.user?.id]);
  
  useEffect(() => {
    if (!isHydrated) return;
    
    const currentUserId = session?.user?.id || null;
    const currentAuthState = session ? 'authenticated' : 'guest';
    const prevAuthState = localStorage.getItem('auth-state') || 'guest';
    const prevUserId = localStorage.getItem('prev-user-id');
    const welcomeShownFor = localStorage.getItem('welcome-shown-for');
    
    console.log('Auth state check:', { 
      prevAuthState, 
      currentAuthState, 
      prevUserId, 
      currentUserId,
      welcomeShownFor,
      hasShownWelcome
    });
    
    // Only show welcome if this is an actual sign-in event, not just a page load
    const isActualSignIn = (
      (prevAuthState === 'guest' || !prevAuthState) && 
      currentAuthState === 'authenticated' && 
      currentUserId &&
      welcomeShownFor !== currentUserId &&
      !hasShownWelcome
    );
    
    if (isActualSignIn) {
      console.log('User just signed in - processing cart restoration...');
      
      // Save current guest cart items to user's account
      if (items.length > 0) {
        localStorage.setItem(`user-cart-${currentUserId}`, JSON.stringify(items));
        console.log('Saved guest cart items to user account');
      }
      
      // Try to restore any previously saved cart for this user
      const savedUserCart = localStorage.getItem(`user-cart-${currentUserId}`);
      console.log('Saved user cart:', savedUserCart);
      
      if (savedUserCart) {
        try {
          const savedItems = JSON.parse(savedUserCart);
          console.log('Parsed saved items:', savedItems);
          
          // Only show notification if user has saved items to restore
          if (savedItems.length > 0) {
            console.log('Restoring cart and showing notification...');
            
            // Merge or replace current cart with saved items
            useCartStore.setState({ items: savedItems });
            
            // Show modular notification instead of custom component
            success(
              'Welcome back!',
              `You have ${savedItems.length} item${savedItems.length !== 1 ? 's' : ''} waiting just for you`,
              {
                icon: ShoppingBagIcon,
                duration: 5000
              }
            );
            
            setShowWelcomeNotification(true);
            setTimeout(() => setShowWelcomeNotification(false), 5000);
          }
          
          // Mark that we've shown the welcome for this user in this session
          localStorage.setItem('welcome-shown-for', currentUserId);
          setHasShownWelcome(true);
        } catch (error) {
          console.error('Error restoring user cart:', error);
        }
      }
    }
    
    // If user signed out
    if (prevAuthState === 'authenticated' && currentAuthState === 'guest' && prevUserId) {
      // Save current cart to user's account before clearing
      if (items.length > 0) {
        localStorage.setItem(`user-cart-${prevUserId}`, JSON.stringify(items));
      }
      clearCart();
      // Clear welcome tracking so it can show again on next sign-in
      localStorage.removeItem('welcome-shown-for');
      setHasShownWelcome(false);
      console.log('User signed out - cart saved and cleared');
    }
    
    // If authenticated user switched accounts
    if (currentAuthState === 'authenticated' && prevUserId && currentUserId && prevUserId !== currentUserId) {
      // Save previous user's cart
      if (items.length > 0) {
        localStorage.setItem(`user-cart-${prevUserId}`, JSON.stringify(items));
      }
      
      // Load new user's cart
      const newUserCart = localStorage.getItem(`user-cart-${currentUserId}`);
      if (newUserCart) {
        try {
          const savedItems = JSON.parse(newUserCart);
          useCartStore.setState({ items: savedItems });
          // Only show notification if the new user has saved items
          if (savedItems.length > 0) {
            success(
              'Account switched!',
              `Cart restored with ${savedItems.length} item${savedItems.length !== 1 ? 's' : ''}`,
              {
                icon: ShoppingBagIcon,
                duration: 4000
              }
            );
            
            setShowWelcomeNotification(true);
            setTimeout(() => setShowWelcomeNotification(false), 4000);
          }
        } catch (error) {
          console.error('Error loading new user cart:', error);
        }
      } else {
        clearCart();
      }
    }
    
    // Store current state
    localStorage.setItem('auth-state', currentAuthState);
    if (currentUserId) {
      localStorage.setItem('prev-user-id', currentUserId);
    }
    
  }, [session, items, clearCart, success, isHydrated, hasShownWelcome]);

  // Save cart periodically for authenticated users
  useEffect(() => {
    if (session?.user?.id && items.length > 0) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(`user-cart-${session.user.id}`, JSON.stringify(items));
      }, 1000); // Debounce saves
      
      return () => clearTimeout(saveTimeout);
    }
  }, [items, session]);

  return {
    isAuthenticated: !!session,
    session,
    showWelcomeNotification: isHydrated && showWelcomeNotification,
    hideNotification: () => setShowWelcomeNotification(false)
  };
};

export default useCartPersistence;