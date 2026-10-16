import React from 'react';

interface BasketIconProps {
  className?: string;
  size?: number;
}

export const BasketIcon: React.FC<BasketIconProps> = ({
  className = '',
  size = 36,
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`inline-block select-none shrink-0 ${className}`}
      fill="none"
    >
      {/* Shadow */}
      <ellipse cx="24" cy="42" rx="16" ry="3.5" fill="#000000" opacity="0.14" />

      {/* Basket Handle */}
      <path
        d="M 12 25 C 12 8, 36 8, 36 25"
        stroke="#78350F"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 13 25 C 13 10, 35 10, 35 25"
        stroke="#D97706"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cozy Blanket peeking out */}
      <ellipse cx="24" cy="24" rx="14" ry="7" fill="#F472B6" stroke="#9D174D" strokeWidth="1.5" />
      <circle cx="20" cy="23" r="2.5" fill="#FCE7F3" />
      <circle cx="28" cy="24" r="2.5" fill="#FCE7F3" />

      {/* Basket Body */}
      <path
        d="M 9 24 L 13 40 Q 24 43 35 40 L 39 24 Z"
        fill="#B45309"
        stroke="#451A03"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Woven Texture */}
      <path d="M 10 28 Q 24 31 38 28" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <path d="M 11 34 Q 24 37 37 34" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <line x1="18" y1="24" x2="16" y2="40" stroke="#78350F" strokeWidth="1.2" />
      <line x1="24" y1="25" x2="24" y2="41" stroke="#78350F" strokeWidth="1.2" />
      <line x1="30" y1="24" x2="32" y2="40" stroke="#78350F" strokeWidth="1.2" />

      {/* Rim */}
      <ellipse cx="24" cy="24" rx="15" ry="3.5" fill="#D97706" stroke="#451A03" strokeWidth="2" />
    </svg>
  );
};
