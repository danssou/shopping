'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth/client';

interface GuestSession {
  sessionToken: string;
  isLoading: boolean;
  error: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  } | null;
  guestSession: GuestSession | null;
  isLoading: boolean;
}

/**
 * Enhanced hook that manages both authenticated users and guest sessions
 * Automatically creates guest sessions for unauthenticated users
 */
export function useAuthState(): AuthState {
  const { data: session, isPending } = useSession();
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);

  useEffect(() => {
    // If user is authenticated, we don't need a guest session
    if (session?.user) {
      setGuestSession(null);
      return;
    }

    // If user is not authenticated and we don't have a guest session, create one
    if (!isPending && !session?.user && !guestSession) {
      createGuestSession();
    }
  }, [session, isPending, guestSession]);

  const createGuestSession = async () => {
    try {
      setGuestSession(prev => ({ 
        sessionToken: prev?.sessionToken || '', 
        isLoading: true, 
        error: null 
      }));

      const response = await fetch('/api/auth/guest-session', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create guest session');
      }

      const data = await response.json();
      
      setGuestSession({
        sessionToken: data.sessionToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setGuestSession({
        sessionToken: '',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return {
    isAuthenticated: !!session?.user,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image || undefined,
    } : null,
    guestSession: session?.user ? null : guestSession,
    isLoading: isPending || guestSession?.isLoading || false,
  };
}

/**
 * Hook to get the current session identifier (user ID or guest session token)
 * Useful for cart and other session-based operations
 */
export function useSessionId() {
  const authState = useAuthState();
  
  if (authState.isAuthenticated) {
    return {
      type: 'user' as const,
      id: authState.user?.id,
      isLoading: authState.isLoading,
    };
  }
  
  return {
    type: 'guest' as const,
    id: authState.guestSession?.sessionToken,
    isLoading: authState.isLoading,
  };
}

/**
 * Hook specifically for cart operations that need session context
 */
export function useCartSession() {
  const sessionId = useSessionId();
  
  return {
    sessionId: sessionId.id,
    sessionType: sessionId.type,
    isLoading: sessionId.isLoading,
    isReady: !sessionId.isLoading && !!sessionId.id,
  };
}
