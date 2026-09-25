import React from 'react';
import { Search } from 'lucide-react';

interface ViolatorsFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedDesignation: string;
  onDesignationChange: (val: string) => void;
  weeksCount: number;
  onWeeksCountChange: (val: number) => void;
}

export function ViolatorsFilters({
  searchTerm,
  onSearchChange,
  selectedDesignation,
  onDesignationChange,
  weeksCount,
  onWeeksCountChange,
}: ViolatorsFiltersProps) {
  return (
    <div className="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, code, or email..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
        <select
          value={selectedDesignation}
          onChange={(e) => onDesignationChange(e.target.value)}
          className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 cursor-pointer"
        >
          <option value="ALL">All Designations</option>
          <option value="SDE">Software Engineer (SDE)</option>
          <option value="Consultant">Consultant</option>
          <option value="Associate">Associate</option>
          <option value="Manager">Manager</option>
        </select>

        <select
          value={weeksCount}
          onChange={(e) => onWeeksCountChange(Number(e.target.value))}
          className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 cursor-pointer"
        >
          <option value={2}>Past 2 Weeks</option>
          <option value={4}>Past 4 Weeks</option>
          <option value={6}>Past 6 Weeks</option>
          <option value={8}>Past 8 Weeks</option>
        </select>
      </div>
    </div>
  );
}
