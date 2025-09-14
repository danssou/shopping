'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-bounce" />
      </div>

      <div className="text-center z-10 animate-fade-in">
        {/* 404 Number */}
        <div className="mb-8 animate-float">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 animate-glow">
            404
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-slide-up">
          Oops! Page Not Found
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-md mx-auto animate-slide-up-delay">
          The page you&apos;re looking for seems to have vanished into the digital void. 
          But don&apos;t worry, we&apos;ll help you find your way back!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay-2">
          <Link href="/">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <HomeIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 max-w-md mx-auto animate-slide-up-delay-3">
          <div className="flex items-center space-x-2 text-slate-300 mb-3">
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span className="font-medium">Looking for something specific?</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/wishlist" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              • Wishlist
            </Link>
            <Link href="/profile" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              • Profile
            </Link>
            <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              • Products
            </Link>
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              • Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-slate-500 animate-slide-up-delay-4">
          Error Code: 404 • Page Not Found
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px #3b82f6; }
          50% { text-shadow: 0 0 40px #3b82f6, 0 0 60px #3b82f6; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.6s ease-out 0.4s both;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.6s ease-out 0.6s both;
        }

        .animate-slide-up-delay-3 {
          animation: slide-up 0.6s ease-out 0.8s both;
        }

        .animate-slide-up-delay-4 {
          animation: slide-up 0.6s ease-out 1s both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}