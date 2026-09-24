import {
  PastWeeksSummaryResponseDto,
  WeeklyViolatorDto,
  EmployeeDto,
  EmployeeDetailDto,
  EmployeeCalendarDto,
  EmployeeExceptionDto,
  PolicyDto,
  SyncEmployeesResult,
  EvaluateDailyAttendanceResult,
  EvaluateDateRangeResult,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5101/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hrwatch_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const authHeaders = getAuthHeader();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorMsg = `API Error: ${res.status} ${res.statusText}`;
    try {
      const errBody = await res.json();
      if (errBody.errorMessage) errorMsg = errBody.errorMessage;
      else if (errBody.message) errorMsg = errBody.message;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export interface AuthResponseDto {
  userId: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

export async function login(usernameOrEmail: string, password: string): Promise<AuthResponseDto> {
  return fetchJson<AuthResponseDto>(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ usernameOrEmail, password }),
  });
}

// 1. Violations Dashboard APIs
export async function getPastWeeksSummary(weeksCount = 4, designation?: string, searchTerm?: string): Promise<PastWeeksSummaryResponseDto> {
  const params = new URLSearchParams();
  params.append('weeksCount', weeksCount.toString());
  if (designation) params.append('designation', designation);
  if (searchTerm) params.append('searchTerm', searchTerm);

  return fetchJson<PastWeeksSummaryResponseDto>(`${API_BASE_URL}/violations/summary-past-weeks?${params.toString()}`);
}

export async function getWeeklyViolators(weekStartDate?: string, designation?: string, searchTerm?: string): Promise<WeeklyViolatorDto[]> {
  const params = new URLSearchParams();
  if (weekStartDate) params.append('weekStartDate', weekStartDate);
  if (designation) params.append('designation', designation);
  if (searchTerm) params.append('searchTerm', searchTerm);

  return fetchJson<WeeklyViolatorDto[]>(`${API_BASE_URL}/violations/weekly?${params.toString()}`);
}

// 2. Attendance Calendar API
export async function getAttendanceCalendar(startDate: string, endDate: string, searchTerm?: string, designation?: string): Promise<EmployeeCalendarDto[]> {
  const params = new URLSearchParams();
  params.append('startDate', startDate);
  params.append('endDate', endDate);
  if (searchTerm) params.append('searchTerm', searchTerm);
  if (designation) params.append('designation', designation);

  return fetchJson<EmployeeCalendarDto[]>(`${API_BASE_URL}/attendance/calendar?${params.toString()}`);
}

// 3. Employees APIs
export async function getEmployees(searchTerm?: string, designation?: string, isDeployed?: boolean, onlyActive = true): Promise<EmployeeDto[]> {
  const params = new URLSearchParams();
  if (searchTerm) params.append('searchTerm', searchTerm);
  if (designation) params.append('designation', designation);
  if (isDeployed !== undefined) params.append('isDeployed', isDeployed.toString());
  params.append('onlyActive', onlyActive.toString());

  return fetchJson<EmployeeDto[]>(`${API_BASE_URL}/employees?${params.toString()}`);
}

export async function getEmployeeById(id: string): Promise<EmployeeDetailDto> {
  return fetchJson<EmployeeDetailDto>(`${API_BASE_URL}/employees/${id}`);
}

// 4. Exceptions APIs
export async function getExceptions(employeeId?: string, activeOnly = true): Promise<EmployeeExceptionDto[]> {
  const params = new URLSearchParams();
  if (employeeId) params.append('employeeId', employeeId);
  params.append('activeOnly', activeOnly.toString());

  return fetchJson<EmployeeExceptionDto[]>(`${API_BASE_URL}/exceptions?${params.toString()}`);
}

export async function createException(payload: { employeeId: string; fromDate: string; toDate: string; reason: string; createdBy?: string }): Promise<{ exceptionId: string; message: string }> {
  return fetchJson<{ exceptionId: string; message: string }>(`${API_BASE_URL}/exceptions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function revokeException(id: string): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE_URL}/exceptions/${id}`, {
    method: 'DELETE',
  });
}

// 5. Policies APIs
export async function getActivePolicy(): Promise<PolicyDto> {
  return fetchJson<PolicyDto>(`${API_BASE_URL}/policies/active`);
}

export async function getPolicyHistory(): Promise<PolicyDto[]> {
  return fetchJson<PolicyDto[]>(`${API_BASE_URL}/policies/history`);
}

export async function createPolicyVersion(payload: { policyName: string; rulesJson: string; effectiveFrom: string; createdBy?: string }): Promise<{ policyId: string; message: string }> {
  return fetchJson<{ policyId: string; message: string }>(`${API_BASE_URL}/policies/new-version`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 6. Admin Tools APIs
export async function syncEmployees(): Promise<SyncEmployeesResult> {
  return fetchJson<SyncEmployeesResult>(`${API_BASE_URL}/attendance/sync-employees`, {
    method: 'POST',
  });
}

export async function evaluateDailyAttendance(targetDate?: string): Promise<EvaluateDailyAttendanceResult> {
  const url = targetDate ? `${API_BASE_URL}/attendance/evaluate-daily?targetDate=${targetDate}` : `${API_BASE_URL}/attendance/evaluate-daily`;
  return fetchJson<EvaluateDailyAttendanceResult>(url, {
    method: 'POST',
  });
}

export async function evaluateDateRange(startDate: string, endDate: string): Promise<EvaluateDateRangeResult> {
  return fetchJson<EvaluateDateRangeResult>(`${API_BASE_URL}/attendance/evaluate-range?startDate=${startDate}&endDate=${endDate}`, {
    method: 'POST',
  });
}
