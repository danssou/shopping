'use client';

import { useCartPersistence } from '@/hooks/useCartPersistence';
import { NotificationProvider } from '@/components/notifications';

interface CartPersistenceProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages cart persistence logic and notifications
 * Should be placed high in the component tree to monitor auth changes
 */
export default function CartPersistenceProvider({ children }: CartPersistenceProviderProps) {
  return (
    <NotificationProvider position={{ vertical: 'top', horizontal: 'right' }}>
      <CartPersistenceLogic>
        {children}
      </CartPersistenceLogic>
    </NotificationProvider>
  );
}

/**
 * Inner component that uses the cart persistence hook
 * Separated to ensure it's inside the NotificationProvider
 */
function CartPersistenceLogic({ children }: { children: React.ReactNode }) {
  // This hook handles the cart saving/restoring logic when users sign in/out
  // It now uses the modular notification system instead of a custom component
  useCartPersistence();
  
  return <>{children}</>;
}