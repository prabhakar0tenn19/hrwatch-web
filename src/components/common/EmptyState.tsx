import React from 'react';
import { CheckCircle2, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = CheckCircle2,
  title,
  description,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`p-12 text-center bg-white border border-slate-200/90 rounded-xl shadow-2xs ${className}`}>
      <Icon className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{description}</p>
    </div>
  );
}
