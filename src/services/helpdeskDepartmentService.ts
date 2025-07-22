import type { ApiResponse } from "./api"; // Make sure ApiResponse is defined in your api service

export const getHelpdeskDepartmentsSearch = async (params: Record<string, string | number | boolean> = {}) => {
  // api.get returns ApiResponse<T>, so response.data is the array or paginated object
  const response: ApiResponse<any> = await api.get("/helpdesk-departments/with-employees", params);
  // If response.data is an array, return it; if response.data.data is an array, return that
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray((response.data as any).data)) {
    return (response.data as any).data;
  }
  return [];
};
export const getHelpdeskDepartmentsList = async (payload: any) => {
  // api.post returns the paginated response object
  const response = await api.post("/helpdesk-departments/search", payload);
  return response;
};
export const getHelpdeskDepartmentsById = async (id: any) => {
  // api.get returns the paginated response object
  const response = await api.get(`/helpdesk-departments/${id}/with-employees`);
  return response;
};
import type { HelpdeskDepartmentPayload } from "../features/departments/components/HelpdeskDepartmentCreateForm";
import api from "./api";

export const createHelpdeskDepartment = async (payload: HelpdeskDepartmentPayload) => {
  const response = await api.post("/helpdesk-departments/with-employees", payload);
  return response.data;
};
