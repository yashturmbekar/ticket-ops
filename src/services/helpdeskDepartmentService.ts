import apiClient from "./apiClient";

export interface HelpdeskDepartmentPayload {
  department: {
    name: string;
    isActive: boolean;
  };
  employees: {
    employeeId: number;
    isActive: boolean;
  }[];
}

export interface HelpdeskDepartment {
  id: string;
  name: string;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
  organizationId: number;
  employees?: Employee[];
}

export interface Employee {
  id: number;
  employeeName: string;
  email: string;
  designation: string;
  isActive: boolean;
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

export const updateHelpdeskDepartment = async (
  id: string,
  payload: HelpdeskDepartmentPayload
) => {
  const response = await apiClient.put(
    `/helpdesk-departments/${id}/with-employees`,
    payload
  );
  return response.data;
};

export const deleteHelpdeskDepartment = async (id: string) => {
  const response = await apiClient.delete(`/helpdesk-departments/${id}`);
  return response.data;
};

export const toggleDepartmentStatus = async (id: string, isActive: boolean) => {
  const response = await apiClient.patch(`/helpdesk-departments/${id}/status`, {
    isActive,
  });
  return response.data;
};

export const removeEmployeeFromDepartment = async (
  departmentId: string,
  employeeId: number
) => {
  const response = await apiClient.delete(
    `/helpdesk-departments/${departmentId}/employees/${employeeId}`
  );
  return response.data;
};

export const toggleEmployeeStatus = async (
  departmentId: string,
  employeeId: number,
  isActive: boolean
) => {
  const response = await apiClient.patch(
    `/helpdesk-departments/${departmentId}/employees/${employeeId}/status`,
    { isActive }
  );
  return response.data;
};
