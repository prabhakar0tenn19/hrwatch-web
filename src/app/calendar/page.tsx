'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getAttendanceCalendar } from '@/lib/api';
import { EmployeeCalendarDto } from '@/lib/types';
import { EmployeePickerList } from '@/components/features/calendar/EmployeePickerList';
import { CalendarHeader } from '@/components/features/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/features/calendar/CalendarGrid';
import { ActiveExceptionsPanel } from '@/components/features/calendar/ActiveExceptionsPanel';
import { AddExceptionModal } from '@/components/features/calendar/AddExceptionModal';
import { AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';

export default function AttendanceCalendarPage() {
  // Default to August 2026 or current active month
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');

  const [employees, setEmployees] = useState<EmployeeCalendarDto[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exception Modal State
  const [isAddExceptionOpen, setIsAddExceptionOpen] = useState(false);

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAttendanceCalendar(startDate, endDate);
      setEmployees(res);
      if (res.length > 0 && !selectedEmployeeId) {
        setSelectedEmployeeId(res[0].employeeId);
      } else if (res.length > 0 && !res.some((e) => e.employeeId === selectedEmployeeId)) {
        setSelectedEmployeeId(res[0].employeeId);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load attendance calendar.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedEmployeeId]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const handleDateRangeChange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(term) ||
        e.employeeCode.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.designation.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.employeeId === selectedEmployeeId) || null;
  }, [employees, selectedEmployeeId]);

  return (
    <div className="space-y-5">
      {/* Top Page Title */}
      <div className="flex items-center gap-2.5">
        <CalendarIcon className="w-5 h-5 text-amber-500 shrink-0" />
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Attendance Calendar
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Split: Left (Employee Directory) & Right (Calendar + Exceptions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 4 Cols: Employee Directory Sidebar */}
        <div className="lg:col-span-4 sticky top-20">
          <EmployeePickerList
            employees={filteredEmployees}
            selectedEmployeeId={selectedEmployeeId}
            onSelectEmployee={(emp) => setSelectedEmployeeId(emp.employeeId)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading && employees.length === 0}
          />
        </div>

        {/* Right 8 Cols: Unified Vertical Stack (Calendar Header -> Grid -> Exceptions) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Controls & Profile Card */}
          <CalendarHeader
            selectedEmployee={selectedEmployee}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onOpenAddException={() => setIsAddExceptionOpen(true)}
            onRefresh={fetchCalendar}
            loading={loading}
          />

          {/* Strict 7-Column Calendar Grid */}
          <CalendarGrid days={selectedEmployee?.days || []} loading={loading} />

          {/* Active Exceptions Panel Immediately Below */}
          <ActiveExceptionsPanel
            exceptions={selectedEmployee?.activeExceptions || []}
            onOpenAddException={() => setIsAddExceptionOpen(true)}
          />
        </div>
      </div>

      {/* Add Exception Modal */}
      {selectedEmployee && (
        <AddExceptionModal
          isOpen={isAddExceptionOpen}
          onClose={() => setIsAddExceptionOpen(false)}
          defaultEmployeeId={selectedEmployee.employeeId}
          defaultEmployeeName={selectedEmployee.fullName}
          onSuccess={fetchCalendar}
        />
      )}
    </div>
  );
}
