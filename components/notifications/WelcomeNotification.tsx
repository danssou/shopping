'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface WelcomeNotificationProps {
  isVisible: boolean;
  itemCount: number;
  onClose: () => void;
}

export default function WelcomeNotification({ isVisible, itemCount, onClose }: WelcomeNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Start progress bar after initial animation
      setTimeout(() => setShowProgress(true), 300);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setShowProgress(false);
        setTimeout(onClose, 400); // Wait for exit animation
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-500 ease-out transform ${
      isAnimating 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className="relative overflow-hidden bg-white rounded-xl shadow-2xl border border-emerald-200/50 max-w-sm backdrop-blur-sm">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-emerald-500/10 to-emerald-600/10 animate-pulse"></div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 opacity-20 blur-sm animate-pulse"></div>
        
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {/* Animated icon container */}
              <div className="relative mr-4">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <ShoppingBagIcon className="w-6 h-6 text-white animate-bounce" />
                </div>
                {/* Floating dots around icon */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <h4 className="font-bold text-gray-900 text-base mr-2">Welcome back!</h4>
                  {/* Animated loading dots */}
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    {itemCount} item{itemCount !== 1 ? 's' : ''}
                  </span>
                  {' '}restored to your cart
                </p>
              </div>
            </div>
            
            {/* Enhanced close button */}
            <button
              onClick={() => {
                setIsAnimating(false);
                setShowProgress(false);
                setTimeout(onClose, 400);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-90"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Animated progress bar */}
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 rounded-full transition-all ease-linear ${
                showProgress ? 'duration-5000 w-0' : 'duration-0 w-full'
              }`}
              style={{ 
                background: 'linear-gradient(90deg, #10b981, #34d399, #059669)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
              }}
            ></div>
          </div>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}