'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface SecurityTip {
  id: string;
  text: string;
  importance: 'high' | 'medium' | 'low';
}

interface SecurityTipsProps {
  tips?: SecurityTip[];
  showAll?: boolean;
}

const DEFAULT_TIPS: SecurityTip[] = [
  {
    id: '1',
    text: 'Use a strong, unique password for your account',
    importance: 'high'
  },
  {
    id: '2',
    text: 'Enable two-factor authentication for additional security',
    importance: 'high'
  },
  {
    id: '3',
    text: 'Regularly review your connected devices and login activity',
    importance: 'medium'
  },
  {
    id: '4',
    text: 'Never share your password or login credentials',
    importance: 'high'
  },
  {
    id: '5',
    text: 'Sign out of devices you no longer use',
    importance: 'medium'
  },
  {
    id: '6',
    text: 'Keep your browser and apps updated for security patches',
    importance: 'medium'
  },
  {
    id: '7',
    text: 'Be cautious when accessing your account on public Wi-Fi',
    importance: 'low'
  }
];

export default function SecurityTips({ tips = DEFAULT_TIPS, showAll = false }: SecurityTipsProps) {
  const getImportanceColor = (importance: SecurityTip['importance']) => {
    switch (importance) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  const getImportanceIcon = (importance: SecurityTip['importance']) => {
    switch (importance) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const sortedTips = tips.sort((a, b) => {
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });

  const displayTips = showAll ? sortedTips : sortedTips.slice(0, 5);

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
        <h4 className="text-white font-medium">Security Tips</h4>
      </div>
      
      <div className="space-y-3">
        {displayTips.map((tip) => (
          <div key={tip.id} className="flex items-start space-x-3">
            <span className="flex-shrink-0 mt-0.5">
              {getImportanceIcon(tip.importance)}
            </span>
            <p className={`text-sm ${getImportanceColor(tip.importance)}`}>
              {tip.text}
            </p>
          </div>
        ))}
      </div>

      {!showAll && tips.length > 5 && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <p className="text-xs text-slate-500 text-center">
            Showing {displayTips.length} of {tips.length} security tips
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          💡 <strong>Pro tip:</strong> Following these security practices helps protect your account from unauthorized access and keeps your personal information safe.
        </p>
      </div>
    </div>
  );
}