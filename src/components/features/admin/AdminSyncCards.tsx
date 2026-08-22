import React, { useState } from 'react';
import { Users, Calendar, Calculator, RefreshCw } from 'lucide-react';
import { syncEmployees, evaluateDailyAttendance, evaluateDateRange } from '@/lib/api';

export interface AdminLogItem {
  id: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'ERROR' | 'INFO';
  message: string;
  details?: string;
}

interface AdminSyncCardsProps {
  onAddLog: (log: AdminLogItem) => void;
}

export function AdminSyncCards({ onAddLog }: AdminSyncCardsProps) {
  // Sync States
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [rangeLoading, setRangeLoading] = useState(false);

  // Date Pickers
  const today = new Date().toISOString().slice(0, 10);
  const [dailyDate, setDailyDate] = useState(today);

  const [rangeFrom, setRangeFrom] = useState(today);
  const [rangeTo, setRangeTo] = useState(today);

  // 1. Sync Employees
  const handleSyncEmployees = async () => {
    setEmployeeLoading(true);
    const start = performance.now();
    try {
      const res = await syncEmployees();
      const duration = ((performance.now() - start) / 1000).toFixed(2);

      onAddLog({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action: 'EMPLOYEE_ROSTER_SYNC',
        status: 'SUCCESS',
        message: `Successfully synchronized ${res.totalFetched} employee records from CG-1 Master Directory (${res.employeesCreated} created, ${res.employeesUpdated} updated).`,
        details: `Duration: ${duration}s | HTTP 200 OK`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sync employees.';
      onAddLog({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action: 'EMPLOYEE_ROSTER_SYNC',
        status: 'ERROR',
        message: msg,
        details: 'HTTP 500 / Network Exception',
      });
    } finally {
      setEmployeeLoading(false);
    }
  };

  // 2. Daily Attendance Evaluation
  const handleDailyEval = async () => {
    setDailyLoading(true);
    const start = performance.now();
    try {
      const res = await evaluateDailyAttendance(dailyDate);
      const duration = ((performance.now() - start) / 1000).toFixed(2);

      onAddLog({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action: 'DAILY_ATTENDANCE_EVAL',
        status: 'SUCCESS',
        message: `Evaluated ${res.totalActiveEmployees} employees for date ${res.evaluationDate}: ${res.presentCount} Present, ${res.absentCount} Absent, ${res.leaveCount} Leave, ${res.wfhCount} WFH, ${res.exceptionCount} Exceptions.`,
        details: `Duration: ${duration}s | Active: ${res.totalActiveEmployees}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to evaluate daily attendance.';
      onAddLog({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action: 'DAILY_ATTENDANCE_EVAL',
        status: 'ERROR',
        message: msg,
        details: 'Evaluation Engine Exception',
      });
    } finally {
      setDailyLoading(false);
    }
  };

  // 3. Range Attendance Evaluation
  const handleRangeEval = async () => {
    setRangeLoading(true);
    const start = performance.now();
    try {
      const res = await evaluateDateRange(rangeFrom, rangeTo);
      const duration = ((performance.now() - start) / 1000).toFixed(2);

      onAddLog({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action: 'RANGE_ATTENDANCE_EVAL',
        status: 'SUCCESS',
        message: `Attendance evaluation successfully completed across ${res.totalDaysEvaluated} days (from ${res.startDate} to ${res.endDate}).`,
        details: `Duration: ${duration}s | Total Days: ${res.totalDaysEvaluated}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to evaluate date range.';
      onAddLog({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        action: 'RANGE_ATTENDANCE_EVAL',
        status: 'ERROR',
        message: msg,
        details: 'Evaluation Engine Exception',
      });
    } finally {
      setRangeLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Action Card 1: Employee Sync */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Sync Employee Roster</h3>
              <p className="text-[11px] text-slate-400">CG-1 Master Directory</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Synchronizes active employees, designations, project deployments, and email mappings from the CG-1 Azure directory.
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={handleSyncEmployees}
            disabled={employeeLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 rounded-lg transition-all shadow-xs shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${employeeLoading ? 'animate-spin' : ''}`} />
            <span>{employeeLoading ? 'Synchronizing...' : 'Sync Employee Roster'}</span>
          </button>
        </div>
      </div>

      {/* Action Card 2: Single Day Evaluation */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Daily Attendance Eval</h3>
              <p className="text-[11px] text-slate-400">Single Date Processor</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Evaluates single-day attendance applying biometric punches, holiday overrides, leaves, WFH, and exceptions.
          </p>

          <div className="mt-3">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Target Date</label>
            <input
              type="date"
              value={dailyDate}
              onChange={(e) => setDailyDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={handleDailyEval}
            disabled={dailyLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 rounded-lg transition-all shadow-xs shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dailyLoading ? 'animate-spin' : ''}`} />
            <span>{dailyLoading ? 'Evaluating...' : 'Evaluate Single Day'}</span>
          </button>
        </div>
      </div>

      {/* Action Card 3: Date Range Evaluation */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Date Range Evaluation</h3>
              <p className="text-[11px] text-slate-400">Multi-Day Batch Engine</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Batch re-evaluates all daily attendances and updates weekly office shortfall across any custom date range.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">From</label>
              <input
                type="date"
                value={rangeFrom}
                onChange={(e) => setRangeFrom(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">To</label>
              <input
                type="date"
                value={rangeTo}
                onChange={(e) => setRangeTo(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={handleRangeEval}
            disabled={rangeLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 rounded-lg transition-all shadow-xs shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rangeLoading ? 'animate-spin' : ''}`} />
            <span>{rangeLoading ? 'Batch Processing...' : 'Evaluate Date Range'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
