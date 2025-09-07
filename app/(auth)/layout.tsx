'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const carouselSlides = [
  {
    title: "Just Do It",
    description: "Join millions of athletes and fitness enthusiasts who trust CODALWARE for their performance needs.",
    lottieAnimation: "/animations/fitness.json",
    isActive: true
  },
  {
    title: "Unleash Your Potential",
    description: "Discover cutting-edge gear designed to push your limits and elevate your performance to new heights.",
    lottieAnimation: "/animations/performance.json",
    isActive: false
  },
  {
    title: "Innovation Meets Performance",
    description: "Experience the perfect blend of technology and style with CODALWARE's premium athletic collection.",
    lottieAnimation: "/animations/innovation.json",
    isActive: false
  }
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 9000); // Change slide every 9 seconds

    return () => clearInterval(interval);
  }, []);

  // Load animation data when slide changes
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(carouselSlides[currentSlide].lottieAnimation);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.log('Failed to load animation:', error);
        setAnimationData(null);
      }
    };
    
    loadAnimation();
  }, [currentSlide]);

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
            {/* Lottie Animation Container */}
            <div className="mb-8 flex items-center justify-center">
              {/* Lottie Animation */}
              <div className="w-32 h-32">
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
            
            <h1 
              className="text-white font-bold mb-6 transition-all duration-500 ease-in-out"
              style={{ 
                fontSize: 'var(--text-heading-2)', 
                lineHeight: 'var(--text-heading-2--line-height)',
                fontWeight: 'var(--text-heading-2--font-weight)'
              }}
            >
              {carouselSlides[currentSlide].title}
            </h1>
            <p 
              className="text-gray-300 mb-8 transition-all duration-500 ease-in-out"
              style={{ 
                fontSize: 'var(--text-lead)', 
                lineHeight: 'var(--text-lead--line-height)',
                fontWeight: 'var(--text-lead--font-weight)'
              }}
            >
              {carouselSlides[currentSlide].description}
            </p>
            
            {/* Dots indicator */}
            <div className="flex space-x-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white' : 'bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-gray-400 text-sm">
            © 2025 CODALWARE. All rights reserved.
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
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
