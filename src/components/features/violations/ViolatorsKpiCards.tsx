import React from 'react';
import { Users, ShieldAlert, Calendar as CalendarIcon, FileCheck } from 'lucide-react';

interface ViolatorsKpiCardsProps {
  currentWeekViolatorsCount: number;
  criticalViolationsCount: number;
  totalWeeksEvaluated: number;
}

export function ViolatorsKpiCards({
  currentWeekViolatorsCount,
  criticalViolationsCount,
  totalWeeksEvaluated,
}: ViolatorsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Current Week Violators */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Current Week Violators
          </span>
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-3xl font-semibold text-slate-900 leading-none">
            {currentWeekViolatorsCount}
          </div>
          <div className="text-xs text-slate-500 font-normal mt-1.5">
            Out of 265 total employees
          </div>
        </div>
      </div>

      {/* 2. Critical Shortfall */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Critical Shortfall
          </span>
          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-3xl font-semibold text-slate-900 leading-none">
            {criticalViolationsCount}
          </div>
          <div className="text-xs text-rose-600 font-medium mt-1.5">
            Shortfall &ge; 3 days
          </div>
        </div>
      </div>

      {/* 3. Historical Weeks Evaluated */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Past Weeks Evaluated
          </span>
          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="text-3xl font-semibold text-slate-900 leading-none">
            {totalWeeksEvaluated}
          </div>
          <div className="text-xs text-slate-500 font-normal mt-1.5">
            Default dashboard range
          </div>
        </div>
      </div>

      {/* 4. Policy Quota Chips */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Evaluation Policy
          </span>
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
              SDE: 5d
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
              Mgr: 3d
            </span>
          </div>
          <div className="text-xs text-slate-500 font-normal mt-1.5">
            Standard hybrid quota rules
          </div>
        </div>
      </div>
    </div>
  );
}
