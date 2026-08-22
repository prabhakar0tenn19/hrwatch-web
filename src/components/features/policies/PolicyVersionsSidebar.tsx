import React from 'react';
import { PolicyDto } from '@/lib/types';
import { History } from 'lucide-react';

interface PolicyVersionsSidebarProps {
  policies: PolicyDto[];
  selectedPolicyId: string | null;
  onSelectPolicy: (policy: PolicyDto) => void;
  onOpenCreate?: () => void;
  loading: boolean;
}

export function PolicyVersionsSidebar({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  loading,
}: PolicyVersionsSidebarProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-4 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">Policy Versions</h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">{policies.length} Total</span>
      </div>

      {/* List of Version Cards */}
      <div className="space-y-2.5 overflow-y-auto flex-1 pt-3 pr-0.5">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading version audit history...</div>
        ) : policies.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No policy records found.</div>
        ) : (
          policies.map((pol) => {
            const isSelected = pol.id === selectedPolicyId;

            return (
              <button
                key={pol.id}
                onClick={() => onSelectPolicy(pol)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-slate-50 border-slate-300 shadow-xs'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                }`}
              >
                {/* Row 1: Version + Active status pill */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs">Version {pol.version}</span>
                  {pol.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Archived</span>
                  )}
                </div>

                {/* Row 2: Policy Name */}
                <div className="text-xs text-slate-700 font-medium mt-1.5 truncate">
                  {pol.policyName}
                </div>

                {/* Row 3: Effective Date */}
                <div className="text-[11px] text-slate-400 mt-1">
                  Effective: {pol.effectiveFrom ? pol.effectiveFrom.slice(0, 10) : 'Immediate'}
                </div>

                {/* Row 4: Author */}
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Author: {pol.createdBy || 'HR Admin'}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
