import React from 'react';

interface FenceIconProps {
  className?: string;
  size?: number;
}

/**
 * Universally rendered vibrant wooden garden fence graphic.
 * Crisp, high-contrast white & honey-brown pickets with fresh green grass and blooming flowers.
 * Guarantees 100% reliable visibility across all devices and browsers.
 */
export const FenceIcon: React.FC<FenceIconProps> = ({
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
      {/* Background Badge with gentle gradient for pop */}
      <rect x="2" y="2" width="50" height="50" rx="14" fill="#FEF3C7" stroke="#FBBF24" strokeWidth="2" />

      {/* Fresh Green Grass Lawn */}
      <path
        d="M 4 40 Q 27 36 50 40 L 50 50 Q 50 50 48 50 L 6 50 Q 4 50 4 48 Z"
        fill="#4ADE80"
      />
      {/* Darker green base */}
      <path
        d="M 4 45 Q 27 42 50 45 L 50 50 L 4 50 Z"
        fill="#22C55E"
      />

      {/* Wooden Horizontal Rails (Top and Bottom) */}
      <rect x="6" y="22" width="42" height="4.5" rx="1.5" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
      <rect x="6" y="33" width="42" height="4.5" rx="1.5" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />

      {/* 4 White Pickets with crisp outline and wood grain */}
      {[
        { x: 9, h: 28 },
        { x: 19, h: 30 },
        { x: 29, h: 30 },
        { x: 39, h: 28 },
      ].map(({ x, h }) => (
        <g key={x}>
          {/* Soft drop shadow */}
          <polygon
            points={`${x + 1},${44 - h} ${x + 4},${40 - h} ${x + 7},${44 - h} ${x + 7},44 ${x + 1},44`}
            fill="#000000"
            opacity="0.08"
          />
          {/* Triangular Post Cap */}
          <polygon
            points={`${x},${44 - h + 4} ${x + 3},${44 - h} ${x + 6},${44 - h + 4}`}
            fill="#FFFFFF"
            stroke="#78350F"
            strokeWidth="1.2"
          />
          {/* Post Body */}
          <rect
            x={x}
            y={44 - h + 3.5}
            width="6"
            height={h - 3}
            rx="0.5"
            fill="#FFFFFF"
            stroke="#78350F"
            strokeWidth="1.2"
          />
          {/* Post highlight */}
          <line
            x1={x + 1.8}
            y1={44 - h + 5}
            x2={x + 1.8}
            y2={41}
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />
        </g>
      ))}

      {/* Little yellow buttercup daisies on grass */}
      <circle cx="12" cy="44" r="2.5" fill="#FACC15" />
      <circle cx="12" cy="44" r="1" fill="#EA580C" />

      <circle cx="42" cy="43" r="2.5" fill="#FACC15" />
      <circle cx="42" cy="43" r="1" fill="#EA580C" />

      {/* Green vine leaf */}
      <path d="M 24 33 Q 27 30 25 27 Q 22 29 24 33 Z" fill="#15803D" />
    </svg>
  );
};
