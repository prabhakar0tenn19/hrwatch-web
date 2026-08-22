import React from 'react';
import { Search } from 'lucide-react';
import { EmployeeCalendarDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';

interface EmployeePickerListProps {
  employees: EmployeeCalendarDto[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (emp: EmployeeCalendarDto) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading: boolean;
}

export function EmployeePickerList({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  searchTerm,
  onSearchChange,
  loading,
}: EmployeePickerListProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col h-[750px] overflow-hidden">
      {/* Search Bar Header */}
      <div className="p-3.5 border-b border-slate-100">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search employee..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center justify-between mt-2.5 px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Employees
          </span>
          <span className="text-xs text-slate-400 font-medium">{employees.length} Total</span>
        </div>
      </div>

      {/* Scrollable Employee List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading roster...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No employees match &ldquo;{searchTerm}&rdquo;
          </div>
        ) : (
          employees.map((emp) => {
            const isSelected = emp.employeeId === selectedEmployeeId;

            return (
              <button
                key={emp.employeeId}
                onClick={() => onSelectEmployee(emp)}
                className={`w-full text-left px-3.5 py-3 flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-amber-50/80 border-l-4 border-l-amber-500 text-slate-900 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700 border-l-4 border-l-transparent'
                }`}
              >
                <Avatar name={emp.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate text-slate-900">{emp.fullName}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    {emp.employeeCode} &bull; {emp.designation}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
