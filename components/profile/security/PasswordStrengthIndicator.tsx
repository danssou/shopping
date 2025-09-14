'use client';

import { type PasswordValidation, getStrengthColor, getStrengthBgColor } from '@/utils/security';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidation;
  showDetails?: boolean;
}

export default function PasswordStrengthIndicator({ 
  validation, 
  showDetails = true 
}: PasswordStrengthIndicatorProps) {
  const { strength, score, feedback, requirements } = validation;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Password Strength</span>
          <span className={`font-medium capitalize ${getStrengthColor(strength)}`}>
            {strength}
          </span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthBgColor(strength)}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="text-xs text-slate-400">
          {score}/100
        </div>
      </div>

      {/* Requirements Checklist */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-300">Requirements:</div>
          <div className="space-y-1">
            <RequirementItem 
              met={requirements.minLength}
              text="At least 8 characters"
            />
            <RequirementItem 
              met={requirements.hasUppercase}
              text="Uppercase letter (A-Z)"
            />
            <RequirementItem 
              met={requirements.hasLowercase}
              text="Lowercase letter (a-z)"
            />
            <RequirementItem 
              met={requirements.hasNumbers}
              text="Number (0-9)"
            />
            <RequirementItem 
              met={requirements.hasSpecialChars}
              text="Special character (!@#$%^&*)"
            />
            <RequirementItem 
              met={requirements.noCommonWords}
              text="Not a common password"
            />
            <RequirementItem 
              met={requirements.noSequential}
              text="No sequential patterns"
            />
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.slice(0, 3).map((message, index) => (
            <div 
              key={index}
              className={`text-xs p-2 rounded ${
                index === 0 
                  ? `${getStrengthColor(strength)} bg-opacity-10 border border-opacity-20` 
                  : 'text-slate-400 bg-slate-700'
              }`}
            >
              {message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        met 
          ? 'bg-green-500 text-white' 
          : 'bg-slate-600 border border-slate-500'
      }`}>
        {met && <span className="text-[10px]">✓</span>}
      </div>
      <span className={met ? 'text-green-400' : 'text-slate-400'}>
        {text}
      </span>
    </div>
  );
}
