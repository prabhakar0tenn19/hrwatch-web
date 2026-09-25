'use client';

import React, { useEffect, useRef } from 'react';
import { Search, X, Check, Users } from 'lucide-react';
import { EmployeeCalendarDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';

interface MobileEmployeePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employees: EmployeeCalendarDto[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (emp: EmployeeCalendarDto) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
}

export function MobileEmployeePickerDrawer({
  isOpen,
  onClose,
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  searchTerm,
  onSearchChange,
  loading,
}: MobileEmployeePickerDrawerProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Fixed consistent height so it NEVER shrinks or jumps when searching) */}
      <div
        className="relative z-10 bg-white rounded-t-2xl shadow-2xl flex flex-col h-[85vh] max-h-[90vh] w-full overflow-hidden animate-in slide-in-from-bottom duration-200"
        style={{ height: '85dvh' }}
      >
        {/* Drag handle bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-900">Select Employee</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {employees.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close employee picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, CGI code, or role..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Employee List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 overscroll-contain pb-8">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-400 animate-pulse">
              Loading employee roster...
            </div>
          ) : employees.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-600">No employees match &ldquo;{searchTerm}&rdquo;</p>
              <button
                onClick={() => onSearchChange('')}
                className="mt-2 text-xs font-semibold text-amber-600 hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            employees.map((emp) => {
              const isSelected = emp.employeeId === selectedEmployeeId;

              return (
                <button
                  key={emp.employeeId}
                  onClick={() => {
                    onSelectEmployee(emp);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 transition-colors active:bg-amber-100/60 ${
                    isSelected
                      ? 'bg-amber-50/90 text-slate-900 font-semibold border-l-4 border-l-amber-500'
                      : 'hover:bg-slate-50 text-slate-700 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar name={emp.fullName} size="md" className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {emp.fullName}
                        </span>
                        <span className="text-[10px] font-semibold font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {emp.employeeCode}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        <span>{emp.designation}</span>
                        {emp.isDeployed ? (
                          <span className="ml-1.5 text-[10px] text-emerald-600 font-medium font-sans">
                            &bull; Client Deployed
                          </span>
                        ) : (
                          <span className="ml-1.5 text-[10px] text-amber-600 font-medium font-sans">
                            &bull; Bench
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
