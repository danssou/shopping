'use client';

import { ClockIcon } from '@heroicons/react/24/outline';
import { useLoginHistory } from '@/hooks/security';
import { LoadingState } from './LoadingSpinner';

export default function LoginHistory() {
  const {
    sessions,
    isLoading,
    revokeSession,
    isSessionBeingRevoked,
    getRecentSessions,
    hasMultipleSessions,
    activeSessionsCount
  } = useLoginHistory();

  const recentSessions = getRecentSessions(3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
          <h4 className="text-white font-medium">Login History</h4>
        </div>
        {hasMultipleSessions && (
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
            {activeSessionsCount} active sessions
          </span>
        )}
      </div>
      
      <p className="text-slate-400 text-sm mb-4">
        Review recent login activity on your account.
      </p>

      <LoadingState isLoading={isLoading} message="Loading login history...">
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div 
                key={session.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  session.isCurrent 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-slate-600/50 border-slate-600 hover:bg-slate-600/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-white">
                        {session.deviceType} • {session.browser}
                      </p>
                      {session.isCurrent && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {session.location} • {session.ipAddress}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(session.lastActivity)}
                    </p>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      disabled={isSessionBeingRevoked(session.id)}
                      className="text-red-400 hover:text-red-300 disabled:text-red-600 disabled:cursor-not-allowed text-xs px-3 py-1 rounded transition-colors"
                    >
                      {isSessionBeingRevoked(session.id) ? 'Revoking...' : 'Revoke'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {sessions.length > 3 && (
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Showing {recentSessions.length} of {sessions.length} sessions
                </p>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400">
                <strong>Security tip:</strong> If you see any suspicious activity, 
                revoke those sessions immediately and change your password.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No login history available</p>
            <p className="text-slate-500 text-xs mt-1">
              Login activity will appear here once available
            </p>
          </div>
        )}
      </LoadingState>
    </div>
  );
}