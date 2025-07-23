import apiClient from "./apiClient";
import { Permission } from "../types";

export interface RolePermission {
  id: string;
  roleName: string;
  permissionsList: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionsResponse {
  status: number;
  body: {
    items: RolePermission[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

/**
 * Get role and permissions from the backend
 * @returns Promise<RolePermissionsResponse>
 */
export const getRoleAndPermissions =
  async (): Promise<RolePermissionsResponse> => {
    try {
      const response = await apiClient.get("/api/roles-permissions");

      return {
        status: response.status,
        body: response.data,
        message: response.data.message || "Success",
      };
    } catch (error: unknown) {
      console.error("Error fetching role and permissions:", error);

      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };

      // Return error response with appropriate status
      return {
        status: axiosError.response?.status || 500,
        body: {
          items: [],
          total: 0,
          page: 1,
          limit: 10,
        },
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to fetch role permissions",
      };
    }
  };

/**
 * Create a new role with permissions
 * @param roleData - Role and permissions data
 * @returns Promise<RolePermissionsResponse>
 */
export const createRoleWithPermissions = async (roleData: {
  roleName: string;
  permissionsList: Permission[];
}): Promise<RolePermissionsResponse> => {
  try {
    const response = await apiClient.post("/api/roles-permissions", roleData);

    return {
      status: response.status,
      body: response.data,
      message: response.data.message || "Role created successfully",
    };
  } catch (error: unknown) {
    console.error("Error creating role:", error);

    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };

    return {
      status: axiosError.response?.status || 500,
      body: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      },
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to create role",
    };
  }
};

/**
 * Update role permissions
 * @param roleId - Role ID
 * @param roleData - Updated role data
 * @returns Promise<RolePermissionsResponse>
 */
export const updateRolePermissions = async (
  roleId: string,
  roleData: {
    roleName?: string;
    permissionsList: Permission[];
  }
): Promise<RolePermissionsResponse> => {
  try {
    const response = await apiClient.put(
      `/api/roles-permissions/${roleId}`,
      roleData
    );

    return {
      status: response.status,
      body: response.data,
      message: response.data.message || "Role updated successfully",
    };
  } catch (error: unknown) {
    console.error("Error updating role:", error);

    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };

    return {
      status: axiosError.response?.status || 500,
      body: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      },
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to update role",
    };
  }
};

/**
 * Delete a role
 * @param roleId - Role ID
 * @returns Promise<RolePermissionsResponse>
 */
export const deleteRole = async (
  roleId: string
): Promise<RolePermissionsResponse> => {
  try {
    const response = await apiClient.delete(`/api/roles-permissions/${roleId}`);

    return {
      status: response.status,
      body: response.data,
      message: response.data.message || "Role deleted successfully",
    };
  } catch (error: unknown) {
    console.error("Error deleting role:", error);

    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
    };

    return {
      status: axiosError.response?.status || 500,
      body: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      },
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to delete role",
    };
  }
};
