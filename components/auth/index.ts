// Authentication components
export { default as UserProfileDropdown } from './UserProfileDropdown';
export { default as CheckoutProtection } from './CheckoutProtection';

// Re-export auth client hooks for convenience
export { useSession, signIn, signUp, signOut } from '@/lib/auth/client';

// Re-export enhanced auth hooks
export { useAuthState, useSessionId, useCartSession } from '@/hooks/useAuthState';
