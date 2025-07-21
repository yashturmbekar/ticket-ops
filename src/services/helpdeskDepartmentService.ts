import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import api from "./api";

export const createHelpdeskDepartment = async (payload: HelpdeskDepartmentPayload) => {
  const response = await api.post("/helpdesk-departments/with-employees", payload);
  return response.data;
};
