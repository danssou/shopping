import Link from 'next/link';
import AuthFormWrapper from '@/components/AuthFormWrapper';
import SocialProviders from '@/components/SocialProviders';

export default function SignUpPage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-slate-300 mb-2">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-slate-200 hover:text-slate-100 font-medium underline">
            Sign In
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
          Join CODALWARE Today!
        </h1>
        <p 
          className="text-slate-300"
          style={{ 
            fontSize: 'var(--text-body)', 
            lineHeight: 'var(--text-body--line-height)' 
          }}
        >
          Create your account to start your fitness journey
        </p>
      </div>

      {/* Social Providers */}
      <div className="mb-8">
        <SocialProviders mode="signup" />
      </div>

      {/* Auth Form */}
      <AuthFormWrapper mode="signup" />

      {/* Footer Links */}
      <div className="mt-8 text-center">
        <p 
          className="text-slate-400"
          style={{ 
            fontSize: 'var(--text-caption)', 
            lineHeight: 'var(--text-caption--line-height)' 
          }}
        >
          Already have an account?{' '}
          <Link href="/sign-in" className="text-slate-200 hover:text-slate-100 font-medium underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
