import { UserRole } from "../types";

export interface RoleNavigationItem {
  path: string;
  label: string;
  icon?: string;
  isImplemented: boolean;
  description?: string;
}

// Define role-specific navigation items with implementation status
export const roleNavigationConfig: Record<UserRole, RoleNavigationItem[]> = {
  [UserRole.EMPLOYEE]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
    },
    { path: "/tickets", label: "Tickets", icon: "ticket", isImplemented: true },
  ],

  [UserRole.MANAGER]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
      description: "Dashboard with stats of my tickets and assigned tickets",
    },
    {
      path: "/tickets",
      label: "Tickets",
      icon: "ticket",
      isImplemented: true,
      description: "My tickets and assigned tickets",
    },
  ],

  [UserRole.HR]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
    },
    { path: "/tickets", label: "Tickets", icon: "ticket", isImplemented: true },
    { path: "/users", label: "Users", icon: "people", isImplemented: true },
  ],

  [UserRole.CXO]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
    },
    { path: "/tickets", label: "Tickets", icon: "ticket", isImplemented: true },
    {
      path: "/reports",
      label: "Reports",
      icon: "assessment",
      isImplemented: true,
    },
    { path: "/users", label: "Users", icon: "people", isImplemented: true },
  ],

  [UserRole.ORG_ADMIN]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
      description: "Dashboard with stats and all tickets",
    },
    {
      path: "/tickets",
      label: "Tickets",
      icon: "ticket",
      isImplemented: true,
      description: "All tickets with subtabs: all tickets, department view",
    },
    {
      path: "/departments",
      label: "Departments",
      icon: "business",
      isImplemented: true,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: "assessment",
      isImplemented: true,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: "settings",
      isImplemented: true,
    },
  ],

  [UserRole.HELPDESK_DEPARTMENT]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
      description: "Dashboard with My Tickets and recent assigned tickets",
    },
    {
      path: "/tickets",
      label: "Tickets",
      icon: "ticket",
      isImplemented: true,
      description: "My tickets and assigned tickets",
    },
  ],

  [UserRole.HELPDESK_ADMIN]: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "dashboard",
      isImplemented: true,
      description: "Dashboard with stats and all tickets",
    },
    {
      path: "/tickets",
      label: "Tickets",
      icon: "ticket",
      isImplemented: true,
      description: "All tickets with subtabs: all tickets, department view",
    },
    {
      path: "/departments",
      label: "Departments",
      icon: "business",
      isImplemented: true,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: "assessment",
      isImplemented: true,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: "settings",
      isImplemented: true,
    },
  ],
};

export class RoleBasedNavigationService {
  /**
   * Get navigation items for a specific role, filtering out unimplemented items
   */
  static getNavigationForRole(
    userRole: UserRole,
    showUnimplemented = false
  ): RoleNavigationItem[] {
    const roleNavigation = roleNavigationConfig[userRole] || [];

    if (showUnimplemented) {
      return roleNavigation;
    }

    return roleNavigation.filter((item) => item.isImplemented);
  }

  /**
   * Check if user has access to a specific path
   */
  static hasAccessToPath(userRole: UserRole, path: string): boolean {
    const roleNavigation = roleNavigationConfig[userRole] || [];
    return roleNavigation.some(
      (item) => item.path === path && item.isImplemented
    );
  }

  /**
   * Get role-specific quick actions
   */
  static getQuickActionsForRole(
    userRole: UserRole
  ): Array<{ label: string; path: string; icon?: string }> {
    const roleActions: Record<
      UserRole,
      Array<{ label: string; path: string; icon?: string }>
    > = {
      [UserRole.EMPLOYEE]: [
        { label: "Create Ticket", path: "/tickets/create", icon: "add" },
        { label: "My Tickets", path: "/tickets/my", icon: "list" },
      ],
      [UserRole.MANAGER]: [
        { label: "My Dashboard", path: "/dashboard", icon: "dashboard" },
        { label: "My Tickets", path: "/tickets/my", icon: "list" },
        {
          label: "Assigned Tickets",
          path: "/tickets/assigned",
          icon: "assignment",
        },
      ],
      [UserRole.HR]: [
        { label: "Employee Records", path: "/employees", icon: "badge" },
        { label: "Create Ticket", path: "/tickets/create", icon: "add" },
      ],
      [UserRole.CXO]: [
        {
          label: "Executive Dashboard",
          path: "/dashboard/executive",
          icon: "dashboard",
        },
        { label: "Business Analytics", path: "/analytics", icon: "analytics" },
      ],
      [UserRole.ORG_ADMIN]: [
        { label: "Dashboard Stats", path: "/dashboard", icon: "dashboard" },
        { label: "All Tickets", path: "/tickets", icon: "list" },
        { label: "Departments", path: "/departments", icon: "business" },
        { label: "Reports", path: "/reports", icon: "assessment" },
        { label: "Settings", path: "/settings", icon: "settings" },
      ],
      [UserRole.HELPDESK_DEPARTMENT]: [
        { label: "My Dashboard", path: "/dashboard", icon: "dashboard" },
        { label: "My Tickets", path: "/tickets/my", icon: "list" },
        {
          label: "Assigned Tickets",
          path: "/tickets/assigned",
          icon: "assignment",
        },
      ],
      [UserRole.HELPDESK_ADMIN]: [
        { label: "Dashboard Stats", path: "/dashboard", icon: "dashboard" },
        { label: "All Tickets", path: "/tickets", icon: "list" },
        { label: "Departments", path: "/departments", icon: "business" },
        { label: "Reports", path: "/reports", icon: "assessment" },
        { label: "Settings", path: "/settings", icon: "settings" },
      ],
    };

    return roleActions[userRole] || [];
  }
}

export default RoleBasedNavigationService;
