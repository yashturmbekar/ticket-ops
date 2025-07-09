import { apiService } from "./api";
import type { User, ApiResponse } from "../types";
import { UserRole } from "../types";

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: Date;
  refreshToken: string;
}

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@redfish.com",
    firstName: "Admin",
    lastName: "User",
    role: UserRole.ADMIN,
    department: "IT",
    location: "HQ",
    isActive: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    username: "manager",
    email: "manager@redfish.com",
    firstName: "Manager",
    lastName: "User",
    role: UserRole.MANAGER,
    department: "Operations",
    location: "HQ",
    isActive: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    username: "tech",
    email: "tech@redfish.com",
    firstName: "Tech",
    lastName: "User",
    role: UserRole.IT_STAFF,
    department: "IT",
    location: "HQ",
    isActive: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    username: "employee",
    email: "employee@redfish.com",
    firstName: "Employee",
    lastName: "User",
    role: UserRole.USER,
    department: "Sales",
    location: "HQ",
    isActive: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DEMO_CREDENTIALS = {
  "admin@redfish.com": "admin123",
  "manager@redfish.com": "manager123",
  "tech@redfish.com": "tech123",
  "employee@redfish.com": "employee123",
};

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  location: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export class AuthService {
  private endpoint = "/auth";

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const loginIdentifier = credentials.email || credentials.username;

    // Check if it's a demo login
    if (loginIdentifier && loginIdentifier in DEMO_CREDENTIALS) {
      const expectedPassword =
        DEMO_CREDENTIALS[loginIdentifier as keyof typeof DEMO_CREDENTIALS];

      if (credentials.password === expectedPassword) {
        const user = DEMO_USERS.find((u) => u.email === loginIdentifier);

        if (user) {
          const response: LoginResponse = {
            user,
            token: `demo-token-${user.id}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            refreshToken: `demo-refresh-${user.id}`,
          };

          apiService.setAuthToken(response.token);
          return { success: true, data: response };
        }
      }

      throw new Error("Invalid credentials");
    }

    // For production, use the actual API call
    const response = await apiService.post<LoginResponse>(
      `${this.endpoint}/login`,
      credentials
    );

    if (response.success && response.data) {
      apiService.setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await apiService.post<void>(`${this.endpoint}/logout`);
    } catch (error) {
      // Continue with logout even if server call fails
      console.warn("Logout server call failed:", error);
    }

    apiService.setAuthToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");

    return { success: true, data: undefined };
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return apiService.post<User>(`${this.endpoint}/register`, userData);
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/forgot-password`, { email });
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/reset-password`, {
      token,
      newPassword,
    });
  }

  async changePassword(
    passwords: ChangePasswordRequest
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/change-password`, passwords);
  }

  async refreshToken(): Promise<
    ApiResponse<{ token: string; expiresAt: Date }>
  > {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiService.post<{ token: string; expiresAt: Date }>(
      `${this.endpoint}/refresh`,
      {
        refreshToken,
      }
    );

    if (response.success && response.data) {
      apiService.setAuthToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<User>(`${this.endpoint}/me`);
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiService.put<User>(
      `${this.endpoint}/profile`,
      userData
    );

    if (response.success && response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response;
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/verify-email`, { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/resend-verification`);
  }

  async enable2FA(): Promise<ApiResponse<{ qrCode: string; secret: string }>> {
    return apiService.post<{ qrCode: string; secret: string }>(
      `${this.endpoint}/2fa/enable`
    );
  }

  async verify2FA(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/2fa/verify`, { token });
  }

  async disable2FA(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/2fa/disable`, { token });
  }

  async checkTokenValidity(): Promise<boolean> {
    try {
      const response = await this.getCurrentUser();
      return response.success;
    } catch {
      return false;
    }
  }

  async getSessions(): Promise<
    ApiResponse<
      Array<{
        id: string;
        device: string;
        ip: string;
        location: string;
        lastActivity: Date;
        current: boolean;
      }>
    >
  > {
    return apiService.get<
      Array<{
        id: string;
        device: string;
        ip: string;
        location: string;
        lastActivity: Date;
        current: boolean;
      }>
    >(`${this.endpoint}/sessions`);
  }

  async terminateSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/sessions/${sessionId}`);
  }

  async terminateAllSessions(): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/sessions`);
  }

  // Utility methods
  getStoredUser(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    const user = this.getStoredUser();
    return !!(token && user);
  }

  getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
