import React from 'react';
import { AlertTriangle, RefreshCw, Download } from 'lucide-react';

interface ViolatorsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export function ViolatorsHeader({ loading, onRefresh, onExport }: ViolatorsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Weekly Violators Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-lg hover:bg-slate-50 transition-all shadow-xs shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-xs shadow-amber-900/10 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
