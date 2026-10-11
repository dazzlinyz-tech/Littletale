import React from 'react';

interface MushroomIconProps {
  className?: string;
  size?: number;
}

/**
 * Universally rendered cute red forest mushroom graphic.
 * Bright red cap with white polka dots and green grass base.
 * Guaranteed to display reliably across all devices.
 */
export const MushroomIcon: React.FC<MushroomIconProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      viewBox="0 0 54 54"
      width={size}
      height={size}
      className={`inline-block select-none shrink-0 ${className}`}
      fill="none"
    >
      {/* Background Badge */}
      <rect x="2" y="2" width="50" height="50" rx="14" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="2" />

      {/* Grass mound */}
      <path d="M 6 44 Q 27 38 48 44 L 48 50 L 6 50 Z" fill="#4ADE80" />
      <circle cx="12" cy="45" r="2.5" fill="#FDE047" />
      <circle cx="42" cy="46" r="2" fill="#FDE047" />

      {/* Mushroom Stalk */}
      <path
        d="M 21 28 Q 20 44 19 46 Q 27 48 35 46 Q 34 44 33 28 Z"
        fill="#FFFBEB"
        stroke="#78350F"
        strokeWidth="1.5"
      />
      {/* Stalk gills line */}
      <line x1="21" y1="28" x2="33" y2="28" stroke="#FDE68A" strokeWidth="2" />

      {/* Mushroom Cap (Vibrant Red Toadstool) */}
      <path
        d="M 9 28 Q 7 12 27 9 Q 47 12 45 28 Q 27 30 9 28 Z"
        fill="#EF4444"
        stroke="#991B1B"
        strokeWidth="1.8"
      />

      {/* White Polka Dots */}
      <ellipse cx="27" cy="16" rx="4.5" ry="3.5" fill="#FFFFFF" />
      <ellipse cx="17" cy="22" rx="3.5" ry="3" fill="#FFFFFF" />
      <ellipse cx="37" cy="22" rx="3.5" ry="3" fill="#FFFFFF" />
      <circle cx="27" cy="25" r="2.5" fill="#FFFFFF" />
    </svg>
  );
};
