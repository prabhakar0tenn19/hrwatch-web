import React from 'react';
import { Server, Database, Cloud, CheckCircle2, ShieldCheck } from 'lucide-react';

export function AdminSystemStatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Matrix COSEC Card */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Matrix COSEC Biometrics</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-600 space-y-1">
          <div className="font-mono text-[11px] text-slate-500 truncate">172.24.120.88/cosec/api.svc/v2</div>
          <div className="text-[11px] text-slate-400">Door Controllers: Gurgaon, Hyderabad, Pune, Bangalore</div>
        </div>
      </div>

      {/* 2. CG1 API Card */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">CG-1 Enterprise Cloud</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Connected</span>
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-600 space-y-1">
          <div className="font-mono text-[11px] text-slate-500 truncate">cg-one-ntier-dev.azurewebsites.net</div>
          <div className="text-[11px] text-slate-400">Leave, WFH, Holiday & Roster Microservices</div>
        </div>
      </div>

      {/* 3. Database Card */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">SQL Server Database</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Healthy</span>
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-600 space-y-1">
          <div className="font-mono text-[11px] text-slate-500">Database: HRWatch</div>
          <div className="text-[11px] text-slate-400">Server: IN-PRABHAKAR-LA (EF Core 8.0)</div>
        </div>
      </div>
    </div>
  );
}
