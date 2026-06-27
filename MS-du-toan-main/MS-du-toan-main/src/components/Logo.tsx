import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20,80 L20,30 L50,60 L80,30 L80,80 L90,80 L90,20 L50,55 L10,20 L10,80 Z" />
    <path d="M10,85 L90,85 L90,95 L10,95 Z" />
  </svg>
);
