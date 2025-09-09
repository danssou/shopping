'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from './config';
import { db } from '@/lib/db';
import { guest } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Validation schemas
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Sign Up Action
export async function signUpAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name')?.toString(),
      email: formData.get('email')?.toString(),
      password: formData.get('password')?.toString(),
    };

    // Validate input
    const validatedData = signUpSchema.parse(rawData);

    // Create user account
    const result = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name || '',
      },
    });

    // Handle guest-to-user migration if guest session exists
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get('guest_session')?.value;
    
    if (guestSessionToken && result.user) {
      await mergeGuestDataWithUser(guestSessionToken, result.user.id);
      // Clear guest session
      cookieStore.delete('guest_session');
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error('Sign-up error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        error: error.issues[0].message,
      };
    }
    
    // Check if it's a Better Auth APIError
    if (error && typeof error === 'object' && 'status' in error && 'statusCode' in error) {
      const apiError = error as { status: string; statusCode: number; message?: string };
      
      // Handle specific API errors
      if (apiError.statusCode === 422 && apiError.status === 'UNPROCESSABLE_ENTITY') {
        return {
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }
    }
    
    // Check if it's a Better Auth error with message
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as { message: string }).message;
      
      // Handle specific error cases
      if (errorMessage.includes('User already exists') || errorMessage.includes('already exists') || errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        return {
          error: 'An account with this email already exists. Please sign in instead.',
        };
      }
      
      if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        return {
          error: 'Please check your email and password format.',
        };
      }
    }
    
    // Check the error logs for specific Better Auth messages
    if (error && typeof error === 'string' && error.includes('existing email')) {
      return {
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }
    
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

// Sign In Action
export async function signInAction(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email')?.toString(),
      password: formData.get('password')?.toString(),
    };

    // Validate input
    const validatedData = signInSchema.parse(rawData);

    // Sign in user
    const result = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    // Handle guest-to-user migration if guest session exists
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get('guest_session')?.value;
    
    if (guestSessionToken && result.user) {
      await mergeGuestDataWithUser(guestSessionToken, result.user.id);
      // Clear guest session
      cookieStore.delete('guest_session');
    }

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.issues[0].message,
      };
    }
    
    return {
      error: 'Invalid credentials or an unexpected error occurred',
    };
  }
}

// Sign Out Action
export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: {
        'cookie': (await cookies()).toString()
      },
    });
    redirect('/');
  } catch {
    return {
      error: 'Failed to sign out',
    };
  }
}

// Create Guest Session
export async function createGuestSession() {
  try {
    const cookieStore = await cookies();
    const existingGuestSession = cookieStore.get('guest_session')?.value;

    // Check if guest session already exists and is valid
    if (existingGuestSession) {
      const existingGuest = await db
        .select()
        .from(guest)
        .where(
          and(
            eq(guest.sessionToken, existingGuestSession),
            gt(guest.expiresAt, new Date())
          )
        )
        .limit(1);

      if (existingGuest.length > 0) {
        return {
          success: true,
          sessionToken: existingGuestSession,
        };
      }
    }

    // Create new guest session
    const sessionToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(guest).values({
      sessionToken,
      expiresAt,
    });

    // Set guest session cookie
    cookieStore.set('guest_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: expiresAt,
    });

    return {
      success: true,
      sessionToken,
    };
  } catch {
    return {
      error: 'Failed to create guest session',
    };
  }
}

// Get Current User Session
export async function getCurrentSession() {
  try {
    // We'll implement this through API routes for better cookie handling
    return null; // Placeholder
  } catch {
    return null;
  }
}

// Get Guest Session
export async function getGuestSession() {
  try {
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get('guest_session')?.value;

    if (!guestSessionToken) {
      return null;
    }

    const guestSession = await db
      .select()
      .from(guest)
      .where(
        and(
          eq(guest.sessionToken, guestSessionToken),
          gt(guest.expiresAt, new Date())
        )
      )
      .limit(1);

    return guestSession.length > 0 ? guestSession[0] : null;
  } catch {
    return null;
  }
}

// Helper function to merge guest cart data with user account
async function mergeGuestDataWithUser(guestSessionToken: string, userId: string) {
  try {
    // Find the guest record
    const guestRecord = await db
      .select()
      .from(guest)
      .where(eq(guest.sessionToken, guestSessionToken))
      .limit(1);

    if (guestRecord.length === 0) {
      return;
    }

    // TODO: Implement cart data migration when cart schema is created
    // Example implementation:
    // 1. Find all cart items associated with guestSessionToken
    // const guestCartItems = await db
    //   .select()
    //   .from(cartItems)
    //   .where(eq(cartItems.guestSessionId, guestRecord[0].id));
    
    // 2. For each guest cart item, either:
    //    a) Add to user cart if item doesn't exist
    //    b) Merge quantities if item already exists in user cart
    // for (const item of guestCartItems) {
    //   const existingUserItem = await db
    //     .select()
    //     .from(cartItems)
    //     .where(and(
    //       eq(cartItems.userId, userId),
    //       eq(cartItems.productId, item.productId)
    //     ))
    //     .limit(1);
    //
    //   if (existingUserItem.length > 0) {
    //     // Merge quantities
    //     await db
    //       .update(cartItems)
    //       .set({ 
    //         quantity: existingUserItem[0].quantity + item.quantity,
    //         updatedAt: new Date()
    //       })
    //       .where(eq(cartItems.id, existingUserItem[0].id));
    //   } else {
    //     // Add new item to user cart
    //     await db
    //       .insert(cartItems)
    //       .values({
    //         userId,
    //         productId: item.productId,
    //         quantity: item.quantity,
    //         price: item.price,
    //       });
    //   }
    // }
    
    // 3. Clean up guest cart items and guest session
    // await db.delete(cartItems).where(eq(cartItems.guestSessionId, guestRecord[0].id));
    
    // Clean up the guest record
    await db.delete(guest).where(eq(guest.sessionToken, guestSessionToken));
    
    console.log(`Guest data merged successfully for user ${userId}`);
  } catch (error) {
    console.error('Error merging guest data:', error);
    // Don't throw - we don't want to break the auth flow if cart merge fails
  }
}

// Specific cart migration action for checkout flow
export async function mergeGuestCartWithUserCart(userId: string) {
  try {
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get('guest_session')?.value;
    
    if (!guestSessionToken) {
      return { success: true, message: 'No guest session to merge' };
    }

    await mergeGuestDataWithUser(guestSessionToken, userId);
    
    // Clear guest session cookie
    cookieStore.delete('guest_session');
    
    return { 
      success: true, 
      message: 'Cart data merged successfully' 
    };
  } catch (error) {
    console.error('Error merging guest cart:', error);
    return { 
      success: false, 
      error: 'Failed to merge cart data' 
    };
  }
}

// Route protection helper
export async function requireAuth() {
  const session = await getCurrentSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  return session;
}

// Optional auth helper (allows both authenticated and guest users)
export async function getOptionalAuth() {
  const session = await getCurrentSession();
  const guestSession = session ? null : await getGuestSession();
  
  return {
    user: null, // Will be implemented with proper session handling
    isAuthenticated: false,
    guestSession,
  };
}
