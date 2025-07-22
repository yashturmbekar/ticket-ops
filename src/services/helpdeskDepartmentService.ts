import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import apiClient from "./apiClient";

export interface HelpdeskDepartment {
  id: string;
  name: string;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
  organizationId: number;
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
  const response = await apiClient.get("/helpdesk-departments/all", {
    params,
  });
  return response;
};
