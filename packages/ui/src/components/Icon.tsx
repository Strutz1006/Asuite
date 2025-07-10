import React from 'react';

export interface IconProps {
  path: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ path, className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);