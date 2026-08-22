import React from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';

interface EmployeesFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedDesignation: string;
  onDesignationChange: (val: string) => void;
  selectedDeployment: string;
  onDeploymentChange: (val: string) => void;
}

export function EmployeesFilters({
  searchTerm,
  onSearchChange,
  selectedDesignation,
  onDesignationChange,
  selectedDeployment,
  onDeploymentChange,
}: EmployeesFiltersProps) {
  return (
    <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col md:flex-row gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or code..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        {/* Designation Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDesignation}
            onChange={(e) => onDesignationChange(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Designations</option>
            <option value="SDE">Software Engineer (SDE)</option>
            <option value="Consultant">Consultant</option>
            <option value="Associate">Associate</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Principal">Principal</option>
          </select>
        </div>

        {/* Deployment Filter */}
        <div className="flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDeployment}
            onChange={(e) => onDeploymentChange(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">All Deployments</option>
            <option value="DEPLOYED">Client Deployed</option>
            <option value="BENCH">Internal HQ / Bench</option>
          </select>
        </div>
      </div>
    </div>
  );
}
