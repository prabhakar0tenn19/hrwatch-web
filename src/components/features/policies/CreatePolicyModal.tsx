import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { createPolicyVersion } from '@/lib/api';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EditableRule {
  category: string;
  normalWfoDays: number;
  onBenchDays: number;
}

const DEFAULT_RULES: EditableRule[] = [
  { category: 'SDE', normalWfoDays: 5, onBenchDays: 5 },
  { category: 'Consultant 1', normalWfoDays: 5, onBenchDays: 5 },
  { category: 'Consultant 2', normalWfoDays: 5, onBenchDays: 5 },
  { category: 'Associate 1', normalWfoDays: 3, onBenchDays: 5 },
  { category: 'Associate 2', normalWfoDays: 3, onBenchDays: 5 },
  { category: 'Manager 1', normalWfoDays: 3, onBenchDays: 5 },
  { category: 'Manager 2', normalWfoDays: 3, onBenchDays: 5 },
  { category: 'Manager 3', normalWfoDays: 3, onBenchDays: 5 },
  { category: 'Principal / Director', normalWfoDays: 3, onBenchDays: 5 },
];

export function CreatePolicyModal({ isOpen, onClose, onSuccess }: CreatePolicyModalProps) {
  const [policyName, setPolicyName] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().slice(0, 10));
  const [rules, setRules] = useState<EditableRule[]>(DEFAULT_RULES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRuleChange = (index: number, field: 'normalWfoDays' | 'onBenchDays', val: number) => {
    setRules((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName.trim()) {
      setError('Please provide a policy name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createPolicyVersion({
        policyName: policyName.trim(),
        rulesJson: JSON.stringify(rules),
        effectiveFrom,
        createdBy: 'HR Admin',
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish policy version.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Publish New Policy Version</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Policy Name & Effective Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Policy Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Standard WFO Policy 2026 - Q4"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-400/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Effective Start Date</label>
              <input
                type="date"
                required
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-400/50 outline-none"
              />
            </div>
          </div>

          {/* Configurable Rules Table */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Configure Required Days by Category
            </label>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3 text-center">Deployed WFO</th>
                    <th className="py-2.5 px-3 text-center">Bench WFO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rules.map((rule, idx) => (
                    <tr key={rule.category} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-800">{rule.category}</td>
                      <td className="py-2 px-3 text-center">
                        <select
                          value={rule.normalWfoDays}
                          onChange={(e) => handleRuleChange(idx, 'normalWfoDays', Number(e.target.value))}
                          className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-amber-400/50"
                        >
                          <option value={1}>1 Day</option>
                          <option value={2}>2 Days</option>
                          <option value={3}>3 Days</option>
                          <option value={4}>4 Days</option>
                          <option value={5}>5 Days</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <select
                          value={rule.onBenchDays}
                          onChange={(e) => handleRuleChange(idx, 'onBenchDays', Number(e.target.value))}
                          className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-amber-400/50"
                        >
                          <option value={3}>3 Days</option>
                          <option value={4}>4 Days</option>
                          <option value={5}>5 Days</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish & Activate Version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
