'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getExceptions, revokeException } from '@/lib/api';
import { EmployeeExceptionDto } from '@/lib/types';
import { ExceptionsHeader } from '@/components/features/exceptions/ExceptionsHeader';
import { ExceptionsFilters } from '@/components/features/exceptions/ExceptionsFilters';
import { ExceptionsTable } from '@/components/features/exceptions/ExceptionsTable';
import { CreateExceptionDialog } from '@/components/features/exceptions/CreateExceptionDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { AlertCircle, AlertTriangle } from 'lucide-react';

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState<EmployeeExceptionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);

  // Dialog & Action States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchExceptionsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExceptions(undefined, activeOnly);
      setExceptions(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch attendance exceptions.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    fetchExceptionsList();
  }, [fetchExceptionsList]);

  // Filter Logic
  const filteredExceptions = useMemo(() => {
    if (!searchTerm) return exceptions;
    const term = searchTerm.toLowerCase();
    return exceptions.filter(
      (ex) =>
        ex.fullName.toLowerCase().includes(term) ||
        ex.employeeCode.toLowerCase().includes(term) ||
        ex.email.toLowerCase().includes(term) ||
        ex.reason.toLowerCase().includes(term)
    );
  }, [exceptions, searchTerm]);

  // Handle Revoke Exception
  const handleRevoke = async (id: string, employeeName: string) => {
    const confirmRevoke = window.confirm(
      `Are you sure you want to revoke the attendance exception for ${employeeName}? This will re-evaluate their attendance compliance.`
    );
    if (!confirmRevoke) return;

    setRevokingId(id);
    try {
      await revokeException(id);
      fetchExceptionsList();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to revoke exception.';
      alert(msg);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Summary Strip */}
      <ExceptionsHeader exceptions={exceptions} onOpenCreate={() => setIsCreateOpen(true)} />

      {/* 2. Filters Bar */}
      <ExceptionsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeOnly={activeOnly}
        onActiveOnlyToggle={setActiveOnly}
        onRefresh={fetchExceptionsList}
        loading={loading}
      />

      {/* 3. Main Data Table */}
      {loading && <LoadingSpinner message="Loading attendance exceptions..." />}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredExceptions.length === 0 && (
        <EmptyState
          icon={AlertCircle}
          title="No Exceptions Found"
          description={
            searchTerm
              ? `No exception records matched "${searchTerm}".`
              : activeOnly
              ? 'No active attendance overrides are currently in effect.'
              : 'No exception audit history logged in the system.'
          }
        />
      )}

      {!loading && !error && filteredExceptions.length > 0 && (
        <ExceptionsTable
          exceptions={filteredExceptions}
          onRevoke={handleRevoke}
          revokingId={revokingId}
        />
      )}

      {/* 4. Create Exception Modal */}
      <CreateExceptionDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchExceptionsList}
      />
    </div>
  );
}
