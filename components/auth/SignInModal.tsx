'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { signIn, signUp } from '@/lib/auth-client';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  redirectTo?: string;
  initialMode?: 'signin' | 'signup';
}

export default function SignInModal({ isOpen, onClose, onSuccess, redirectTo, initialMode = 'signin' }: SignInModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setError('');
      setIsLoading(false);
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Comprehensive validation
    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Additional validation for sign-up
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Full name is required');
        setIsLoading(false);
        return;
      }

      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters long');
        setIsLoading(false);
        return;
      }

      if (!confirmPassword.trim()) {
        setError('Please confirm your password');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters for new accounts');
        setIsLoading(false);
        return;
      }

      // Check for strong password
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        setIsLoading(false);
        return;
      }
    }

    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn.email({
          email,
          password,
        });
      } else {
        result = await signUp.email({
          email,
          password,
          name: name.trim(),
        });
      }

      if (result.error) {
        setError(result.error.message || `Failed to ${mode === 'signin' ? 'sign in' : 'create account'}`);
        setIsLoading(false);
        return;
      }

      // Success! Close modal and handle redirect
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-600/50 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-full text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === 'signin' ? 'Welcome Back!' : 'Join Us!'}
            </h2>
            <p className="text-slate-300">
              {mode === 'signin' ? 'Sign in to continue your shopping' : 'Create your account to get started'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Only for Sign Up */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    error && !name.trim() 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-yellow-500'
                  }`}
                  placeholder="Enter your full name (required)"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  error && (!email.trim() || !email.includes('@')) 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-600 focus:ring-yellow-500'
                }`}
                placeholder="Enter your email address (required)"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password <span className="text-red-400">*</span>
                {mode === 'signup' && (
                  <span className="text-xs text-slate-400 ml-2">
                    (min 8 chars, uppercase, lowercase, number)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    error && !password.trim() 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-yellow-500'
                  }`}
                  placeholder={mode === 'signup' ? 'Create a strong password (required)' : 'Enter your password (required)'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field - Only for Sign Up */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      error && (!confirmPassword.trim() || password !== confirmPassword) 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-yellow-500'
                    }`}
                    placeholder="Confirm your password (required)"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-yellow-400 hover:text-yellow-300 font-medium underline"
              >
                {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}