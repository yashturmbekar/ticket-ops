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
  id: string;
  helpdeskDepartmentId: string;
  employeeId: number;
  employeeProfilePicNameDTO: {
    employeeName: string;
    id: number;
    profilePic: string;
    profilePicContentType: string;
    designation: string;
  };
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
}

export interface DepartmentWithEmployeesResponse {
  department: {
    id: string;
    name: string;
    isActive: boolean;
    createdDate: string;
    lastModifiedDate: string;
  };
  employees: Employee[];
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

export const getAllHelpdeskDepartments = async (query?: string) => {
  const params = query ? { search: query } : {};
  const response = await apiClient.get("/helpdesk-departments/all", {
    params,
  });
  return response;
};

export const getHelpdeskDepartmentWithEmployees = async (
  id: string
): Promise<DepartmentWithEmployeesResponse> => {
  const response = await apiClient.get(
    `/helpdesk-departments/${id}/with-employees`
  );
  return response;
};

export const searchHelpdeskDepartments = async (
  searchData: Record<string, unknown>,
  page = 0,
  size = 10,
  sort = "id,desc"
) => {
  return apiClient.post(
    `/helpdesk-departments/search?page=${page}&size=${size}&sort=${sort}`,
    searchData
  );
};

export const updateHelpdeskDepartment = async (
  payload: HelpdeskDepartmentPayload
) => {
  const response = await apiClient.put(`/helpdesk-departments`, payload);
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
