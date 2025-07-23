import apiClient from "./apiClient";
import type { EmployeeProfile } from "../types";

export interface UserFilters {
  role?: string;
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

const endpoint = "/users";

export async function getUsers(filters?: UserFilters) {
  const params = filters
    ? Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      )
    : undefined;
  return apiClient.get(endpoint, { params });
}

export async function getUserById(id: string) {
  return apiClient.get(`${endpoint}/${id}`);
}

export async function createUser(userData: Record<string, unknown>) {
  return apiClient.post(endpoint, userData);
}

export async function updateUser(
  id: string,
  userData: Record<string, unknown>
) {
  return apiClient.put(`${endpoint}/${id}`, userData);
}

export async function deleteUser(id: string) {
  return apiClient.delete(`${endpoint}/${id}`);
}

export async function changeUserStatus(id: string, status: string) {
  return apiClient.patch(`${endpoint}/${id}/status`, { status });
}

export async function resetUserPassword(id: string, newPassword: string) {
  return apiClient.patch(`${endpoint}/${id}/reset-password`, { newPassword });
}

export async function getEmployeeProfile(): Promise<EmployeeProfile> {
  return await apiClient.get("/homepage/employee-profile");
}
