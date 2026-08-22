import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  showLabel?: boolean;
}

export function StatusBadge({ status, className = '', showLabel = false }: StatusBadgeProps) {
  const s = status.toUpperCase().trim();

  let styles = 'bg-slate-100 text-slate-500 border-slate-200';
  let label = s;

  switch (s) {
    case 'P':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold';
      label = showLabel ? 'Present' : 'P';
      break;
    case 'H':
      styles = 'bg-teal-50 text-teal-700 border-teal-300 font-semibold';
      label = showLabel ? 'Holiday' : 'H';
      break;
    case 'L':
      styles = 'bg-amber-50 text-amber-700 border-amber-300 font-semibold';
      label = showLabel ? 'Leave' : 'L';
      break;
    case 'W':
      styles = 'bg-sky-50 text-sky-700 border-sky-300 font-semibold';
      label = showLabel ? 'WFH' : 'W';
      break;
    case 'E':
      styles = 'bg-purple-50 text-purple-700 border-purple-300 font-semibold';
      label = showLabel ? 'Exception' : 'E';
      break;
    case 'A':
      styles = 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
      label = showLabel ? 'Absent' : 'A';
      break;
    case 'WO':
      styles = 'bg-slate-100 text-slate-500 border-slate-200';
      label = showLabel ? 'Weekend Off' : 'WO';
      break;
    default:
      styles = 'bg-slate-50 text-slate-400 border-slate-200';
      label = '-';
      break;
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-xs rounded border tracking-wide transition-all ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
