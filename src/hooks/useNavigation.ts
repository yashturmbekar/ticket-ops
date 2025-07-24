import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { usePermissions } from "./usePermissions";
import { NavigationService } from "../services/navigationService";
import RoleBasedNavigationService from "../services/roleBasedNavigation";
import type { NavigationItem } from "../services/navigationService";
import { UserRole } from "../types";

export interface UseNavigationResult {
  navigationItems: NavigationItem[];
  quickActions: Array<{ label: string; path: string; icon?: string }>;
  defaultDashboard: string;
  roleFeatures: string[];
  hasAccessToPath: (path: string) => boolean;
  isLoading: boolean;
}

export const useNavigation = (): UseNavigationResult => {
  const { user } = useAuth();
  const { isLoading: permissionsLoading } = usePermissions();

  const userRole = user?.role || UserRole.EMPLOYEE;

  // Use role-based navigation that filters implemented items
  const navigationItems = useMemo(() => {
    if (permissionsLoading) return [];

    // Get role-specific navigation items
    const roleBasedItems =
      RoleBasedNavigationService.getNavigationForRole(userRole);

    // Convert to NavigationItem format for compatibility
    return roleBasedItems.map((item) => ({
      path: item.path,
      label: item.label,
      icon: item.icon,
      requiredRoles: [userRole],
      description: item.description,
    }));
  }, [userRole, permissionsLoading]);

  const quickActions = useMemo(() => {
    if (permissionsLoading) return [];
    return RoleBasedNavigationService.getQuickActionsForRole(userRole);
  }, [userRole, permissionsLoading]);

  const defaultDashboard = useMemo(() => {
    return NavigationService.getDefaultDashboard(userRole);
  }, [userRole]);

  const roleFeatures = useMemo(() => {
    if (permissionsLoading) return [];
    return NavigationService.getRoleFeatures(userRole);
  }, [userRole, permissionsLoading]);

  const hasAccessToPath = useMemo(() => {
    return (path: string) => {
      if (permissionsLoading) return false;
      return RoleBasedNavigationService.hasAccessToPath(userRole, path);
    };
  }, [userRole, permissionsLoading]);

  return {
    navigationItems,
    quickActions,
    defaultDashboard,
    roleFeatures,
    hasAccessToPath,
    isLoading: permissionsLoading,
  };
};

export default useNavigation;
