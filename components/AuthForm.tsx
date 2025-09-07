'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { signInAction, signUpAction } from '@/lib/auth/actions';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = mode === 'signin' 
        ? await signInAction(formData)
        : await signUpAction(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // Redirect to callback URL or home after successful auth
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError('An unexpected error occurred');
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
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
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
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="johndoe@gmail.com"
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
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="minimum 8 characters"
            className="w-full px-4 py-3 pr-12 border border-slate-500 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all duration-200 text-slate-100 placeholder-slate-400 bg-slate-600"
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
