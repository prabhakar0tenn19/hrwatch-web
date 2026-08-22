import React from 'react';
import { DailyAttendanceStatusDto } from '@/lib/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Clock } from 'lucide-react';

interface CalendarGridProps {
  days: DailyAttendanceStatusDto[];
  loading: boolean;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarGrid({ days, loading }: CalendarGridProps) {
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
      {/* Compact Status Legend Bar */}
      <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
          Status Legend:
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Present</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Holiday</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Leave</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>WFH</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Exception</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Absent</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Weekend Off</span>
          </span>
        </div>
      </div>

      {/* Weekday Header Columns */}
      <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-100/50 text-center py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {WEEKDAYS.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Grid of Day Cells (Strict 7 Columns, Uniform min-h-[92px]) */}
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

              {/* Day Details / Punch Time / Leave / Absent */}
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
  );
}
