import React, { useState } from 'react';
import { EmployeeDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface EmployeesTableProps {
  employees: EmployeeDto[];
  onSelectEmployee: (emp: EmployeeDto) => void;
}

export function EmployeesTable({ employees, onSelectEmployee }: EmployeesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const totalPages = Math.ceil(employees.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 overflow-hidden">
      {/* 1. Mobile Card List (< sm: 640px) */}
      <div className="sm:hidden divide-y divide-slate-100">
        {paginatedEmployees.map((emp) => {
          const isHighAbsent = emp.absentPercentage > 15;

          return (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="p-3.5 hover:bg-amber-50/30 transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={emp.fullName} size="md" className="w-8 h-8 text-xs shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-xs truncate">
                      {emp.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {emp.employeeCode} &bull; {emp.designation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      emp.isDeployed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {emp.isDeployed ? 'Deployed' : 'Bench'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/80">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>Present: <strong className="text-slate-800">{emp.presentDays}d</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                    <div
                      className={`h-full rounded-full ${
                        isHighAbsent ? 'bg-rose-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, emp.absentPercentage)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 tabular-nums">
                    {emp.absentPercentage}% absent
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Full Table (>= sm: 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-slate-50/75 text-slate-500 text-[11px] uppercase font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4 text-left">Employee</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Designation</th>
              <th className="py-3 px-4 text-left">Deployment</th>
              <th className="py-3 px-4 text-center">Present</th>
              <th className="py-3 px-4 text-left">Absent Rate</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedEmployees.map((emp) => {
              const isHighAbsent = emp.absentPercentage > 15;

              return (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                >
                  {/* Employee Name & Code */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.fullName} size="md" className="w-8 h-8 text-xs shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors truncate">
                          {emp.fullName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.employeeCode}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 align-middle text-slate-600 text-xs font-mono">{emp.email}</td>

                  {/* Designation */}
                  <td className="py-3 px-4 align-middle text-slate-700 font-medium text-xs">
                    {emp.designation}
                  </td>

                  {/* Deployment Status */}
                  <td className="py-3 px-4 align-middle">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        emp.isDeployed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {emp.isDeployed ? 'Client Deployed' : 'On Bench'}
                    </span>
                  </td>

                  {/* Present Days */}
                  <td className="py-3 px-4 align-middle text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 tabular-nums">
                      {emp.presentDays}d
                    </span>
                  </td>

                  {/* Absent Percentage with Subtle Soft Progress Bar */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            isHighAbsent ? 'bg-rose-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, emp.absentPercentage)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 tabular-nums">
                        {emp.absentPercentage}%
                      </span>
                    </div>
                  </td>

                  {/* Action Link */}
                  <td className="py-3 px-4 align-middle text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:text-amber-700 transition-colors">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/75 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="text-center sm:text-left">
          Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(startIndex + pageSize, employees.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{employees.length}</span> employees
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-slate-700 bg-white border border-slate-200 rounded shadow-2xs">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
