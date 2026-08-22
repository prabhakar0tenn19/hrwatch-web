'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getEmployees } from '@/lib/api';
import { EmployeeDto, EmployeeDetailDto } from '@/lib/types';
import { EmployeesHeader } from '@/components/features/employees/EmployeesHeader';
import { EmployeesFilters } from '@/components/features/employees/EmployeesFilters';
import { EmployeesTable } from '@/components/features/employees/EmployeesTable';
import { EmployeeDetailDrawer } from '@/components/features/employees/EmployeeDetailDrawer';
import { AddExceptionModal } from '@/components/features/calendar/AddExceptionModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { AlertTriangle, Users } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('ALL');
  const [selectedDeployment, setSelectedDeployment] = useState('ALL');

  // Selected Employee for Sliding Drawer & Exception Modal
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isAddExceptionOpen, setIsAddExceptionOpen] = useState(false);
  const [exceptionTarget, setExceptionTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees();
      setEmployees(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch employee records.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filtered Roster Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchTerm ||
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDesignation =
        selectedDesignation === 'ALL' ||
        emp.designation.toLowerCase().includes(selectedDesignation.toLowerCase());

      const matchesDeployment =
        selectedDeployment === 'ALL' ||
        (selectedDeployment === 'DEPLOYED' && emp.isDeployed) ||
        (selectedDeployment === 'BENCH' && !emp.isDeployed);

      return matchesSearch && matchesDesignation && matchesDeployment;
    });
  }, [employees, searchTerm, selectedDesignation, selectedDeployment]);

  const handleOpenAddExceptionFromDrawer = (emp: EmployeeDetailDto) => {
    setExceptionTarget({ id: emp.id, name: emp.fullName });
    setIsAddExceptionOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary KPI Strip */}
      <EmployeesHeader employees={employees} />

      {/* 2. Filter & Search Controls */}
      <EmployeesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDesignation={selectedDesignation}
        onDesignationChange={setSelectedDesignation}
        selectedDeployment={selectedDeployment}
        onDeploymentChange={setSelectedDeployment}
      />

      {/* 3. Main Data Table Area */}
      {loading && <LoadingSpinner message="Loading employee directory..." />}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredEmployees.length === 0 && (
        <EmptyState
          icon={Users}
          title="No Employees Found"
          description={`No active employee records matched "${searchTerm}". Try resetting filters.`}
        />
      )}

      {!loading && !error && filteredEmployees.length > 0 && (
        <EmployeesTable
          employees={filteredEmployees}
          onSelectEmployee={(emp) => setSelectedEmployeeId(emp.id)}
        />
      )}

      {/* 4. Sliding Profile Detail Drawer */}
      <EmployeeDetailDrawer
        employeeId={selectedEmployeeId}
        onClose={() => setSelectedEmployeeId(null)}
        onOpenAddException={handleOpenAddExceptionFromDrawer}
      />

      {/* 5. Add Exception Modal */}
      {exceptionTarget && (
        <AddExceptionModal
          isOpen={isAddExceptionOpen}
          onClose={() => {
            setIsAddExceptionOpen(false);
            setExceptionTarget(null);
          }}
          defaultEmployeeId={exceptionTarget.id}
          defaultEmployeeName={exceptionTarget.name}
          onSuccess={() => {
            fetchEmployees();
            setSelectedEmployeeId(null);
          }}
        />
      )}
    </div>
  );
}
