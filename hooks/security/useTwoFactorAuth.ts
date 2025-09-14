'use client'// Mock 2FA data storage
const mockTwoFactorData = {
  isEnabled: false,
  backupCodesRemaining: 0,
};

// Mock API calls
const mockGetTwoFactorStatus = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockTwoFactorData;
};

const mockToggleTwoFactorAuth = async (enable: boolean) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (enable) {
    mockTwoFactorData.isEnabled = true;
    mockTwoFactorData.backupCodesRemaining = 10;
    return {
      twoFactorEnabled: true,
      backupCodes: [
        'ABC123DEF456',
        'GHI789JKL012',
        'MNO345PQR678',
        'STU901VWX234',
        'YZA567BCD890',
        'EFG123HIJ456',
        'KLM789NOP012',
        'QRS345TUV678',
        'WXY901ZAB234',
        'CDE567FGH890'
      ]
    };
  } else {
    mockTwoFactorData.isEnabled = false;
    mockTwoFactorData.backupCodesRemaining = 0;
    return {
      twoFactorEnabled: false
    };
  }
};import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/components/notifications';

interface TwoFactorState {
  isEnabled: boolean;
  backupCodesRemaining: number;
  isLoading: boolean;
  isToggling: boolean;
}

export function useTwoFactorAuth() {
  const [state, setState] = useState<TwoFactorState>({
    isEnabled: mockTwoFactorData.isEnabled,
    backupCodesRemaining: mockTwoFactorData.backupCodesRemaining,
    isLoading: true,
    isToggling: false
  });

  const { success: showSuccess, error: showError } = useNotifications();

  const loadTwoFactorStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const data = await mockGetTwoFactorStatus();
      setState(prev => ({
        ...prev,
        isEnabled: data.isEnabled,
        backupCodesRemaining: data.backupCodesRemaining || 0,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
      showError('Load Failed', 'Failed to check two-factor authentication status');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [showError]);

  // Load 2FA status on mount
  useEffect(() => {
    loadTwoFactorStatus();
  }, [loadTwoFactorStatus]);

  const toggle2FA = async (enable: boolean) => {
    setState(prev => ({ ...prev, isToggling: true }));
    
    try {
      const result = await mockToggleTwoFactorAuth(enable);
      
      setState(prev => ({
        ...prev,
        isEnabled: result.twoFactorEnabled,
        backupCodesRemaining: result.backupCodes ? result.backupCodes.length : 0,
        isToggling: false
      }));
      
      if (enable && result.backupCodes) {
        showSuccess(
          '2FA Enabled',
          `Two-factor authentication has been enabled. ${result.backupCodes.length} backup codes generated.`
        );
        
        // Show backup codes to user (in a real app, this would be a modal)
        console.log('Backup codes:', result.backupCodes);
      } else {
        showSuccess(
          enable ? '2FA Enabled' : '2FA Disabled',
          enable 
            ? 'Two-factor authentication has been enabled successfully'
            : 'Two-factor authentication has been disabled'
        );
      }
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
      showError(
        'Toggle Failed',
        `Failed to ${enable ? 'enable' : 'disable'} two-factor authentication`
      );
      setState(prev => ({ ...prev, isToggling: false }));
    }
  };

  const enable2FA = () => toggle2FA(true);
  const disable2FA = () => toggle2FA(false);

  return {
    ...state,
    enable2FA,
    disable2FA,
    toggle2FA,
    refresh: loadTwoFactorStatus
  };
}