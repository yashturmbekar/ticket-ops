import { UserRole } from "../types";

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  requiredRoles: UserRole[];
  children?: NavigationItem[];
  description?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
    requiredRoles: [
      UserRole.EMPLOYEE,
      UserRole.MANAGER,
      UserRole.HR,
      UserRole.CXO,
      UserRole.ORG_ADMIN,
    ],
    description: "Main dashboard overview",
  },
  {
    path: "/tickets",
    label: "Tickets",
    icon: "ticket",
    requiredRoles: [
      UserRole.EMPLOYEE,
      UserRole.MANAGER,
      UserRole.HR,
      UserRole.CXO,
      UserRole.ORG_ADMIN,
    ],
    description: "IT support tickets",
    children: [
      {
        path: "/tickets/my",
        label: "My Tickets",
        requiredRoles: [
          UserRole.EMPLOYEE,
          UserRole.MANAGER,
          UserRole.HR,
          UserRole.CXO,
          UserRole.ORG_ADMIN,
        ],
      },
      {
        path: "/tickets/create",
        label: "Create Ticket",
        requiredRoles: [
          UserRole.EMPLOYEE,
          UserRole.MANAGER,
          UserRole.HR,
          UserRole.CXO,
          UserRole.ORG_ADMIN,
        ],
      },
      {
        path: "/tickets/assigned",
        label: "Assigned to Me",
        requiredRoles: [UserRole.ORG_ADMIN, UserRole.MANAGER],
      },
      {
        path: "/tickets/all",
        label: "All Tickets",
        requiredRoles: [UserRole.ORG_ADMIN, UserRole.MANAGER],
      },
    ],
  },
  {
    path: "/assets",
    label: "Assets",
    icon: "inventory",
    requiredRoles: [UserRole.ORG_ADMIN],
    description: "IT asset management",
  },
  {
    path: "/users",
    label: "Users",
    icon: "people",
    requiredRoles: [UserRole.HR, UserRole.ORG_ADMIN],
    description: "User management",
  },
  {
    path: "/departments",
    label: "Departments",
    icon: "business",
    requiredRoles: [UserRole.ORG_ADMIN, UserRole.HR],
    description: "Department management",
  },
  {
    path: "/employees",
    label: "Employees",
    icon: "badge",
    requiredRoles: [UserRole.HR, UserRole.ORG_ADMIN, UserRole.CXO],
    description: "Employee records and management",
  },
  {
    path: "/team",
    label: "Team Management",
    icon: "group",
    requiredRoles: [UserRole.MANAGER, UserRole.CXO],
    description: "Team performance and management",
  },
  {
    path: "/performance",
    label: "Performance",
    icon: "trending_up",
    requiredRoles: [UserRole.MANAGER, UserRole.HR, UserRole.CXO],
    description: "Performance evaluations and reviews",
  },
  {
    path: "/payroll",
    label: "Payroll",
    icon: "payments",
    requiredRoles: [UserRole.HR, UserRole.ORG_ADMIN],
    description: "Payroll and compensation management",
  },
  {
    path: "/sla",
    label: "SLA Management",
    icon: "schedule",
    requiredRoles: [UserRole.ORG_ADMIN, UserRole.MANAGER],
    description: "Service level agreement tracking",
  },
  {
    path: "/escalations",
    label: "Escalations",
    icon: "priority_high",
    requiredRoles: [UserRole.MANAGER, UserRole.ORG_ADMIN],
    description: "Ticket escalation management",
  },
  {
    path: "/knowledge",
    label: "Knowledge Base",
    icon: "library_books",
    requiredRoles: [
      UserRole.EMPLOYEE,
      UserRole.MANAGER,
      UserRole.HR,
      UserRole.CXO,
      UserRole.ORG_ADMIN,
    ],
    description: "Self-service documentation",
  },
  {
    path: "/reports",
    label: "Reports",
    icon: "assessment",
    requiredRoles: [UserRole.CXO, UserRole.MANAGER, UserRole.ORG_ADMIN],
    description: "Analytics and reporting",
    children: [
      {
        path: "/reports/tickets",
        label: "Ticket Reports",
        requiredRoles: [UserRole.CXO, UserRole.MANAGER, UserRole.ORG_ADMIN],
      },
      {
        path: "/analytics",
        label: "Business Analytics",
        requiredRoles: [UserRole.CXO, UserRole.ORG_ADMIN],
      },
      {
        path: "/budget",
        label: "Budget & Finance",
        requiredRoles: [UserRole.CXO, UserRole.ORG_ADMIN],
      },
    ],
  },
  {
    path: "/network",
    label: "Network",
    icon: "router",
    requiredRoles: [UserRole.ORG_ADMIN],
    description: "Network monitoring and management",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "settings",
    requiredRoles: [UserRole.ORG_ADMIN, UserRole.CXO],
    description: "System configuration",
  },
];

// Role-specific dashboard mappings
export const roleDashboards: Record<UserRole, string> = {
  [UserRole.EMPLOYEE]: "/dashboard",
  [UserRole.MANAGER]: "/dashboard/manager",
  [UserRole.HR]: "/dashboard/hr",
  [UserRole.CXO]: "/dashboard/executive",
  [UserRole.ORG_ADMIN]: "/dashboard",
};

export class NavigationService {
  /**
   * Get navigation items filtered by user roles
   */
  static getNavigationForRole(userRole: UserRole): NavigationItem[] {
    return navigationItems
      .filter((item) => item.requiredRoles.includes(userRole))
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) =>
          child.requiredRoles.includes(userRole)
        ),
      }));
  }

  /**
   * Get navigation items filtered by multiple roles
   */
  static getNavigationForRoles(userRoles: UserRole[]): NavigationItem[] {
    return navigationItems
      .filter((item) =>
        item.requiredRoles.some((role) => userRoles.includes(role))
      )
      .map((item) => ({
        ...item,
        children: item.children?.filter((child) =>
          child.requiredRoles.some((role) => userRoles.includes(role))
        ),
      }));
  }

  /**
   * Check if user has access to a specific path
   */
  static hasAccessToPath(userRole: UserRole, path: string): boolean {
    const findItemByPath = (
      items: NavigationItem[],
      targetPath: string
    ): NavigationItem | null => {
      for (const item of items) {
        if (item.path === targetPath) {
          return item;
        }
        if (item.children) {
          const found = findItemByPath(item.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItemByPath(navigationItems, path);
    return item ? item.requiredRoles.includes(userRole) : false;
  }

  /**
   * Get default dashboard path for user role
   */
  static getDefaultDashboard(userRole: UserRole): string {
    return roleDashboards[userRole] || "/dashboard";
  }

  /**
   * Get role-specific features
   */
  static getRoleFeatures(userRole: UserRole): string[] {
    const features: Record<UserRole, string[]> = {
      [UserRole.EMPLOYEE]: [
        "Create tickets",
        "View my tickets",
        "Access knowledge base",
        "View company directory",
      ],
      [UserRole.MANAGER]: [
        "Team management",
        "Performance reviews",
        "Team reports",
        "Escalation handling",
        "Budget oversight",
      ],
      [UserRole.HR]: [
        "Employee management",
        "Payroll administration",
        "Performance tracking",
        "User account management",
        "Department oversight",
      ],
      [UserRole.CXO]: [
        "Executive dashboard",
        "Business analytics",
        "Strategic reports",
        "Budget and finance",
        "Company-wide oversight",
      ],
      [UserRole.ORG_ADMIN]: [
        "Organization management",
        "System configuration",
        "User administration",
        "Department management",
        "Asset oversight",
        "Network monitoring",
        "System settings",
      ],
    };

    return features[userRole] || [];
  }

  /**
   * Get quick actions for user role
   */
  static getQuickActions(
    userRole: UserRole
  ): Array<{ label: string; path: string; icon?: string }> {
    const actions: Record<
      UserRole,
      Array<{ label: string; path: string; icon?: string }>
    > = {
      [UserRole.EMPLOYEE]: [
        { label: "Create Ticket", path: "/tickets/create", icon: "add" },
        { label: "My Tickets", path: "/tickets/my", icon: "list" },
        { label: "Knowledge Base", path: "/knowledge", icon: "help" },
      ],
      [UserRole.MANAGER]: [
        {
          label: "Team Dashboard",
          path: "/dashboard/manager",
          icon: "dashboard",
        },
        {
          label: "Team Performance",
          path: "/performance",
          icon: "trending_up",
        },
        { label: "Team Management", path: "/team", icon: "group" },
        { label: "Reports", path: "/reports", icon: "assessment" },
      ],
      [UserRole.HR]: [
        { label: "HR Dashboard", path: "/dashboard/hr", icon: "dashboard" },
        { label: "Employee Records", path: "/employees", icon: "badge" },
        { label: "Payroll", path: "/payroll", icon: "payments" },
        { label: "Performance Reviews", path: "/performance", icon: "star" },
      ],
      [UserRole.CXO]: [
        {
          label: "Executive Dashboard",
          path: "/dashboard/executive",
          icon: "dashboard",
        },
        { label: "Business Analytics", path: "/analytics", icon: "analytics" },
        { label: "Budget & Finance", path: "/budget", icon: "account_balance" },
        { label: "Strategic Reports", path: "/reports", icon: "assessment" },
      ],
      [UserRole.ORG_ADMIN]: [
        { label: "Organization Settings", path: "/settings", icon: "settings" },
        {
          label: "Department Management",
          path: "/departments",
          icon: "business",
        },
        { label: "User Administration", path: "/users", icon: "people" },
        { label: "Asset Management", path: "/assets", icon: "inventory" },
        { label: "Network Monitoring", path: "/network", icon: "router" },
      ],
    };

    return actions[userRole] || [];
  }
}

export default NavigationService;
