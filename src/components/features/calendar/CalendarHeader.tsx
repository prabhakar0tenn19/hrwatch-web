import React from 'react';
import { Plus, RefreshCw, Calendar as CalendarIcon, Users } from 'lucide-react';
import { EmployeeCalendarDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';

interface CalendarHeaderProps {
  selectedEmployee: EmployeeCalendarDto | null;
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
  onOpenAddException: () => void;
  onRefresh: () => void;
  loading: boolean;
  onOpenEmployeePicker?: () => void;
}

export function CalendarHeader({
  selectedEmployee,
  startDate,
  endDate,
  onDateRangeChange,
  onOpenAddException,
  onRefresh,
  loading,
  onOpenEmployeePicker,
}: CalendarHeaderProps) {
  // Quick Presets
  const setThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    onDateRangeChange(monday.toISOString().slice(0, 10), friday.toISOString().slice(0, 10));
  };

  const setLastWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1 - day) - 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    onDateRangeChange(monday.toISOString().slice(0, 10), friday.toISOString().slice(0, 10));
  };

  const setThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    onDateRangeChange(firstDay.toISOString().slice(0, 10), lastDay.toISOString().slice(0, 10));
  };

  // Quick stats calculation
  const presentDays = selectedEmployee?.days.filter((d) => d.statusCode === 'P').length || 0;
  const leaveDays = selectedEmployee?.days.filter((d) => d.statusCode === 'L').length || 0;
  const absentDays = selectedEmployee?.days.filter((d) => d.statusCode === 'A').length || 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-4 grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
      {/* Left 7 Cols: Clean Employee Profile Info */}
      <div className="xl:col-span-7">
        {selectedEmployee ? (
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar name={selectedEmployee.fullName} size="lg" className="w-11 h-11 sm:w-12 sm:h-12 text-sm shrink-0" />
              <div className="min-w-0 flex-1">
                {/* Row 1: Name + Code Badge + Deployed Badge */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
                    {selectedEmployee.fullName}
                  </h2>
                  <span className="text-[10px] font-semibold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 leading-normal">
                    {selectedEmployee.employeeCode}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-normal ${
                      selectedEmployee.isDeployed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedEmployee.isDeployed ? 'Client Deployed' : 'On Bench'}
                  </span>
                </div>

                {/* Row 2: Designation • Email */}
                <div className="text-xs text-slate-500 mt-1 truncate">
                  <span>{selectedEmployee.designation}</span>
                  <span className="mx-1.5">&bull;</span>
                  <span className="text-slate-400">{selectedEmployee.email}</span>
                </div>

                {/* Row 3: Light Text Compliance Overview Stats */}
                <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
                  <span className="text-emerald-600 font-semibold">{presentDays} Present</span>
                  <span>&bull;</span>
                  <span className="text-slate-600 font-medium">{leaveDays} Leaves</span>
                  <span>&bull;</span>
                  <span className={absentDays > 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                    {absentDays} Absences
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Switch Employee Button */}
            {onOpenEmployeePicker && (
              <button
                onClick={onOpenEmployeePicker}
                className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors shrink-0"
                title="Change selected employee"
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Switch</span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>Select an employee to view their attendance</span>
            </div>
            {onOpenEmployeePicker && (
              <button
                onClick={onOpenEmployeePicker}
                className="lg:hidden inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Select Employee</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right 5 Cols: Controls separated by clean vertical border */}
      <div className="xl:col-span-5 xl:border-l xl:border-slate-200 xl:pl-5 space-y-2.5 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
        {/* Row 1: Segmented Control Pills (Full matching width) */}
        <div className="w-full grid grid-cols-3 bg-slate-100 p-1 rounded-lg text-center text-xs font-medium text-slate-600">
          <button
            onClick={setThisWeek}
            className="py-1 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all active:bg-white"
          >
            This Week
          </button>
          <button
            onClick={setLastWeek}
            className="py-1 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all active:bg-white"
          >
            Last Week
          </button>
          <button
            onClick={setThisMonth}
            className="py-1 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-xs transition-all active:bg-white"
          >
            This Month
          </button>
        </div>

        {/* Row 2: Date Pickers (Matching full width) */}
        <div className="w-full grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateRangeChange(e.target.value, endDate)}
              className="w-full border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateRangeChange(startDate, e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>
        </div>

        {/* Row 3: Action Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-0.5">
          {onOpenEmployeePicker && (
            <button
              onClick={onOpenEmployeePicker}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Change Employee</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Calendar"
              className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs shadow-slate-900/5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onOpenAddException}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-xs shadow-amber-900/10 focus:ring-2 focus:ring-amber-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exception</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
