'use client';

import React, { useState } from 'react';
import { DailyAttendanceStatusDto } from '@/lib/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Clock, LayoutGrid, ListFilter } from 'lucide-react';

interface CalendarGridProps {
  days: DailyAttendanceStatusDto[];
  loading: boolean;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarGrid({ days, loading }: CalendarGridProps) {
  // Mobile users often love List/Agenda view for easy one-handed scrolling
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-12 text-center text-xs text-slate-400 animate-pulse">
        Loading attendance history...
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-12 text-center text-xs text-slate-400">
        No attendance records found for this date range.
      </div>
    );
  }

  // Calculate day-of-week offset for the first day (Monday = 0, Sunday = 6)
  const firstDate = new Date(days[0].date);
  const firstDayIndex = (firstDate.getDay() + 6) % 7; // Convert 0(Sun) -> 6, 1(Mon) -> 0

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 overflow-hidden">
      {/* View Switcher & Legend Bar */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 text-[11px]">
        {/* Left: View Mode Pills (Grid vs List) */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg shadow-2xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-amber-500 text-white shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Daily List</span>
          </button>
        </div>

        {/* Right: Status Legend Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Present</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Holiday</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Leave</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>WFH</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Exception</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Absent</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Weekend</span>
          </span>
        </div>
      </div>

      {/* VIEW 1: AGENDA / DAILY LIST (Optimized for Mobile) */}
      {viewMode === 'list' ? (
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {days.map((day) => {
            const dateObj = new Date(day.date);
            const dateStr = dateObj.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            const isWeekend = day.statusCode === 'WO';
            const isAbsent = day.statusCode === 'A';
            const isPresent = day.statusCode === 'P';

            return (
              <div
                key={day.date}
                className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                  isPresent
                    ? 'hover:bg-emerald-50/30'
                    : isAbsent
                    ? 'hover:bg-rose-50/30'
                    : isWeekend
                    ? 'bg-slate-50/50 text-slate-400'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-slate-700 shrink-0 font-medium">
                    <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">
                      {dateObj.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </span>
                    <span className="text-sm font-bold leading-tight">{dateObj.getDate()}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800">{dateStr}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {isWeekend
                        ? 'Scheduled weekend off'
                        : day.leaveType
                        ? `On Leave: ${day.leaveType}`
                        : day.statusCode === 'H'
                        ? 'Official Public Holiday'
                        : isAbsent
                        ? 'No biometric punch recorded'
                        : day.statusCode === 'E'
                        ? 'WFO Exception active'
                        : 'Regular working day'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {day.punchTime && (
                    <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{day.punchTime}</span>
                    </div>
                  )}
                  <StatusBadge status={day.statusCode} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: 7-COLUMN MONTH GRID */
        <div>
          {/* Mobile Swipe Hint */}
          <div className="sm:hidden px-3 py-1.5 bg-amber-50/60 border-b border-amber-100 text-[11px] text-amber-800 flex items-center justify-between">
            <span>Calendar View</span>
            <span className="font-semibold text-amber-700">Swipe horizontally &rarr;</span>
          </div>

          <div className="overflow-x-auto touch-pan-x">
            <div className="min-w-[640px]">
              {/* Weekday Header Columns */}
              <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-100/50 text-center py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {WEEKDAYS.map((wd) => (
                  <div key={wd}>{wd}</div>
                ))}
              </div>

              {/* Grid of Day Cells */}
              <div className="p-3 grid grid-cols-7 gap-2">
                {/* Leading empty placeholders to align with first day of week */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="min-h-[92px] rounded-xl border border-dashed border-slate-200/50 bg-slate-50/20"
                  />
                ))}

                {days.map((day) => {
                  const dateObj = new Date(day.date);
                  const dayNum = dateObj.getDate();
                  const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
                  const isWeekend = day.statusCode === 'WO';
                  const isHoliday = day.statusCode === 'H';
                  const isAbsent = day.statusCode === 'A';
                  const isPresent = day.statusCode === 'P';
                  const isException = day.statusCode === 'E';
                  const isNotEvaluated = day.statusCode === '-';

                  return (
                    <div
                      key={day.date}
                      className={`rounded-xl border flex flex-col justify-between min-h-[92px] h-full overflow-hidden transition-all ${
                        isAbsent
                          ? 'bg-white border-slate-200 hover:border-rose-300'
                          : isHoliday
                          ? 'bg-teal-50/20 border-slate-200 hover:border-teal-300'
                          : isPresent
                          ? 'bg-white border-slate-200 hover:border-emerald-300'
                          : isWeekend
                          ? 'bg-slate-50 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Day Header */}
                      <div
                        className={`px-2 py-1.5 border-b border-slate-100 flex items-center justify-between ${
                          isWeekend ? 'bg-slate-100/60' : 'bg-slate-50/80'
                        }`}
                      >
                        <span className="text-[11px] font-semibold text-slate-800">
                          {monthStr} {dayNum}
                        </span>
                        <StatusBadge status={day.statusCode} />
                      </div>

                      {/* Day Details */}
                      <div className="p-2 flex-1 flex flex-col justify-center items-center text-center">
                        {day.punchTime ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{day.punchTime}</span>
                          </div>
                        ) : day.leaveType ? (
                          <div
                            className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-full"
                            title={day.leaveType}
                          >
                            {day.leaveType}
                          </div>
                        ) : isException ? (
                          <div className="text-[10px] text-purple-700 font-medium bg-purple-50 px-1.5 py-0.5 rounded">
                            Exception
                          </div>
                        ) : isHoliday ? (
                          <div className="text-[10px] text-teal-700 font-medium bg-teal-50 px-1.5 py-0.5 rounded">
                            Holiday
                          </div>
                        ) : isAbsent ? (
                          <div className="text-[10px] text-slate-400 font-normal italic">No punch logged</div>
                        ) : isWeekend ? (
                          <div className="text-[11px] text-slate-400 font-medium">Off</div>
                        ) : isNotEvaluated ? (
                          <div className="text-[11px] text-slate-300 font-mono">-</div>
                        ) : (
                          <div className="text-[11px] text-slate-300 font-mono">-</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
