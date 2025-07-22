import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import apiClient from "./apiClient";

export const createHelpdeskDepartment = async (payload: HelpdeskDepartmentPayload) => {
  const response = await apiClient.post("/helpdesk-departments/with-employees", payload);
  return response.data;
};
