import React from 'react';
import { Terminal, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { AdminLogItem } from './AdminSyncCards';

interface AdminActivityLogProps {
  logs: AdminLogItem[];
  onClearLogs: () => void;
}

export function AdminActivityLog({ logs, onClearLogs }: AdminActivityLogProps) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden text-xs font-mono">
      {/* Terminal Titlebar */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Real-time System Execution Console</span>
          <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded-full font-sans">
            {logs.length} Events
          </span>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors font-sans"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* Terminal Log Entries */}
      <div className="p-4 max-h-[380px] overflow-y-auto space-y-3">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-sans">
            No system execution actions triggered yet in this session. Click any sync or evaluation button above.
          </div>
        ) : (
          logs.map((log) => {
            const isSuccess = log.status === 'SUCCESS';
            const isError = log.status === 'ERROR';

            return (
              <div
                key={log.id}
                className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isError ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : null}
                    <span className="text-amber-400 font-bold">{log.action}</span>
                  </div>
                  <span className="text-slate-500" suppressHydrationWarning>{log.timestamp}</span>
                </div>

                <p className={`${isError ? 'text-rose-300' : 'text-slate-300'} font-sans text-xs leading-snug`}>
                  {log.message}
                </p>

                {log.details && (
                  <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/60 flex items-center justify-between">
                    <span>{log.details}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-sans font-bold text-[9px] ${
                        isSuccess ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
