import React from 'react';
import { FenceIcon } from './FenceIcon';
import { MushroomIcon } from './MushroomIcon';
import { BluebirdIcon } from './BluebirdIcon';

interface ChoiceIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const ChoiceIcon: React.FC<ChoiceIconProps> = ({
  icon,
  size = 40,
  className = '',
}) => {
  if (icon === 'fence' || icon === '🪵') {
    return <FenceIcon size={size} className={className} />;
  }

  if (icon === 'mushroom' || icon === '🍄') {
    return <MushroomIcon size={size} className={className} />;
  }

  if (icon === 'bluebird' || icon === 'bird' || icon === '🐦') {
    return <BluebirdIcon size={size} className={className} />;
  }

  return (
    <span
      className={`text-3xl sm:text-4xl shrink-0 filter drop-shadow-xs leading-none select-none inline-flex items-center justify-center ${className}`}
      style={{ minWidth: size, minHeight: size }}
    >
      {icon}
    </span>
  );
};
