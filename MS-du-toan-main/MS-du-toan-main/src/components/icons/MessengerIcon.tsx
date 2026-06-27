import React from 'react';

export const MessengerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3C6.48 3 2 7.03 2 12c0 2.83 1.45 5.37 3.73 7.04V23l3.41-1.87a10.02 10.02 0 0 0 2.86.42c5.52 0 10-4.03 10-9s-4.48-9-10-9Zm.92 12.02-2.38-2.54-4.66 2.54 5.12-5.46 2.45 2.54 4.58-2.54-5.11 5.46Z" />
  </svg>
);
