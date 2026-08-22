'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getPolicyHistory, getActivePolicy } from '@/lib/api';
import { PolicyDto } from '@/lib/types';
import { PolicyVersionsSidebar } from '@/components/features/policies/PolicyVersionsSidebar';
import { PolicyRulesTable } from '@/components/features/policies/PolicyRulesTable';
import { CreatePolicyModal } from '@/components/features/policies/CreatePolicyModal';
import { AlertTriangle, FileText } from 'lucide-react';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyDto[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          WFO Attendance Policies & Versions
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Split: Left (Versions Sidebar) & Right (Rules Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 4 Cols: Version Audit History */}
        <div className="lg:col-span-4 sticky top-20">
          <PolicyVersionsSidebar
            policies={policies}
            selectedPolicyId={selectedPolicyId}
            onSelectPolicy={(p) => setSelectedPolicyId(p.id)}
            onOpenCreate={() => setIsCreateOpen(true)}
            loading={loading && policies.length === 0}
          />
        </div>

        {/* Right 8 Cols: Rules Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <PolicyRulesTable
            policy={selectedPolicy}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
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
