import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Official CG Infinity Brand Logo */}
      <img
        src="/cg-infinity-logo.png"
        alt="CG infinity"
        className="h-7 w-auto object-contain"
      />
    </div>
  );
}
