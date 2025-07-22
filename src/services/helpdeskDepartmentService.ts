import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import apiClient from "./apiClient";

export interface HelpdeskDepartment {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createHelpdeskDepartment = async (
  payload: HelpdeskDepartmentPayload
) => {
  const response = await apiClient.post(
    "/helpdesk-departments/with-employees",
    payload
  );
  return response.data;
};

export const searchHelpdeskDepartments = async (query?: string) => {
  const params = query ? { search: query } : {};
  const response = await apiClient.post("/helpdesk-departments/search", {
    params,
  });
  return response.data;
};
