import React from 'react';

interface BluebirdIconProps {
  className?: string;
  size?: number;
}

/**
 * Universally rendered cute Bluebird (파랑새) vector graphic with distinct black cartoon outline (#1E293B / #0F172A).
 * Eliminates platform emoji differences (e.g. Apple rendering 🐦 as a red cardinal).
 */
export const BluebirdIcon: React.FC<BluebirdIconProps> = ({
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
      {/* Soft shadow */}
      <ellipse cx="24" cy="43" rx="14" ry="3" fill="#000000" opacity="0.14" />

      {/* Tail feathers with black stroke */}
      <path
        d="M 10 28 L 2 35 Q 4 29 8 26 Z"
        fill="#0284C7"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M 12 30 L 4 41 Q 7 33 11 28 Z"
        fill="#38BDF8"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Main Body (Sky & Royal Blue) with bold black outline */}
      <ellipse
        cx="23"
        cy="25"
        rx="15"
        ry="13"
        fill="#0284C7"
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Soft Cyan/White Chest & Belly */}
      <path
        d="M 18 20 Q 32 20 34 30 Q 28 37 18 36 Q 14 30 18 20 Z"
        fill="#BAE6FD"
        stroke="#0284C7"
        strokeWidth="1"
      />

      {/* Head with black outline */}
      <circle
        cx="32"
        cy="17"
        r="11"
        fill="#38BDF8"
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Crown feather fluff */}
      <path
        d="M 28 7 Q 32 4 34 8 Q 30 10 28 7 Z"
        fill="#0284C7"
        stroke="#0F172A"
        strokeWidth="1.4"
      />

      {/* Wing with crisp black outline */}
      <path
        d="M 14 22 Q 22 19 28 27 Q 20 36 12 31 Q 11 25 14 22 Z"
        fill="#0369A1"
        stroke="#0F172A"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M 16 24 Q 22 22 25 28 Q 20 34 14 30 Z"
        fill="#7DD3FC"
        opacity="0.85"
      />

      {/* Cute pink cheek blush */}
      <circle cx="30" cy="21" r="2.2" fill="#F472B6" opacity="0.65" />

      {/* Big Friendly Sparkly Eye with outline */}
      <circle cx="35" cy="15" r="3.2" fill="#0F172A" />
      <circle cx="36.2" cy="13.8" r="1.2" fill="#FFFFFF" />
      <circle cx="33.8" cy="16.2" r="0.6" fill="#FFFFFF" />

      {/* Golden Yellow Beak with outline */}
      <polygon
        points="41,15 48,18 41,22"
        fill="#FACC15"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Tiny Orange Feet with outline */}
      <line x1="20" y1="37" x2="19" y2="43" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="20" y1="37" x2="19" y2="43" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="25" y1="37" x2="25" y2="43" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="25" y1="37" x2="25" y2="43" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};
