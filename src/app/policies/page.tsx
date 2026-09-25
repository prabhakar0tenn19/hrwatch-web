'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getPolicyHistory, getActivePolicy } from '@/lib/api';
import { PolicyDto } from '@/lib/types';
import { PolicyVersionsSidebar } from '@/components/features/policies/PolicyVersionsSidebar';
import { PolicyRulesTable } from '@/components/features/policies/PolicyRulesTable';
import { CreatePolicyModal } from '@/components/features/policies/CreatePolicyModal';
import { AlertTriangle, FileText, History, ChevronDown, ChevronUp } from 'lucide-react';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyDto[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile Audit Log Accordion State
  const [isMobileHistoryExpanded, setIsMobileHistoryExpanded] = useState(false);

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const history = await getPolicyHistory();
      setPolicies(history);

      if (history.length > 0) {
        if (!selectedPolicyId) {
          const active = history.find((p) => p.isActive) || history[0];
          setSelectedPolicyId(active.id);
        }
      } else {
        const active = await getActivePolicy();
        if (active) {
          setPolicies([active]);
          setSelectedPolicyId(active.id);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load policy versions.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedPolicyId]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || null;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2.5">
        <FileText className="w-5 h-5 text-amber-500 shrink-0" />
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          WFO Attendance Policies
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Split: 
          On Desktop: Left 4 Cols (Versions Sidebar) & Right 8 Cols (Rules Table) 
          On Mobile: Rules Table is FIRST, Versions Sidebar is accessible via Dropdown and Collapsible!
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 4 Cols on Desktop: Version Audit History */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <PolicyVersionsSidebar
            policies={policies}
            selectedPolicyId={selectedPolicyId}
            onSelectPolicy={(p) => setSelectedPolicyId(p.id)}
            onOpenCreate={() => setIsCreateOpen(true)}
            loading={loading && policies.length === 0}
          />
        </div>

        {/* Right 8 Cols on Desktop / Top on Mobile: Rules Breakdown */}
        <div className="lg:col-span-8 space-y-4 w-full">
          <PolicyRulesTable
            policy={selectedPolicy}
            policies={policies}
            onSelectPolicy={(p) => setSelectedPolicyId(p.id)}
            onOpenCreate={() => setIsCreateOpen(true)}
          />

          {/* Mobile Accordion for Full Audit History */}
          <div className="lg:hidden mt-6 bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
            <button
              onClick={() => setIsMobileHistoryExpanded((prev) => !prev)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-800 bg-slate-50/75 hover:bg-slate-100/75 transition-colors border-b border-slate-100"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" />
                <span>Version History & Audit Log ({policies.length})</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-[11px] font-normal">
                  {isMobileHistoryExpanded ? 'Hide' : 'Show audit log'}
                </span>
                {isMobileHistoryExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isMobileHistoryExpanded && (
              <div className="p-3">
                <PolicyVersionsSidebar
                  policies={policies}
                  selectedPolicyId={selectedPolicyId}
                  onSelectPolicy={(p) => {
                    setSelectedPolicyId(p.id);
                    setIsMobileHistoryExpanded(false);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  onOpenCreate={() => setIsCreateOpen(true)}
                  loading={loading && policies.length === 0}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Version Modal */}
      <CreatePolicyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchPolicies}
      />
    </div>
  );
}
