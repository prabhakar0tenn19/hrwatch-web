import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WeekCardSummaryDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';

interface PastWeeksListProps {
  weeks: WeekCardSummaryDto[];
  expandedWeeks: Record<string, boolean>;
  onToggleExpand: (weekStartDate: string) => void;
}

export function PastWeeksList({ weeks, expandedWeeks, onToggleExpand }: PastWeeksListProps) {
  return (
    <div className="space-y-4">
      {weeks.map((week, idx) => {
        const isExpanded = !!expandedWeeks[week.weekStartDate];

        return (
          <div
            key={week.weekStartDate}
            className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 overflow-hidden transition-all duration-200"
          >
            {/* Card Header (Accordion trigger) */}
            <div
              onClick={() => onToggleExpand(week.weekStartDate)}
              className="py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none border-b border-slate-100"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">Week: {week.weekLabel}</span>
                  {idx === 0 && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full px-3 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
                  {week.violators.length} Violators
                </span>

                {week.criticalViolators > 0 && (
                  <span className="rounded-full px-3 py-0.5 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                    {week.criticalViolators} Critical
                  </span>
                )}

                <div className="text-slate-400 hover:text-slate-600 pl-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Card Body (Violators Table with Generous Right Scrollbar Spacing) */}
            {isExpanded && (
              <div className="overflow-x-hidden max-h-[480px] overflow-y-auto">
                {week.violators.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No violators match your search filter in this week.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 text-slate-500 text-[11px] uppercase font-semibold border-b border-slate-200 shadow-2xs">
                      <tr>
                        <th className="py-2.5 px-3.5 text-left">Employee</th>
                        <th className="py-2.5 px-3 text-left">Designation</th>
                        <th className="py-2.5 px-2.5 text-center">Required</th>
                        <th className="py-2.5 px-2.5 text-center">Present</th>
                        <th className="py-2.5 px-2.5 text-center">Shortfall</th>
                        <th className="py-2.5 pl-2 pr-6 text-center">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {week.violators.map((v) => (
                        <tr
                          key={v.employeeId}
                          className="odd:bg-white even:bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                        >
                          {/* Employee Initials & Info */}
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={v.fullName} size="sm" className="w-7 h-7 text-[11px]" />
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 text-xs leading-tight truncate">
                                  {v.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">{v.employeeCode}</div>
                              </div>
                            </div>
                          </td>

                          {/* Designation */}
                          <td className="py-2.5 px-3">
                            <div className="text-slate-700 font-medium text-xs leading-tight">{v.designation}</div>
                            <div className="text-[10px] text-slate-400">
                              {v.isDeployed ? 'Client Deployed' : 'On Bench'}
                            </div>
                          </td>

                          {/* Required Days (Center Aligned Plain Text) */}
                          <td className="py-2.5 px-2.5 text-center font-medium text-slate-600 text-xs tabular-nums">
                            {v.requiredDays}d
                          </td>

                          {/* Actual Present Days (Center Aligned Green Badge) */}
                          <td className="py-2.5 px-2.5 text-center tabular-nums">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {v.actualPresentDays}d
                            </span>
                          </td>

                          {/* Shortfall Days (Center Aligned Red Badge) */}
                          <td className="py-2.5 px-2.5 text-center tabular-nums">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              {v.shortfallDays}d
                            </span>
                          </td>

                          {/* Severity Badge (Center Aligned with Extra Right Padding) */}
                          <td className="py-2.5 pl-2 pr-6 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                v.severity === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : v.severity === 'Medium'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {v.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
