import React from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';

interface ExceptionsFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeOnly: boolean;
  onActiveOnlyToggle: (val: boolean) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function ExceptionsFilters({
  searchTerm,
  onSearchChange,
  activeOnly,
  onActiveOnlyToggle,
  onRefresh,
  loading,
}: ExceptionsFiltersProps) {
  return (
    <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col md:flex-row gap-3 items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by employee, code, or reason..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Toggle & Refresh */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
        <div className="flex-1 sm:flex-initial flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 hidden xs:block" />
          <button
            onClick={() => onActiveOnlyToggle(true)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all text-center ${
              activeOnly ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => onActiveOnlyToggle(false)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all text-center ${
              !activeOnly ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            All History
          </button>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Exceptions"
          className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs shadow-slate-900/5 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}
