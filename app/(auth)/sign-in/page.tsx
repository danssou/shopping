import Link from 'next/link';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import SocialProviders from '@/components/SocialProviders';

export default function SignInPage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-slate-300 mb-2">
          Already have an account?{' '}
          <Link href="/sign-up" className="text-slate-200 hover:text-slate-100 font-medium underline">
            Sign Up
          </Link>
        </p>
        <h1 
          className="text-slate-100 font-bold mb-2"
          style={{ 
            fontSize: 'var(--text-heading-3)', 
            lineHeight: 'var(--text-heading-3--line-height)',
            fontWeight: 'var(--text-heading-3--font-weight)'
          }}
        >
          Welcome Back!
        </h1>
        <p 
          className="text-slate-300"
          style={{ 
            fontSize: 'var(--text-body)', 
            lineHeight: 'var(--text-body--line-height)' 
          }}
        >
          Sign in to your account to continue your fitness journey
        </p>
      </div>

      {/* Social Providers */}
      <div className="mb-8">
        <SocialProviders mode="signin" />
      </div>

      {/* Auth Form */}
      <AuthFormWrapper mode="signin" />

      {/* Footer Links */}
      <div className="mt-8 text-center space-y-4">
        <Link 
          href="/forgot-password" 
          className="text-slate-300 hover:text-slate-100 underline"
          style={{ 
            fontSize: 'var(--text-caption)', 
            lineHeight: 'var(--text-caption--line-height)' 
          }}
        >
          Forgot your password?
        </Link>
        
        <p 
          className="text-slate-400"
          style={{ 
            fontSize: 'var(--text-caption)', 
            lineHeight: 'var(--text-caption--line-height)' 
          }}
        >
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-slate-200 hover:text-slate-100 font-medium underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
