'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { signIn, signUp } from '@/lib/auth-client';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';
      const name = formData.get('name')?.toString() || '';

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

      if (mode === 'signin') {
        await signIn.email({ 
          email, 
          password 
        });
      } else {
        await signUp.email({ 
          email, 
          password,
          name 
        });
      }
      
      // Force a hard refresh to ensure session is loaded
      window.location.href = callbackUrl;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'error' in error) {
        const authError = error as { error?: { message?: string } };
        if (authError.error?.message) {
          setError(authError.error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const messageError = error as { message: string };
        setError(messageError.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-slate-200 mb-2"
            style={{ 
              fontSize: 'var(--text-caption)', 
              lineHeight: 'var(--text-caption--line-height)' 
            }}
          >
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your full name (required)"
            className="w-full px-4 py-3 border border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-100 placeholder-slate-400 bg-slate-600"
            style={{ 
              fontSize: 'var(--text-body)', 
              lineHeight: 'var(--text-body--line-height)' 
            }}
          />
        </div>
      )}

      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-slate-200 mb-2"
          style={{ 
            fontSize: 'var(--text-caption)', 
            lineHeight: 'var(--text-caption--line-height)' 
          }}
        >
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email address (required)"
          className="w-full px-4 py-3 border border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-100 placeholder-slate-400 bg-slate-600"
          style={{ 
            fontSize: 'var(--text-body)', 
            lineHeight: 'var(--text-body--line-height)' 
          }}
        />
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-slate-200 mb-2"
          style={{ 
            fontSize: 'var(--text-caption)', 
            lineHeight: 'var(--text-caption--line-height)' 
          }}
        >
          Password <span className="text-red-400 ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder={mode === 'signup' ? "8+ characters, include uppercase, lowercase, numbers" : "Enter your password"}
            className={`w-full px-4 py-3 pr-12 border ${error && error.toLowerCase().includes('password') ? 'border-red-400' : 'border-slate-500'} rounded-lg focus:ring-2 ${error && error.toLowerCase().includes('password') ? 'focus:ring-red-400' : 'focus:ring-slate-400'} focus:border-transparent outline-none transition-all duration-200 text-slate-100 placeholder-slate-400 bg-slate-600`}
            style={{ 
              fontSize: 'var(--text-body)', 
              lineHeight: 'var(--text-body--line-height)' 
            }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          fontSize: 'var(--text-body)', 
          lineHeight: 'var(--text-body--line-height)' 
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
          </div>
        ) : (
          mode === 'signin' ? 'Sign In' : 'Sign Up'
        )}
      </button>

      {mode === 'signup' && (
        <p 
          className="text-center text-slate-400"
          style={{ 
            fontSize: 'var(--text-footnote)', 
            lineHeight: 'var(--text-footnote--line-height)' 
          }}
        >
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-slate-200 hover:text-slate-100 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-slate-200 hover:text-slate-100 underline">
            Privacy Policy
          </a>
        </p>
      )}
    </form>
  );
}
