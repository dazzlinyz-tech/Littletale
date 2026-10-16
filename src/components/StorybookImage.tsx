import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, ImageOff } from 'lucide-react';

interface StorybookImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackTitle?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const StorybookImage: React.FC<StorybookImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackIcon = '🐰',
  fallbackTitle = 'Where is Bunny?',
  onClick,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Reset states when src or retryKey changes
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [src, retryKey]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(false);
    setLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* 1. Loading Shimmer Skeleton */}
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-tr from-amber-100/90 via-orange-50/90 to-amber-100/90 backdrop-blur-xs animate-pulse">
          <div className="w-12 h-12 rounded-full bg-white/90 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs mb-1.5 animate-bounce">
            {fallbackIcon}
          </div>
          <span className="text-[11px] font-black text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Loading story illustration...</span>
          </span>
        </div>
      )}

      {/* 2. Error Fallback Card with Retry Button */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-rose-50 via-amber-50 to-orange-50 border-2 border-dashed border-amber-300 text-center select-none">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs mb-2">
            <ImageOff className="w-6 h-6 text-amber-700" />
          </div>
          <p className="font-heading font-black text-xs sm:text-sm text-amber-950 mb-0.5">
            {fallbackTitle}
          </p>
          <p className="text-[10px] text-amber-800 font-bold mb-3 max-w-[200px]">
            Illustration failed to load. Please check network and retry!
          </p>
          <button
            onClick={handleRetry}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Image 🔄</span>
          </button>
        </div>
      )}

      {/* 3. Actual Image Tag */}
      {!error && (
        <img
          key={`${src}-${retryKey}`}
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={`${className} transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
};
