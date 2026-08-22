import React from 'react';
import { CalendarExceptionDto } from '@/lib/types';
import { ShieldCheck, Plus, AlertCircle } from 'lucide-react';

interface ActiveExceptionsPanelProps {
  exceptions: CalendarExceptionDto[];
  onOpenAddException: () => void;
}

export function ActiveExceptionsPanel({ exceptions, onOpenAddException }: ActiveExceptionsPanelProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-4">
      {/* Header Row: Title & Active Count Left, Neutral + Add Exception Right */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-slate-900">Active HR Exceptions</h3>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {exceptions.length} Active
          </span>
        </div>

        <button
          onClick={onOpenAddException}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Exception</span>
        </button>
      </div>

      {/* Exceptions List */}
      <div className="mt-3 space-y-2">
        {exceptions.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-400">
            <AlertCircle className="w-5 h-5 text-slate-300 mx-auto mb-1" />
            <p>No active exceptions logged for this date range.</p>
          </div>
        ) : (
          exceptions.map((ex) => (
            <div
              key={ex.id}
              className="p-3 bg-purple-50/40 border border-purple-200/70 rounded-lg text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-semibold text-purple-950">
                <span>{ex.fromDate} &rarr; {ex.toDate}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-200/70 text-purple-800 px-1.5 py-0.5 rounded-full">
                  Approved
                </span>
              </div>
              <p className="text-purple-800 text-[11px] leading-snug">{ex.reason}</p>
              <div className="text-[10px] text-purple-500 pt-0.5 font-mono">By: {ex.createdBy}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
