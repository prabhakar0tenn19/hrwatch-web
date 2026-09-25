'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getAttendanceCalendar } from '@/lib/api';
import { EmployeeCalendarDto } from '@/lib/types';
import { EmployeePickerList } from '@/components/features/calendar/EmployeePickerList';
import { CalendarHeader } from '@/components/features/calendar/CalendarHeader';
import { CalendarGrid } from '@/components/features/calendar/CalendarGrid';
import { ActiveExceptionsPanel } from '@/components/features/calendar/ActiveExceptionsPanel';
import { AddExceptionModal } from '@/components/features/calendar/AddExceptionModal';
import { MobileEmployeePickerDrawer } from '@/components/features/calendar/MobileEmployeePickerDrawer';
import { AlertTriangle, Calendar as CalendarIcon, Users, ChevronDown, ChevronUp } from 'lucide-react';

export default function AttendanceCalendarPage() {
  // Default to August 2026 or current active month
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');

  const [employees, setEmployees] = useState<EmployeeCalendarDto[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile Drawer & Bottom List Collapsible State
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false);
  const [isMobileListExpanded, setIsMobileListExpanded] = useState(false);

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

  const handleSelectEmployee = (emp: EmployeeCalendarDto) => {
    setSelectedEmployeeId(emp.employeeId);
    // Smooth scroll to top on mobile so the employee's calendar is immediately visible
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <div className="space-y-4 sm:space-y-5">
      {/* Top Page Title & Quick Mobile Switch Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-5 h-5 text-amber-500 shrink-0" />
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Attendance Calendar
          </h1>
        </div>

        {/* Mobile Quick Action Pill */}
        <button
          onClick={() => setIsMobilePickerOpen(true)}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-all shadow-2xs"
        >
          <Users className="w-3.5 h-3.5 text-amber-600" />
          <span>Select Employee</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Layout: 
          On Desktop: Left 4 Cols (Directory Sidebar) + Right 8 Cols (Calendar Stack)
          On Mobile: Calendar Stack is AT THE TOP, Directory is accessible via Mobile Drawer and Bottom Collapsible!
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Desktop Left 4 Cols: Employee Directory Sidebar */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <EmployeePickerList
            employees={filteredEmployees}
            selectedEmployeeId={selectedEmployeeId}
            onSelectEmployee={handleSelectEmployee}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading && employees.length === 0}
          />
        </div>

        {/* Right 8 Cols on Desktop / Top on Mobile: Calendar Header -> Grid -> Exceptions */}
        <div className="lg:col-span-8 space-y-4 w-full">
          {/* Header Controls & Profile Card */}
          <CalendarHeader
            selectedEmployee={selectedEmployee}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onOpenAddException={() => setIsAddExceptionOpen(true)}
            onRefresh={fetchCalendar}
            loading={loading}
            onOpenEmployeePicker={() => setIsMobilePickerOpen(true)}
          />

          {/* Strict 7-Column Calendar Grid + Mobile Agenda Toggle */}
          <CalendarGrid days={selectedEmployee?.days || []} loading={loading} />

          {/* Active Exceptions Panel Immediately Below */}
          <ActiveExceptionsPanel
            exceptions={selectedEmployee?.activeExceptions || []}
            onOpenAddException={() => setIsAddExceptionOpen(true)}
          />

          {/* Mobile Bottom Collapsible: Quick Directory Search & Switch */}
          <div className="lg:hidden mt-6 bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
            <button
              onClick={() => setIsMobileListExpanded((prev) => !prev)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-800 bg-slate-50/75 hover:bg-slate-100/75 transition-colors border-b border-slate-100"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>All Employees Directory ({employees.length})</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-[11px] font-normal">{isMobileListExpanded ? 'Hide' : 'Show list'}</span>
                {isMobileListExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isMobileListExpanded && (
              <div className="p-3">
                <EmployeePickerList
                  employees={filteredEmployees}
                  selectedEmployeeId={selectedEmployeeId}
                  onSelectEmployee={(emp) => {
                    handleSelectEmployee(emp);
                    setIsMobileListExpanded(false);
                  }}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  loading={loading && employees.length === 0}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Employee Picker Drawer (Bottom Sheet) */}
      <MobileEmployeePickerDrawer
        isOpen={isMobilePickerOpen}
        onClose={() => setIsMobilePickerOpen(false)}
        employees={filteredEmployees}
        selectedEmployeeId={selectedEmployeeId}
        onSelectEmployee={handleSelectEmployee}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        loading={loading && employees.length === 0}
      />

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
