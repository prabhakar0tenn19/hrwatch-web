'use client';

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
              className="py-3 px-3.5 sm:px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none border-b border-slate-100 gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                    Week: {week.weekLabel}
                  </span>
                  {idx === 0 && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 shrink-0">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="rounded-full px-2 sm:px-3 py-0.5 text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-700 whitespace-nowrap">
                  {week.violators.length} <span className="hidden xs:inline">Violators</span>
                </span>

                {week.criticalViolators > 0 && (
                  <span className="rounded-full px-2 sm:px-3 py-0.5 text-[11px] sm:text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                    {week.criticalViolators} <span className="hidden xs:inline">Critical</span>
                  </span>
                )}

                <div className="text-slate-400 hover:text-slate-600 pl-0.5 sm:pl-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* Card Body */}
            {isExpanded && (
              <div>
                {week.violators.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No violators match your search filter in this week.
                  </div>
                ) : (
                  <>
                    {/* 1. Mobile Card List (< sm: 640px) */}
                    <div className="sm:hidden divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                      {week.violators.map((v) => (
                        <div key={v.employeeId} className="p-3 hover:bg-slate-50/60 transition-colors space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar name={v.fullName} size="sm" className="w-8 h-8 text-xs shrink-0" />
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 text-xs truncate">
                                  {v.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {v.employeeCode} &bull; {v.designation}
                                </div>
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider shrink-0 ${
                                v.severity === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : v.severity === 'Medium'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {v.severity}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-slate-50/70 p-2 rounded-lg text-center text-xs">
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Required</div>
                              <div className="font-semibold text-slate-700 tabular-nums">{v.requiredDays}d</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Present</div>
                              <div className="font-semibold text-emerald-700 tabular-nums">{v.actualPresentDays}d</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Shortfall</div>
                              <div className="font-bold text-rose-600 tabular-nums">{v.shortfallDays}d</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 2. Desktop Full Table (>= sm: 640px) */}
                    <div className="hidden sm:block overflow-x-auto max-h-[480px] overflow-y-auto">
                      <table className="w-full text-left text-xs min-w-[560px]">
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

                              {/* Required Days */}
                              <td className="py-2.5 px-2.5 text-center font-medium text-slate-600 text-xs tabular-nums">
                                {v.requiredDays}d
                              </td>

                              {/* Actual Present Days */}
                              <td className="py-2.5 px-2.5 text-center tabular-nums">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {v.actualPresentDays}d
                                </span>
                              </td>

                              {/* Shortfall Days */}
                              <td className="py-2.5 px-2.5 text-center tabular-nums">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  {v.shortfallDays}d
                                </span>
                              </td>

                              {/* Severity Badge */}
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
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
