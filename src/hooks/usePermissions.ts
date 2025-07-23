import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { Permission, UserRole } from "../types";
import { AUTH_TOKEN_KEY } from "../constants";

interface DecodedToken {
  id: string;
  email: string;
  role: UserRole;
  rolePermissions?: {
    role: UserRole;
    permissions?: Permission[];
  };
  isPaid?: boolean;
  iat: number;
  exp: number;
}

export interface UsePermissionsReturn {
  permissions: Permission[];
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  refreshPermissions: () => Promise<void>;
  isSubscriptionActive: boolean;
}

/**
 * Hook for managing user permissions and role-based access
 * Similar to the logic in your provided App.tsx example
 */
export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

  /**
   * Fetch and set permissions from API based on user role
   */
  const fetchRoleAndPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Check for token existence
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        console.warn("No token found. Skipping role and permission retrieval.");
        setIsLoading(false);
        return;
      }

      // 2. Decode token to get user role
      const decodedToken: DecodedToken = jwtDecode(token);
      const role = decodedToken?.rolePermissions?.role || decodedToken?.role;

      setUserRole(role);
      setIsSubscriptionActive(!!decodedToken?.isPaid);

      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const tokenPermissions =
            decodedToken?.rolePermissions?.permissions || [];
          setPermissions(tokenPermissions);
        }
      } catch (tokenError) {
        console.error(
          "Error decoding token for fallback permissions:",
          tokenError
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (permissionList: Permission[]): boolean => {
      return permissionList.some((permission) =>
        permissions.includes(permission)
      );
    },
    [permissions]
  );

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback(
    (permissionList: Permission[]): boolean => {
      return permissionList.every((permission) =>
        permissions.includes(permission)
      );
    },
    [permissions]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return userRole === role;
    },
    [userRole]
  );

  /**
   * Refresh permissions from server
   */
  const refreshPermissions = useCallback(async (): Promise<void> => {
    await fetchRoleAndPermissions();
  }, [fetchRoleAndPermissions]);

  // Fetch permissions on component mount
  useEffect(() => {
    fetchRoleAndPermissions();
  }, [fetchRoleAndPermissions]);

  return {
    permissions,
    userRole,
    isLoading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    refreshPermissions,
    isSubscriptionActive,
  };
};
