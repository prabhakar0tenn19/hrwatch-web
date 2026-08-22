import React from 'react';

export function SkeletonKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 bg-slate-200 rounded"></div>
            <div className="h-7 w-7 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-7 w-16 bg-slate-200 rounded"></div>
          <div className="h-3 w-24 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonAccordionList() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-40 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
