import React from 'react';
import { Users, Building2, UserCheck, TrendingDown } from 'lucide-react';
import { EmployeeDto } from '@/lib/types';

interface EmployeesHeaderProps {
  employees: EmployeeDto[];
}

export function EmployeesHeader({ employees }: EmployeesHeaderProps) {
  const totalEmployees = employees.length;
  const deployedCount = employees.filter((e) => e.isDeployed).length;
  const benchCount = totalEmployees - deployedCount;
  const avgAbsentPercent =
    totalEmployees > 0
      ? (employees.reduce((acc, curr) => acc + curr.absentPercentage, 0) / totalEmployees).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <Users className="w-5 h-5 text-amber-500 shrink-0" />
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Employee Directory & Records
        </h1>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Employees */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Active Employees
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-slate-900 leading-none">{totalEmployees}</div>
            <div className="text-xs text-slate-500 font-normal mt-1.5">India Staff Directory</div>
          </div>
        </div>

        {/* Card 2: Client Deployed */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Client Deployed
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-slate-900 leading-none">{deployedCount}</div>
            <div className="text-xs text-slate-500 font-normal mt-1.5">
              {totalEmployees > 0 ? ((deployedCount / totalEmployees) * 100).toFixed(0) : 0}% of workforce
            </div>
          </div>
        </div>

        {/* Card 3: Internal HQ / Bench */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Internal HQ / Bench
            </span>
            <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-slate-900 leading-none">{benchCount}</div>
            <div className="text-xs text-slate-500 font-normal mt-1.5">5 Days WFO Required</div>
          </div>
        </div>

        {/* Card 4: Avg Absent Rate */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Avg Absent Rate
            </span>
            <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-3xl font-semibold text-slate-900 leading-none">{avgAbsentPercent}%</div>
            <div className="text-xs text-slate-500 font-normal mt-1.5">Across active roster</div>
          </div>
        </div>
      </div>
    </div>
  );
}
