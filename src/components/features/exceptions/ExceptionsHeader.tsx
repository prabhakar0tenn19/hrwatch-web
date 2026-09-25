import React from 'react';
import { AlertCircle, Plus, ShieldCheck, ShieldAlert, History } from 'lucide-react';
import { EmployeeExceptionDto } from '@/lib/types';

interface ExceptionsHeaderProps {
  exceptions: EmployeeExceptionDto[];
  onOpenCreate: () => void;
}

export function ExceptionsHeader({ exceptions, onOpenCreate }: ExceptionsHeaderProps) {
  const totalCount = exceptions.length;
  const activeCount = exceptions.filter((e) => e.isActive).length;
  const revokedCount = totalCount - activeCount;

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header Title & Top Action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <AlertCircle className="w-5 h-5 text-purple-600 shrink-0" />
          <h1 className="text-lg sm:text-2xl font-semibold text-slate-900 tracking-tight truncate">
            Attendance Exceptions
          </h1>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-xs shadow-purple-900/10 focus:ring-2 focus:ring-purple-200 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Exception</span>
        </button>
      </div>

      {/* MOBILE COMPACT STATS STRIP (< 640px) */}
      <div className="grid sm:hidden grid-cols-3 gap-2">
        <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active</span>
          <span className="text-xl font-bold text-emerald-700 leading-tight mt-0.5">{activeCount}</span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Effective</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Total</span>
          <span className="text-xl font-bold text-slate-900 leading-tight mt-0.5">{totalCount}</span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Logged</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Revoked</span>
          <span className="text-xl font-bold text-slate-600 leading-tight mt-0.5">{revokedCount}</span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Archived</span>
        </div>
      </div>

      {/* TABLET / DESKTOP KPI STATS STRIP (>= 640px) */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {/* Card 1: Active Overrides */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Active Overrides
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-emerald-700 leading-none">{activeCount}</div>
            <div className="text-xs text-emerald-600 font-normal mt-1.5">Currently Effective</div>
          </div>
        </div>

        {/* Card 2: Total Exceptions Logged */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Exceptions Logged
            </span>
            <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <History className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-slate-900 leading-none">{totalCount}</div>
            <div className="text-xs text-slate-500 font-normal mt-1.5">Historical Records</div>
          </div>
        </div>

        {/* Card 3: Revoked / Expired */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Revoked / Expired
            </span>
            <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-slate-600 leading-none">{revokedCount}</div>
            <div className="text-xs text-slate-500 font-normal mt-1.5">Archived</div>
          </div>
        </div>
      </div>
    </div>
  );
}
