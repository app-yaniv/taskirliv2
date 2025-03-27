'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  maxRetries?: number;
  onError?: () => void;
}

export default function SafeImage({ 
  src, 
  alt, 
  className = '', 
  fallbackText = 'תמונה לא זמינה', 
  maxRetries = 2,
  onError
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [retries, setRetries] = useState(0);
  const [failed, setFailed] = useState(false);

  // Reset state if src changes
  useEffect(() => {
    setImgSrc(src);
    setRetries(0);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    console.error(`Image failed to load: ${imgSrc}`);
    
    // Try to fix common issues with the URL
    if (retries < maxRetries) {
      let fixedSrc = imgSrc;
      
      // Try different encoding techniques
      if (retries === 0 && imgSrc.includes('%')) {
        try {
          const parts = imgSrc.split('/public/');
          if (parts.length === 2) {
            const baseUrl = parts[0] + '/public/';
            const encodedPath = parts[1];
            
            // Try URL encoded path
            fixedSrc = baseUrl + encodeURIComponent(decodeURIComponent(encodedPath));
            console.log('Retry with fixed URL encoding:', fixedSrc);
          }
        } catch (e) {
          console.error('Error fixing URL:', e);
        }
      } 
      // Second retry: try a cache-busting approach 
      else if (retries === 1) {
        fixedSrc = `${imgSrc}${imgSrc.includes('?') ? '&' : '?'}t=${Date.now()}`;
        console.log('Retry with cache busting:', fixedSrc);
      }
      
      setImgSrc(fixedSrc);
      setRetries(prev => prev + 1);
    } else {
      // Give up after max retries
      setFailed(true);
      // Call the onError callback if provided
      if (onError) {
        onError();
      }
    }
  };

  if (failed) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
} 