import React, { useState } from 'react';
import { EmployeeExceptionDto } from '@/lib/types';
import { Avatar } from '@/components/common/Avatar';
import { Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ExceptionsTableProps {
  exceptions: EmployeeExceptionDto[];
  onRevoke: (id: string, employeeName: string) => void;
  revokingId: string | null;
}

export function ExceptionsTable({ exceptions, onRevoke, revokingId }: ExceptionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(exceptions.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = exceptions.slice(startIndex, startIndex + pageSize);

  const calculateDays = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dStr: string) => {
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 overflow-hidden">
      {/* 1. MOBILE CARDS VIEW (< 640px) */}
      <div className="sm:hidden divide-y divide-slate-100">
        {paginatedList.map((ex) => {
          const daysCount = calculateDays(ex.fromDate, ex.toDate);
          const isRevoking = revokingId === ex.id;

          return (
            <div key={ex.id} className="p-4 space-y-3 bg-white">
              {/* Card Header: Avatar + Name + Employee Code + Status Pill */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Avatar name={ex.fullName} size="md" className="w-9 h-9 text-xs shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-slate-900 truncate">{ex.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      {ex.employeeCode} &bull; {ex.email}
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    ex.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {ex.isActive ? 'Active' : 'Revoked'}
                </span>
              </div>

              {/* Card Details: Date Range & Duration */}
              <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100/80 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">
                    {formatDate(ex.fromDate)} &rarr; {formatDate(ex.toDate)}
                  </span>
                </div>
                <span className="font-semibold text-slate-800 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                  {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              {/* Reason / Justification Callout */}
              <div className="text-xs bg-purple-50/40 border border-purple-100/60 rounded-lg p-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-700 mb-0.5">
                  Reason / Justification
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">{ex.reason}</p>
              </div>

              {/* Metadata & Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-400">
                  <span>Approved by </span>
                  <strong className="text-slate-600 font-medium">{ex.createdBy || 'HR Admin'}</strong>
                </div>

                {ex.isActive && (
                  <button
                    onClick={() => onRevoke(ex.id, ex.fullName)}
                    disabled={isRevoking}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isRevoking ? 'Revoking...' : 'Revoke'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. DESKTOP TABLE VIEW (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[680px]">
          <thead className="bg-slate-50/75 text-slate-500 text-[11px] uppercase font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4 text-left">Employee</th>
              <th className="py-3 px-4 text-left">Date Range</th>
              <th className="py-3 px-4 text-center">Duration</th>
              <th className="py-3 px-4 text-left">Reason / Justification</th>
              <th className="py-3 px-4 text-left">Approved By</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedList.map((ex) => {
              const daysCount = calculateDays(ex.fromDate, ex.toDate);
              const isRevoking = revokingId === ex.id;

              return (
                <tr key={ex.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Employee */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar name={ex.fullName} size="md" className="w-8 h-8 text-xs shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 leading-tight">{ex.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {ex.employeeCode} &bull; {ex.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date Range (Stacked format) */}
                  <td className="py-3 px-4 align-middle">
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-semibold text-slate-800">{formatDate(ex.fromDate)}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">to {formatDate(ex.toDate)}</span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-4 align-middle text-center">
                    <span className="font-semibold text-slate-700 text-xs tabular-nums">
                      {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                    </span>
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-4 align-middle">
                    <div
                      className="text-xs text-slate-700 leading-snug max-w-[200px] truncate"
                      title={ex.reason}
                    >
                      {ex.reason}
                    </div>
                  </td>

                  {/* Approved By & Created At */}
                  <td className="py-3 px-4 align-middle">
                    <div className="text-xs font-semibold text-slate-800">{ex.createdBy || 'HR Admin'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{ex.createdAt?.slice(0, 10)}</div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 align-middle text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        ex.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {ex.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 align-middle text-right">
                    {ex.isActive ? (
                      <button
                        onClick={() => onRevoke(ex.id, ex.fullName)}
                        disabled={isRevoking}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isRevoking ? 'Revoking...' : 'Revoke'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300 select-none pr-3">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/75 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="text-center sm:text-left">
          Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(startIndex + pageSize, exceptions.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{exceptions.length}</span> exceptions
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
