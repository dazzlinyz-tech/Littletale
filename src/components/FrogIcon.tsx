import React from 'react';

interface FrogIconProps {
  className?: string;
  size?: number;
}

/**
 * Universally rendered cute Frog (개구리) vector graphic with cartoon outline.
 * Guarantees crisp, consistent display across all browsers and devices without emoji font dependencies.
 */
export const FrogIcon: React.FC<FrogIconProps> = ({
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
      <ellipse cx="24" cy="42" rx="15" ry="3.5" fill="#000000" opacity="0.15" />

      {/* Webbed Back Feet */}
      <ellipse cx="9" cy="36" rx="7" ry="3.5" fill="#16A34A" stroke="#0F172A" strokeWidth="1.6" />
      <ellipse cx="39" cy="36" rx="7" ry="3.5" fill="#16A34A" stroke="#0F172A" strokeWidth="1.6" />

      {/* Main Body */}
      <ellipse cx="24" cy="28" rx="17" ry="13" fill="#22C55E" stroke="#0F172A" strokeWidth="2.2" />

      {/* Light Lime Belly */}
      <ellipse cx="24" cy="30" rx="10" ry="8" fill="#BBF7D0" />

      {/* Front Hands */}
      <ellipse cx="17" cy="36" rx="3.5" ry="3" fill="#16A34A" stroke="#0F172A" strokeWidth="1.4" />
      <ellipse cx="31" cy="36" rx="3.5" ry="3" fill="#16A34A" stroke="#0F172A" strokeWidth="1.4" />

      {/* Big Cheerful Eyes (Left & Right) */}
      <circle cx="15" cy="16" r="7.5" fill="#22C55E" stroke="#0F172A" strokeWidth="2.2" />
      <circle cx="33" cy="16" r="7.5" fill="#22C55E" stroke="#0F172A" strokeWidth="2.2" />

      {/* Eye Whites */}
      <circle cx="15" cy="16" r="4.8" fill="#FFFFFF" />
      <circle cx="33" cy="16" r="4.8" fill="#FFFFFF" />

      {/* Dark Pupils */}
      <circle cx="15" cy="16" r="3.2" fill="#0F172A" />
      <circle cx="33" cy="16" r="3.2" fill="#0F172A" />

      {/* Eye Sparkles */}
      <circle cx="13.5" cy="14.5" r="1.3" fill="#FFFFFF" />
      <circle cx="31.5" cy="14.5" r="1.3" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <circle cx="13" cy="27" r="2.8" fill="#F472B6" opacity="0.75" />
      <circle cx="35" cy="27" r="2.8" fill="#F472B6" opacity="0.75" />

      {/* Happy Big Smile */}
      <path
        d="M 17 26 Q 24 33 31 26"
        stroke="#0F172A"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};
