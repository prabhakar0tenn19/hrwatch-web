import React from 'react';
import { TrendingDown } from 'lucide-react';
import { TopShortfallEmployeeDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';

interface TopShortfallWidgetProps {
  topEmployees: TopShortfallEmployeeDto[];
  weeksCount: number;
}

export function TopShortfallWidget({ topEmployees, weeksCount }: TopShortfallWidgetProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-rose-500" />
          <h3 className="font-semibold text-slate-900 text-sm">Top 5 by Shortfall</h3>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
          Past {weeksCount} Weeks
        </span>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {topEmployees && topEmployees.length > 0 ? (
          topEmployees.map((emp, index) => (
            <div key={emp.employeeId} className="py-2.5 flex items-center justify-between first:pt-1 last:pb-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-400 w-3">{index + 1}.</span>
                <Avatar name={emp.fullName} size="sm" className="w-7 h-7 text-[11px]" />
                <div>
                  <div className="font-semibold text-slate-900 text-xs leading-tight">{emp.fullName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{emp.designation}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {emp.totalShortfallDays}d shortfall
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {emp.weeksWithViolations} {emp.weeksWithViolations === 1 ? 'Week' : 'Weeks'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No shortfall accumulated across evaluated weeks.
          </div>
        )}
      </div>
    </div>
  );
}
