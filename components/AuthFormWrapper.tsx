'use client';

import { Suspense } from 'react';
import AuthForm from './AuthForm';

interface AuthFormWrapperProps {
  mode: 'signin' | 'signup';
}

function AuthFormContent({ mode }: AuthFormWrapperProps) {
  return <AuthForm mode={mode} />;
}

export default function AuthFormWrapper({ mode }: AuthFormWrapperProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
      </div>
    }>
      <AuthFormContent mode={mode} />
    </Suspense>
  );
}
