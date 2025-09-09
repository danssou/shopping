'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { CAROUSEL_SLIDES, CAROUSEL_CONFIG } from "@/constants";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [isAnimationHovered, setIsAnimationHovered] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
      }, CAROUSEL_CONFIG.slideInterval);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start interval only if not paused
    if (!isAnimationPaused) {
      startInterval();
    }

    return () => stopInterval();
  }, [isAnimationPaused]);

  // Load animation data when slide changes with fade effect
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Add a small delay for smooth transition
        setAnimationData(null);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await fetch(CAROUSEL_SLIDES[currentSlide].lottieAnimation);
        const data = await response.json();
        setAnimationData(data);
        
        // Reset animation on slide change
        if (lottieRef.current) {
          lottieRef.current.goToAndPlay(0, true);
        }
      } catch (error) {
        console.log('Failed to load animation:', error);
        setAnimationData(null);
      }
    };
    
    loadAnimation();
  }, [currentSlide]);

  // Handle mouse interactions for enhanced UX
  const handleAnimationMouseEnter = () => {
    setIsAnimationHovered(true);
    if (CAROUSEL_CONFIG.enableHoverPause) {
      setIsAnimationPaused(true);
      if (lottieRef.current) {
        lottieRef.current.pause();
      }
    }
  };

  const handleAnimationMouseLeave = () => {
    setIsAnimationHovered(false);
    if (CAROUSEL_CONFIG.enableHoverPause) {
      setIsAnimationPaused(false);
      if (lottieRef.current) {
        lottieRef.current.play();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:flex-1 bg-slate-900 relative overflow-hidden">
        <div className="flex flex-col justify-between p-12 text-white z-10 relative">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="CODALWARE"
              width={40}
              height={16}
              className="brightness-0 invert"
              priority
            />
            <span className="text-xl font-semibold">CODALWARE</span>
          </div>
          
          {/* Carousel Content */}
          <div className="max-w-md">
            {/* Incredible Lottie Animation Container */}
            <div className="mb-8 flex items-center justify-center relative">              
              {/* Main Animation Container with Glow Effect */}
              <div 
                className={`relative w-40 h-40 transition-all duration-700 ease-out ${
                  isAnimationHovered ? 'scale-110' : 'scale-100'
                }`}
                onMouseEnter={handleAnimationMouseEnter}
                onMouseLeave={handleAnimationMouseLeave}
                style={{
                  filter: `drop-shadow(0 0 ${CAROUSEL_CONFIG.glowIntensity * 30}px rgba(59, 130, 246, 0.5))`,
                }}
              >
                {/* Rotating Border Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-slate-900"></div>
                </div>
                
                {/* Inner Glow Ring */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse"></div>
                
                {/* Lottie Animation */}
                <div className="absolute inset-4 flex items-center justify-center">
                  {animationData ? (
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={animationData}
                      loop={true}
                      autoplay={true}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        filter: 'brightness(1.1) saturate(1.2)',
                      }}
                      onComplete={() => {
                        // Add completion effects
                        if (lottieRef.current) {
                          lottieRef.current.goToAndPlay(0, true);
                        }
                      }}
                      onDOMLoaded={() => {
                        // Set custom speed when animation loads
                        if (lottieRef.current) {
                          lottieRef.current.setSpeed(CAROUSEL_CONFIG.lottieSpeed);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-full animate-pulse flex items-center justify-center relative overflow-hidden">
                      {/* Loading shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full animate-bounce"></div>
                    </div>
                  )}
                </div>
                
                {/* Pulsing Outer Ring */}
                <div className="absolute -inset-4 rounded-full border border-blue-500/20 animate-ping"></div>
                <div className="absolute -inset-6 rounded-full border border-purple-500/10 animate-ping animation-delay-1000"></div>
              </div>
            </div>
            
            <h1 
              key={`title-${currentSlide}`}
              className="text-white font-bold mb-6 animate-text-slide-in"
              style={{ 
                fontSize: 'var(--text-heading-2)', 
                lineHeight: 'var(--text-heading-2--line-height)',
                fontWeight: 'var(--text-heading-2--font-weight)',
                textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {CAROUSEL_SLIDES[currentSlide].title}
            </h1>
            <p 
              key={`description-${currentSlide}`}
              className="text-gray-300 mb-8 animate-text-slide-in"
              style={{ 
                fontSize: 'var(--text-lead)', 
                lineHeight: 'var(--text-lead--line-height)',
                fontWeight: 'var(--text-lead--font-weight)',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                animationDelay: '0.2s',
              }}
            >
              {CAROUSEL_SLIDES[currentSlide].description}
            </p>
            
            {/* Enhanced Dots indicator */}
            <div className="flex space-x-3 items-center justify-center">
              {CAROUSEL_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative transition-all duration-500 ease-out transform ${
                    index === currentSlide 
                      ? 'scale-125' 
                      : 'scale-100 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* Background glow */}
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md animate-glow-pulse"></div>
                  )}
                  
                  {/* Main dot */}
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-500 relative z-10 ${
                      index === currentSlide
                        ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg'
                        : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                  >
                    {/* Inner highlight */}
                    {index === currentSlide && (
                      <div className="absolute inset-0.5 bg-white/20 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Progress ring for active slide */}
                  {index === currentSlide && (
                    <div className="absolute inset-0 rounded-full border-2 border-blue-400/50">
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-blue-400 border-l-transparent animate-spin-slow"
                        style={{ animationDuration: `${CAROUSEL_CONFIG.slideInterval}ms` }}
                      ></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-gray-400 text-sm">
            © 2025 CODALWARE. All rights reserved.
          </div>
        </div>
        
        {/* Enhanced Background with Cosmic Effects */}
        <div className="absolute inset-0 bg-cosmic-gradient opacity-95"></div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-transparent to-slate-800/60"></div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="flex-1 lg:flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="w-full max-w-md space-y-8 bg-slate-700 rounded-2xl p-8 shadow-xl border border-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
}
