'use client';

import React, { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { AdminSyncCards, AdminLogItem } from '@/components/features/admin/AdminSyncCards';
import { AdminActivityLog } from '@/components/features/admin/AdminActivityLog';

export default function AdminPage() {
  const [logs, setLogs] = useState<AdminLogItem[]>([]);

  useEffect(() => {
    setLogs([
      {
        id: 'init-1',
        timestamp: new Date().toLocaleTimeString(),
        action: 'SYSTEM_STARTUP',
        status: 'INFO',
        message: 'HRWatch 2.0 gateway connected to backend daemon on port 5101. Ready for automated sync tasks.',
        details: 'Service ready',
      },
    ]);
  }, []);

  const handleAddLog = (newLog: AdminLogItem) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-2.5">
        <Sliders className="w-5 h-5 text-amber-500 shrink-0" />
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Admin System Tools & Manual Synchronizer
        </h1>
      </div>

      {/* 1. On-Demand Sync Action Cards (Real Backend APIs) */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          On-Demand Manual Synchronization
        </h2>
        <AdminSyncCards onAddLog={handleAddLog} />
      </div>

      {/* 2. Live Execution Audit Console */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Live Execution Audit Console
        </h2>
        <AdminActivityLog logs={logs} onClearLogs={handleClearLogs} />
      </div>
    </div>
  );
}
