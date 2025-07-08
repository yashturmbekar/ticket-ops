import { apiService } from "./api";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export interface UserFilters {
  role?: string;
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export class UserService {
  private endpoint = "/users";

  async getUsers(
    filters?: UserFilters
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    // Filter out undefined values and ensure proper typing
    const cleanFilters = filters
      ? (Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>)
      : undefined;

    return apiService.get<PaginatedResponse<User>>(this.endpoint, cleanFilters);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(`${this.endpoint}/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiService.post<User>(this.endpoint, userData);
  }

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User>> {
    return apiService.put<User>(`${this.endpoint}/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/${id}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  async resetPassword(
    id: string
  ): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return apiService.post<{ temporaryPassword: string }>(
      `${this.endpoint}/${id}/reset-password`
    );
  }

  async updateUserAvatar(
    id: string,
    file: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> {
    return apiService.uploadFile<{ avatarUrl: string }>(
      `${this.endpoint}/${id}/avatar`,
      file
    );
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    return apiService.get<User>(`${this.endpoint}/profile`);
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>(`${this.endpoint}/profile`, userData);
  }

  async getUserPermissions(id: string): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>(`${this.endpoint}/${id}/permissions`);
  }

  async updateUserPermissions(
    id: string,
    permissions: string[]
  ): Promise<ApiResponse<void>> {
    return apiService.put<void>(`${this.endpoint}/${id}/permissions`, {
      permissions,
    });
  }

  async getUsersByRole(role: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(`${this.endpoint}/by-role/${role}`);
  }

  async getUsersByDepartment(department: string): Promise<ApiResponse<User[]>> {
    return apiService.get<User[]>(
      `${this.endpoint}/by-department/${department}`
    );
  }

  async bulkUpdateUsers(
    userIds: string[],
    updates: Partial<User>
  ): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.endpoint}/bulk-update`, {
      userIds,
      updates,
    });
  }

  async bulkDeleteUsers(userIds: string[]): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/bulk-delete`, { userIds });
  }

  async exportUsers(
    format: "csv" | "xlsx" = "csv"
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiService.get<{ downloadUrl: string }>(`${this.endpoint}/export`, {
      format,
    });
  }

  async importUsers(
    file: File
  ): Promise<
    ApiResponse<{ imported: number; failed: number; errors: string[] }>
  > {
    return apiService.uploadFile<{
      imported: number;
      failed: number;
      errors: string[];
    }>(`${this.endpoint}/import`, file);
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
