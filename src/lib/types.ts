export type AttendanceStatusCode = 'P' | 'H' | 'L' | 'W' | 'E' | 'A' | 'WO' | '-';

export interface WeeklyViolatorDto {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  designation: string;
  isDeployed: boolean;
  weekStartDate: string;
  weekEndDate: string;
  requiredDays: number;
  actualPresentDays: number;
  leaveDays: number;
  wfhDays: number;
  absentDays: number;
  shortfallDays: number;
  severity: 'Low' | 'Medium' | 'High';
}

export interface WeekCardSummaryDto {
  weekStartDate: string;
  weekEndDate: string;
  weekLabel: string;
  totalViolators: number;
  criticalViolators: number;
  violators: WeeklyViolatorDto[];
}

export interface TopShortfallEmployeeDto {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  designation: string;
  isDeployed: boolean;
  totalShortfallDays: number;
  weeksWithViolations: number;
}

export interface PastWeeksSummaryResponseDto {
  totalWeeksEvaluated: number;
  weeks: WeekCardSummaryDto[];
  topShortfallEmployees: TopShortfallEmployeeDto[];
}

export interface EmployeeDto {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  designation: string;
  isDeployed: boolean;
  isActive: boolean;
  location: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  wfhDays: number;
  exceptionDays: number;
  absentPercentage: number;
  createdAt: string;
}

export interface RecentAttendanceDto {
  date: string;
  dayOfWeek: string;
  status: string;
  leaveType: string | null;
  firstPunchTime: string | null;
}

export interface EmployeeDetailDto {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  designation: string;
  isDeployed: boolean;
  isActive: boolean;
  location: string;
  createdAt: string;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  wfhDays: number;
  exceptionDays: number;
  absentPercentage: number;
  totalExceptionsCount: number;
  recentAttendances: RecentAttendanceDto[];
}

export interface DailyAttendanceStatusDto {
  date: string;
  dayOfWeek: string;
  statusCode: string;
  leaveType: string | null;
  punchTime: string | null;
}

export interface CalendarExceptionDto {
  id: string;
  reason: string;
  fromDate: string;
  toDate: string;
  createdBy: string;
  createdAt: string;
}

export interface EmployeeCalendarDto {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  designation: string;
  isDeployed: boolean;
  days: DailyAttendanceStatusDto[];
  activeExceptions: CalendarExceptionDto[];
}

export interface EmployeeExceptionDto {
  id: string;
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  fromDate: string;
  toDate: string;
  reason: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
}

export interface PolicyDto {
  id: string;
  version: number;
  policyName: string;
  rulesJson: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface SyncEmployeesResult {
  totalFetched?: number;
  employeesCreated?: number;
  employeesUpdated?: number;
  employeesDeactivated?: number;
  syncedAt?: string;
  message?: string;
}

export interface EvaluateDailyAttendanceResult {
  evaluationDate?: string;
  totalActiveEmployees?: number;
  presentCount?: number;
  leaveCount?: number;
  wfhCount?: number;
  exceptionCount?: number;
  absentCount?: number;
  weekendOrHolidayCount?: number;
  evaluatedAt?: string;
  recordsEvaluated?: number;
  message?: string;
}

export interface EvaluateDateRangeResult {
  startDate?: string;
  endDate?: string;
  totalDaysEvaluated?: number;
  dailyResults?: EvaluateDailyAttendanceResult[];
  completedAt?: string;
  message?: string;
}
