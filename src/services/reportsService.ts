import apiClient from "./apiClient";

export interface ReportFilters {
  type?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  createdBy?: string;
  dateRange?: { start: string; end: string };
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | { start: string; end: string } | undefined;
}

const endpoint = "/reports";

export async function getReports(filters?: ReportFilters) {
  const params = filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) : undefined;
  return apiClient.get(endpoint, { params });
}

export async function getReportById(id: string) {
  return apiClient.get(`${endpoint}/${id}`);
}

export async function createReport(reportData: Record<string, unknown>) {
  return apiClient.post(endpoint, reportData);
}

export async function updateReport(id: string, reportData: Record<string, unknown>) {
  return apiClient.put(`${endpoint}/${id}`, reportData);
}

export async function deleteReport(id: string) {
  return apiClient.delete(`${endpoint}/${id}`);
}

export async function exportReports(filters?: ReportFilters, format: "csv" | "xlsx" = "csv") {
  const params = { ...(filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) : {}), format };
  return apiClient.get(`${endpoint}/export`, { params });
}
