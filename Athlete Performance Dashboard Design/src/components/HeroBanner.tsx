import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  height?: string;
  overlay?: boolean;
}

export function HeroBanner({ 
  image, 
  title, 
  subtitle, 
  children, 
  height = 'h-96',
  overlay = true 
}: HeroBannerProps) {
  return (
    <div className={`relative ${height} rounded-2xl overflow-hidden`}>
      <ImageWithFallback
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      )}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <h1 className="text-white mb-2">{title}</h1>
        {subtitle && <p className="text-gray-300 text-xl mb-4">{subtitle}</p>}
        {children && <div className="flex gap-4">{children}</div>}
      </div>
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="h-96 rounded-2xl bg-[#141414] animate-pulse">
      <div className="h-full flex flex-col justify-end p-8">
        <div className="h-12 w-3/4 bg-[#252525] rounded mb-4" />
        <div className="h-6 w-1/2 bg-[#252525] rounded" />
      </div>
    </div>
  );
}
