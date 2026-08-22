'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getPastWeeksSummary } from '@/lib/api';
import { PastWeeksSummaryResponseDto } from '@/lib/types';
import { ViolatorsHeader } from '@/components/features/violations/ViolatorsHeader';
import { ViolatorsKpiCards } from '@/components/features/violations/ViolatorsKpiCards';
import { ViolatorsFilters } from '@/components/features/violations/ViolatorsFilters';
import { PastWeeksList } from '@/components/features/violations/PastWeeksList';
import { TopShortfallWidget } from '@/components/features/violations/TopShortfallWidget';
import { SkeletonKpiCards, SkeletonAccordionList } from '@/components/common/SkeletonLoader';
import { EmptyState } from '@/components/common/EmptyState';
import { AlertTriangle } from 'lucide-react';

export default function WeeklyViolatorsPage() {
  const [data, setData] = useState<PastWeeksSummaryResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('ALL');
  const [weeksCount, setWeeksCount] = useState(4);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});

  // Data Fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPastWeeksSummary(weeksCount);
      setData(res);
      if (res.weeks.length > 0) {
        setExpandedWeeks({ [res.weeks[0].weekStartDate]: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch violators summary.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [weeksCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Accordion Toggle
  const toggleWeekExpand = (weekStartDate: string) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekStartDate]: !prev[weekStartDate],
    }));
  };

  // Filter Logic
  const filteredWeeks = useMemo(() => {
    if (!data) return [];

    return data.weeks.map((week) => {
      const filteredViolators = week.violators.filter((v) => {
        const matchesSearch =
          !searchTerm ||
          v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDesig =
          selectedDesignation === 'ALL' ||
          v.designation.toLowerCase().includes(selectedDesignation.toLowerCase());

        return matchesSearch && matchesDesig;
      });

      return {
        ...week,
        violators: filteredViolators,
        filteredCount: filteredViolators.length,
      };
    });
  }, [data, searchTerm, selectedDesignation]);

  // KPI Metrics Calculation
  const currentWeekViolatorsCount = filteredWeeks.length > 0 ? filteredWeeks[0].violators.length : 0;
  const criticalViolationsCount =
    filteredWeeks.length > 0
      ? filteredWeeks[0].violators.filter((v) => v.shortfallDays >= 3 || v.severity === 'High').length
      : 0;

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!data || !filteredWeeks.length) return;

    const rows: string[] = [
      'Week Start,Week End,Employee Code,Full Name,Email,Designation,Deployed,Required Days,Present Days,Absent/Shortfall Days,Severity',
    ];

    filteredWeeks.forEach((week) => {
      week.violators.forEach((v) => {
        rows.push(
          `"${week.weekStartDate}","${week.weekEndDate}","${v.employeeCode}","${v.fullName}","${v.email}","${v.designation}","${
            v.isDeployed ? 'Yes' : 'Bench'
          }",${v.requiredDays},${v.actualPresentDays},${v.shortfallDays},"${v.severity}"`
        );
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HRWatch_Weekly_Violators_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Primary/Secondary Actions */}
      <ViolatorsHeader loading={loading} onRefresh={fetchData} onExport={handleExportCSV} />

      {/* 2. Top Summary KPI Cards (with Skeleton Loading) */}
      {loading && !data ? (
        <SkeletonKpiCards />
      ) : (
        <ViolatorsKpiCards
          currentWeekViolatorsCount={currentWeekViolatorsCount}
          criticalViolationsCount={criticalViolationsCount}
          totalWeeksEvaluated={data?.totalWeeksEvaluated || weeksCount}
        />
      )}

      {/* 3. Search & Filter Bar */}
      <ViolatorsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDesignation={selectedDesignation}
        onDesignationChange={setSelectedDesignation}
        weeksCount={weeksCount}
        onWeeksCountChange={setWeeksCount}
      />

      {/* 4. Main Content 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Columns: Multi-Week Accordion Cards */}
        <div className="lg:col-span-8 space-y-4">
          {loading && !data && <SkeletonAccordionList />}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && filteredWeeks.length === 0 && (
            <EmptyState
              title="100% Policy Compliant!"
              description="No attendance shortfall or policy violators found for the selected criteria."
            />
          )}

          {filteredWeeks.length > 0 && (
            <PastWeeksList
              weeks={filteredWeeks}
              expandedWeeks={expandedWeeks}
              onToggleExpand={toggleWeekExpand}
            />
          )}
        </div>

        {/* Right 4 Columns: Top 5 Shortfall Employees Leaderboard */}
        <div className="lg:col-span-4">
          <TopShortfallWidget
            topEmployees={data?.topShortfallEmployees || []}
            weeksCount={weeksCount}
          />
        </div>
      </div>
    </div>
  );
}
