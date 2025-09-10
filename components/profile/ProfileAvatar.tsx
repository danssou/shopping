'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generateInitials, generateProfileColor } from '@/utils/profile';
import { CameraIcon } from '@heroicons/react/24/outline';

interface ProfileAvatarProps {
  user?: {
    name?: string;
    image?: string;
    email?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onImageChange?: (file: File) => void;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl',
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
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        {user?.image && !imageError ? (
          <Image
            src={user.image}
            alt={displayName}
            fill
            className="rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full rounded-full flex items-center justify-center font-semibold text-white ${sizeClasses[size]}`}
            style={{ backgroundColor }}
          >
            {initials}
          </div>
        )}
        
        {editable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <label className="cursor-pointer bg-black/50 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <CameraIcon className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
