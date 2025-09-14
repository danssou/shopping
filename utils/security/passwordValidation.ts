// Password strength levels
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'excellent';

// Password validation result
export interface PasswordValidation {
  isValid: boolean;
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    noCommonWords: boolean;
    noSequential: boolean;
  };
}

// Common weak passwords to check against
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'password123', 'admin', 'letmein', 'welcome', 'monkey',
  'dragon', 'master', 'shadow', 'football', 'baseball'
];

// Sequential patterns to detect
const SEQUENTIAL_PATTERNS = [
  '123456', '654321', 'abcdef', 'fedcba', 'qwerty', 'asdfgh',
  'zxcvbn', '098765', '567890', 'mnbvcx'
];

/**
 * Validates password strength and provides detailed feedback
 */
export function validatePassword(password: string): PasswordValidation {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommonWords: !isCommonPassword(password),
    noSequential: !hasSequentialPattern(password)
  };

  const feedback: string[] = [];
  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 20;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety scoring
  if (requirements.hasUppercase) score += 15;
  else feedback.push('Include uppercase letters (A-Z)');

  if (requirements.hasLowercase) score += 15;
  else feedback.push('Include lowercase letters (a-z)');

  if (requirements.hasNumbers) score += 15;
  else feedback.push('Include numbers (0-9)');

  if (requirements.hasSpecialChars) score += 15;
  else feedback.push('Include special characters (!@#$%^&*)');

  // Pattern analysis
  if (requirements.noCommonWords) score += 10;
  else feedback.push('Avoid common passwords');

  if (requirements.noSequential) score += 10;
  else feedback.push('Avoid sequential characters (123, abc, qwerty)');

  // Determine strength
  const strength = getPasswordStrength(score);
  
  // Additional feedback based on strength
  if (strength === 'weak') {
    feedback.unshift('Your password is very weak and easily guessed');
  } else if (strength === 'fair') {
    feedback.unshift('Your password is fair but could be stronger');
  } else if (strength === 'good') {
    feedback.unshift('Good password! Consider adding more variety');
  } else if (strength === 'strong') {
    feedback.unshift('Strong password! Well done');
  } else if (strength === 'excellent') {
    feedback.unshift('Excellent password! Very secure');
  }

  const isValid = Object.values(requirements).every(req => req) && score >= 60;

  return {
    isValid,
    strength,
    score: Math.min(score, 100),
    feedback,
    requirements
  };
}

/**
 * Get password strength based on score
 */
function getPasswordStrength(score: number): PasswordStrength {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'strong';
  if (score >= 50) return 'good';
  if (score >= 30) return 'fair';
  return 'weak';
}

/**
 * Check if password is in common passwords list
 */
function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some(common => 
    lowerPassword.includes(common) || common.includes(lowerPassword)
  );
}

/**
 * Check for sequential patterns in password
 */
function hasSequentialPattern(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return SEQUENTIAL_PATTERNS.some(pattern => lowerPassword.includes(pattern));
}

/**
 * Get color for password strength indicator
 */
export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'fair':
      return 'text-orange-500';
    case 'good':
      return 'text-yellow-500';
    case 'strong':
      return 'text-blue-500';
    case 'excellent':
      return 'text-green-500';
    default:
      return 'text-slate-400';
  }
}

/**
 * Get background color for password strength progress bar
 */
export function getStrengthBgColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'fair':
      return 'bg-orange-500';
    case 'good':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-blue-500';
    case 'excellent':
      return 'bg-green-500';
    default:
      return 'bg-slate-400';
  }
}

/**
 * Check if passwords match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): {
  isValid: boolean;
  message: string;
} {
  if (!confirmPassword) {
    return {
      isValid: false,
      message: 'Please confirm your password'
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match'
    };
  }

  return {
    isValid: true,
    message: 'Passwords match'
  };
}

/**
 * Generate password strength suggestions
 */
export function generatePasswordSuggestions(validation: PasswordValidation): string[] {
  const suggestions: string[] = [];

  if (!validation.requirements.minLength) {
    suggestions.push('Make your password at least 8 characters long');
  }

  if (!validation.requirements.hasUppercase && !validation.requirements.hasLowercase) {
    suggestions.push('Mix uppercase and lowercase letters');
  } else if (!validation.requirements.hasUppercase) {
    suggestions.push('Add some uppercase letters');
  } else if (!validation.requirements.hasLowercase) {
    suggestions.push('Add some lowercase letters');
  }

  if (!validation.requirements.hasNumbers) {
    suggestions.push('Include some numbers for better security');
  }

  if (!validation.requirements.hasSpecialChars) {
    suggestions.push('Add special characters like !@#$%^&*');
  }

  if (!validation.requirements.noCommonWords) {
    suggestions.push('Avoid common words and phrases');
  }

  if (!validation.requirements.noSequential) {
    suggestions.push('Avoid keyboard patterns like qwerty or 123456');
  }

  if (validation.score < 70) {
    suggestions.push('Consider using a passphrase with multiple words');
    suggestions.push('Try substituting letters with numbers or symbols');
  }

  return suggestions;
}
