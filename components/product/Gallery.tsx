'use client';

import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface GalleryProps {
  images: string[];
  onOpenModal?: () => void;
  className?: string;
}

export default function Gallery({ images = [], onOpenModal, className = '' }: GalleryProps) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative group">
        <div className="aspect-[4/3] sm:aspect-square bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {images[index] && (
            <Image src={images[index]} alt={`product-${index}`} fill className="object-cover w-full h-full" />
          )}

          {images.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-700/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeftIcon className="w-5 h-5 text-slate-200" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-700/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRightIcon className="w-5 h-5 text-slate-200" />
              </button>
            </>
          )}

          <button onClick={onOpenModal} className="absolute top-3 right-3 w-9 h-9 bg-slate-700/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <PhotoIcon className="w-4 h-4 text-slate-200" />
          </button>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 mt-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${i === index ? 'border-yellow-500 shadow-lg scale-105' : 'border-slate-700 hover:border-slate-600'}`}>
                <Image src={img} alt={`thumb-${i}`} width={80} height={80} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
