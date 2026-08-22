import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message = 'Loading records...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`p-12 text-center bg-white border border-slate-200/90 rounded-xl shadow-2xs ${className}`}>
      <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}
