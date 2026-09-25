import React, { useEffect, useState } from 'react';
import { X, Mail, MapPin, Plus, Clock, AlertTriangle } from 'lucide-react';
import { getEmployeeById } from '@/lib/api';
import { EmployeeDetailDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';
import { StatusBadge } from '@/components/common/StatusBadge';

interface EmployeeDetailDrawerProps {
  employeeId: string | null;
  onClose: () => void;
  onOpenAddException: (emp: EmployeeDetailDto) => void;
}

export function EmployeeDetailDrawer({
  employeeId,
  onClose,
  onOpenAddException,
}: EmployeeDetailDrawerProps) {
  const [employee, setEmployee] = useState<EmployeeDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEmployeeById(employeeId);
        setEmployee(res);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch employee details.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [employeeId]);

  if (!employeeId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Employee Profile</span>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-24 text-center text-xs text-slate-400">Loading profile data...</div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {employee && !loading && (
            <>
              {/* Profile Card */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <Avatar name={employee.fullName} size="lg" className="w-13 h-13 text-sm shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {employee.fullName}
                      </h2>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                        {employee.employeeCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          employee.isDeployed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {employee.isDeployed ? 'Client Deployed' : 'On Bench'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1 truncate">
                      {employee.designation}
                    </div>
                  </div>
                </div>

                {/* Clean, Full-Width Action Button */}
                <button
                  onClick={() => onOpenAddException(employee)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 rounded-xl transition-all shadow-2xs active:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <Plus className="w-4 h-4 text-amber-700" />
                  <span>Add Attendance Exception</span>
                </button>
              </div>

              {/* 4 Quick Metric Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Present</span>
                  <div className="text-lg font-bold text-emerald-700 mt-0.5">{employee.presentDays}d</div>
                </div>

                <div className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Absent %</span>
                  <div className="text-lg font-bold text-rose-700 mt-0.5">{employee.absentPercentage}%</div>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Leaves</span>
                  <div className="text-lg font-bold text-amber-700 mt-0.5">{employee.leaveDays}d</div>
                </div>

                <div className="p-3 bg-sky-50/50 border border-sky-200/80 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">WFH</span>
                  <div className="text-lg font-bold text-sky-700 mt-0.5">{employee.wfhDays}d</div>
                </div>
              </div>

              {/* Metadata Info */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </span>
                  <span className="font-mono font-semibold text-slate-800">{employee.email}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location</span>
                  </span>
                  <span className="font-semibold text-slate-800">{employee.location || 'India'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Active Exceptions</span>
                  <span className="font-bold text-purple-700">{employee.totalExceptionsCount} Logged</span>
                </div>
              </div>

              {/* Recent 10-Day Attendance Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Recent Attendance Activity
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Last 10 Records</span>
                </div>

                <div className="space-y-2">
                  {employee.recentAttendances && employee.recentAttendances.length > 0 ? (
                    employee.recentAttendances.map((rec) => {
                      const isPresent = rec.status === 'P';

                      return (
                        <div
                          key={rec.date}
                          className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <StatusBadge status={rec.status} />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{rec.date}</div>
                              <div className="text-[10px] text-slate-400 uppercase font-medium">
                                {rec.dayOfWeek}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {isPresent && rec.firstPunchTime ? (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Clock className="w-3 h-3" />
                                <span>{rec.firstPunchTime}</span>
                              </div>
                            ) : rec.leaveType ? (
                              <span className="text-xs font-semibold text-slate-600 px-2 py-0.5 bg-slate-100 rounded">
                                {rec.leaveType}
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-rose-600">Unapproved</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No recent daily attendance logs available.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
