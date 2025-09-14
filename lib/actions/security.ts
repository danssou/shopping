'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

// Types
export interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrent: boolean;
}

export interface SecurityActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Change user password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<SecurityActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        message: 'You must be logged in to change your password'
      };
    }

    // Validate input
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        message: 'New password and confirmation do not match'
      };
    }

    if (data.newPassword.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long'
      };
    }

    // For demo purposes, simulate password change
    // In a real app, you'd use Better Auth's password change functionality
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Password changed successfully'
    };

  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      message: 'Failed to change password. Please try again.'
    };
  }
}

/**
 * Toggle Two-Factor Authentication
 */
export async function toggleTwoFactorAuth(enable: boolean): Promise<SecurityActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        message: 'You must be logged in to manage 2FA'
      };
    }

    // For now, this is a placeholder implementation
    // In a real app, you'd integrate with an authenticator service
    
    // Simulate toggling 2FA
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: enable 
        ? 'Two-factor authentication has been enabled. Please save your backup codes.'
        : 'Two-factor authentication has been disabled.',
      data: {
        twoFactorEnabled: enable,
        backupCodes: enable ? [
          'BACKUP-CODE-1234',
          'BACKUP-CODE-5678',
          'BACKUP-CODE-9012'
        ] : undefined
      }
    };

  } catch (error) {
    console.error('2FA toggle error:', error);
    return {
      success: false,
      message: `Failed to ${enable ? 'enable' : 'disable'} two-factor authentication`
    };
  }
}

/**
 * Get login history
 */
export async function getLoginHistory(): Promise<SecurityActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        message: 'You must be logged in to view login history'
      };
    }

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Unknown Device';
    const currentIP = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     '127.0.0.1';

    // Mock login sessions - in a real app, you'd query your auth logs
    const mockSessions: LoginSession[] = [
      {
        id: '1',
        device: getDeviceFromUserAgent(userAgent),
        location: 'Current Location',
        ipAddress: currentIP,
        timestamp: new Date().toISOString(),
        isCurrent: true
      },
      {
        id: '2',
        device: 'Chrome on Windows',
        location: 'New York, NY',
        ipAddress: '192.168.1.100',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: false
      },
      {
        id: '3',
        device: 'Safari on iPhone',
        location: 'San Francisco, CA',
        ipAddress: '10.0.0.1',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: false
      }
    ];

    return {
      success: true,
      message: 'Login history retrieved successfully',
      data: {
        sessions: mockSessions,
        totalSessions: mockSessions.length
      }
    };

  } catch (error) {
    console.error('Login history error:', error);
    return {
      success: false,
      message: 'Failed to load login history'
    };
  }
}

/**
 * Revoke a login session
 */
export async function revokeSession(sessionId: string): Promise<SecurityActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        message: 'You must be logged in to revoke sessions'
      };
    }

    // Mock session revocation - in a real app, you'd invalidate the session
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Revoking session: ${sessionId}`);

    return {
      success: true,
      message: 'Session revoked successfully'
    };

  } catch (error) {
    console.error('Session revocation error:', error);
    return {
      success: false,
      message: 'Failed to revoke session'
    };
  }
}

/**
 * Get 2FA status
 */
export async function getTwoFactorStatus(): Promise<SecurityActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user) {
      return {
        success: false,
        message: 'You must be logged in to check 2FA status'
      };
    }

    // Mock 2FA status - in a real app, you'd check the user's 2FA settings
    const twoFactorEnabled = false; // This would come from the database

    return {
      success: true,
      message: '2FA status retrieved',
      data: {
        twoFactorEnabled,
        backupCodesRemaining: twoFactorEnabled ? 3 : 0
      }
    };

  } catch (error) {
    console.error('2FA status error:', error);
    return {
      success: false,
      message: 'Failed to check 2FA status'
    };
  }
}

// Helper function to parse device from user agent
function getDeviceFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Chrome')) {
    return 'Chrome Browser';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox Browser';
  } else if (userAgent.includes('Safari')) {
    return 'Safari Browser';
  } else if (userAgent.includes('Edge')) {
    return 'Edge Browser';
  } else if (userAgent.includes('Mobile')) {
    return 'Mobile Device';
  } else {
    return 'Unknown Device';
  }
}