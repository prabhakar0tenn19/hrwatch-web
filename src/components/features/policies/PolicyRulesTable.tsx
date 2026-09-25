import React, { useMemo } from 'react';
import { PolicyDto } from '@/lib/types';
import { FileText, ShieldCheck, ShieldAlert, Plus } from 'lucide-react';

interface PolicyRuleItem {
  role: string;
  requiredDays: number;
  model: string;
}

interface PolicyRulesTableProps {
  policy: PolicyDto | null;
  policies?: PolicyDto[];
  onSelectPolicy?: (policy: PolicyDto) => void;
  onOpenCreate: () => void;
}

export function PolicyRulesTable({
  policy,
  policies = [],
  onSelectPolicy,
  onOpenCreate,
}: PolicyRulesTableProps) {
  const rules = useMemo<PolicyRuleItem[]>(() => {
    if (!policy?.rulesJson) return [];
    try {
      const parsed = typeof policy.rulesJson === 'string' ? JSON.parse(policy.rulesJson) : policy.rulesJson;

      const items: PolicyRuleItem[] = [];
      let defaultDays = 5;

      // Extract default days if provided
      if (parsed && typeof parsed === 'object') {
        if ('DefaultRequiredDays' in parsed && typeof parsed.DefaultRequiredDays === 'number') {
          defaultDays = parsed.DefaultRequiredDays;
        } else if ('defaultRequiredDays' in parsed && typeof parsed.defaultRequiredDays === 'number') {
          defaultDays = parsed.defaultRequiredDays;
        }
      }

      // 1. Check for nested dictionary (MinWfoDaysPerWeek / minWfoDaysPerWeek)
      const minWfoDict =
        parsed?.MinWfoDaysPerWeek ||
        parsed?.minWfoDaysPerWeek ||
        parsed?.rules ||
        (typeof parsed === 'object' && !Array.isArray(parsed) && !parsed.category ? parsed : null);

      if (minWfoDict && typeof minWfoDict === 'object' && !Array.isArray(minWfoDict)) {
        Object.entries(minWfoDict).forEach(([role, days]) => {
          if (role === 'DefaultRequiredDays' || role === 'defaultRequiredDays') return;
          const d = typeof days === 'number' ? days : Number(days) || 5;
          items.push({
            role,
            requiredDays: d,
            model: d >= 5 ? 'Full Week In-Office' : d === 3 ? 'Hybrid (3-Day Office)' : `Flexible (${d}-Day)`,
          });
        });
      } else if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          const d = Number(item.normalWfoDays ?? item.wfoDays ?? item.requiredDays ?? 5);
          items.push({
            role: item.category || item.role || 'Standard Staff',
            requiredDays: d,
            model: d >= 5 ? 'Full Week In-Office' : d === 3 ? 'Hybrid (3-Day Office)' : `Flexible (${d}-Day)`,
          });
        });
      }

      // Always ensure Bench / Internal HQ is included as a distinct row at the bottom
      const hasBench = items.some((i) => i.role.toLowerCase().includes('bench') || i.role.toLowerCase().includes('hq'));
      if (!hasBench) {
        items.push({
          role: 'Internal HQ / Bench Staff',
          requiredDays: defaultDays,
          model: 'Mandatory Full Week WFO',
        });
      }

      return items;
    } catch {
      return [
        { role: 'Probation', requiredDays: 5, model: 'Full Week In-Office' },
        { role: 'SDE', requiredDays: 5, model: 'Full Week In-Office' },
        { role: 'Consultant 1 & 2', requiredDays: 5, model: 'Full Week In-Office' },
        { role: 'Associate 1 & 2', requiredDays: 3, model: 'Hybrid (3-Day Office)' },
        { role: 'Manager 1, 2 & 3', requiredDays: 3, model: 'Hybrid (3-Day Office)' },
        { role: 'Principal / Director', requiredDays: 3, model: 'Hybrid (3-Day Office)' },
        { role: 'Internal HQ / Bench Staff', requiredDays: 5, model: 'Mandatory Full Week WFO' },
      ];
    }
  }, [policy?.rulesJson]);

  if (!policy) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs p-12 text-center text-slate-400 text-xs">
        Select a policy from the sidebar to view details.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Policy Overview Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Title + Version + Active Pill in 1 Straight Row */}
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
                {policy.policyName}
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold font-mono bg-slate-100 text-slate-700 rounded-md">
                v{policy.version}
              </span>
              {policy.isActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Active Policy</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200 rounded-full">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Archived Version</span>
                </span>
              )}
            </div>

            {/* Single Line Clean Metadata */}
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
              <span>
                Effective:{' '}
                <strong className="text-slate-700 font-medium">
                  {policy.effectiveFrom ? policy.effectiveFrom.slice(0, 10) : 'Immediate'}
                </strong>{' '}
                to{' '}
                <strong className="text-slate-700 font-medium">
                  {policy.effectiveTo ? policy.effectiveTo.slice(0, 10) : 'Present (Ongoing)'}
                </strong>
              </span>
              <span className="hidden sm:inline">&bull;</span>
              <span>
                Author: <strong className="text-slate-700 font-medium">{policy.createdBy || 'HR Admin'}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-xs shadow-amber-900/10 focus:ring-2 focus:ring-amber-200 shrink-0 self-stretch sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Version</span>
          </button>
        </div>

        {/* Mobile Fast Version Switcher Dropdown */}
        {policies.length > 1 && onSelectPolicy && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600">Switch Version:</span>
            <select
              value={policy.id}
              onChange={(e) => {
                const found = policies.find((p) => p.id === e.target.value);
                if (found) onSelectPolicy(found);
              }}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-200 outline-none max-w-[220px] truncate"
            >
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  v{p.version} - {p.policyName} {p.isActive ? '(Active)' : '(Archived)'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Rules Breakdown Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs shadow-slate-900/5 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-slate-50/75 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              WFO Requirements by Role
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{rules.length} Rules</span>
        </div>

        {/* MOBILE VIEW (< 640px): Responsive Card List (Zero horizontal scrolling!) */}
        <div className="sm:hidden divide-y divide-slate-100">
          {rules.map((r, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 truncate">{r.role}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{r.model}</div>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                  {r.requiredDays} Days / Wk
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW (>= 640px): Full Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-5 text-left">Role / Designation</th>
                <th className="py-3 px-5 text-center">Required WFO Days</th>
                <th className="py-3 px-5 text-right">Attendance Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5 font-semibold text-slate-900 align-middle">
                    {r.role}
                  </td>
                  <td className="py-3 px-5 text-center align-middle">
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {r.requiredDays} Days / Week
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right align-middle">
                    <span className="text-slate-500 font-medium">
                      {r.model}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
