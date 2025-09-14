'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generateInitials, generateProfileColor } from '@/utils/profile';
import { CameraIcon, PencilIcon } from '@heroicons/react/24/outline';

interface ProfileAvatarProps {
  user?: {
    name?: string;
    image?: string;
    email?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  editable?: boolean;
  onImageChange?: (file: File) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl',
  xxl: 'w-32 h-32 text-3xl',
};

const editButtonSizes = {
  sm: 'w-5 h-5 p-1',
  md: 'w-6 h-6 p-1',
  lg: 'w-8 h-8 p-1.5',
  xl: 'w-10 h-10 p-2',
  xxl: 'w-12 h-12 p-2.5',
};

export default function ProfileAvatar({ 
  user, 
  size = 'md', 
  editable = false, 
  onImageChange,
  className = '' 
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initials = generateInitials(displayName);
  const backgroundColor = generateProfileColor(displayName);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className} group`}>
      {/* Outer ring with gradient border */}
      <div className="relative w-full h-full rounded-full p-0.5 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-lg">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900">
          {user?.image && !imageError ? (
            <Image
              src={user.image}
              alt={displayName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center font-bold text-white relative overflow-hidden`}
              style={{ 
                background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)` 
              }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              
              {/* Initials */}
              <span className="relative z-10 font-extrabold tracking-wide drop-shadow-sm">
                {initials}
              </span>
            </div>
          )}
          
          {/* Overlay for hover effect */}
          {editable && (
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <div className={`${editButtonSizes[size]} bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                  <label className="cursor-pointer flex items-center justify-center w-full h-full">
                    <CameraIcon className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'} text-slate-700`} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status indicator (online/offline) */}
      {size !== 'sm' && (
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 min-w-[8px] min-h-[8px] bg-green-500 rounded-full border-2 border-slate-900 shadow-sm"></div>
      )}
      
      {/* Edit badge for non-hover state when editable */}
      {editable && size !== 'sm' && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transform -translate-y-1 translate-x-1">
            <PencilIcon className="w-3 h-3 text-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}
