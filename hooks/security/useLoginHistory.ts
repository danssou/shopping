'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/components/notifications';

interface LoginSession {
  id: string;
  deviceType: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActivity: string;
  isCurrent: boolean;
}

interface LoginHistoryState {
  sessions: LoginSession[];
  totalSessions: number;
  isLoading: boolean;
  isRevokingSession: string | null; // ID of session being revoked
}

// Mock login history data
const mockSessions: LoginSession[] = [
  {
    id: '1',
    deviceType: 'desktop',
    browser: 'Chrome 119',
    os: 'Windows 11',
    location: 'New York, United States',
    ipAddress: '192.168.1.100',
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    isCurrent: true
  },
  {
    id: '2',
    deviceType: 'mobile',
    browser: 'Safari 17',
    os: 'iOS 17',
    location: 'San Francisco, United States',
    ipAddress: '10.0.0.50',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isCurrent: false
  },
  {
    id: '3',
    deviceType: 'desktop',
    browser: 'Firefox 120',
    os: 'macOS 14',
    location: 'London, United Kingdom',
    ipAddress: '172.16.0.25',
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isCurrent: false
  },
  {
    id: '4',
    deviceType: 'tablet',
    browser: 'Chrome 119',
    os: 'Android 14',
    location: 'Toronto, Canada',
    ipAddress: '203.0.113.15',
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isCurrent: false
  }
];

const mockGetLoginHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    sessions: mockSessions,
    totalSessions: mockSessions.length
  };
};

const mockRevokeSession = async (sessionId: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
  if (sessionIndex > -1) {
    mockSessions.splice(sessionIndex, 1);
  }
  return { success: true };
};

export function useLoginHistory() {
  const [state, setState] = useState<LoginHistoryState>({
    sessions: [],
    totalSessions: 0,
    isLoading: true,
    isRevokingSession: null
  });

  const { success: showSuccess, error: showError } = useNotifications();

  const loadLoginHistory = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const data = await mockGetLoginHistory();
      setState(prev => ({
        ...prev,
        sessions: data.sessions,
        totalSessions: data.totalSessions,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load login history:', error);
      showError('Load Failed', 'Failed to load login history');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [showError]);

  // Load login history on mount
  useEffect(() => {
    loadLoginHistory();
  }, [loadLoginHistory]);

  const revokeSessionById = async (sessionId: string) => {
    setState(prev => ({ ...prev, isRevokingSession: sessionId }));
    
    try {
      await mockRevokeSession(sessionId);
      
      // Remove the revoked session from the list
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.filter(session => session.id !== sessionId),
        totalSessions: prev.totalSessions - 1,
        isRevokingSession: null
      }));
      
      showSuccess('Session Revoked', 'Session has been revoked successfully');
    } catch (error) {
      console.error('Failed to revoke session:', error);
      showError('Revoke Failed', 'Failed to revoke session');
      setState(prev => ({ ...prev, isRevokingSession: null }));
    }
  };

  const getCurrentSession = () => {
    return state.sessions.find(session => session.isCurrent);
  };

  const getOtherSessions = () => {
    return state.sessions.filter(session => !session.isCurrent);
  };

  const getRecentSessions = (limit = 5) => {
    return state.sessions
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
      .slice(0, limit);
  };

  const isSessionBeingRevoked = (sessionId: string) => {
    return state.isRevokingSession === sessionId;
  };

  return {
    ...state,
    loadLoginHistory,
    revokeSession: revokeSessionById,
    getCurrentSession,
    getOtherSessions,
    getRecentSessions,
    isSessionBeingRevoked,
    refresh: loadLoginHistory,
    hasMultipleSessions: state.sessions.length > 1,
    activeSessionsCount: state.sessions.filter(s => !s.isCurrent).length
  };
}
