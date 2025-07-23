import { UserRole, Permission } from "../types";

export const USER_ROLE_LABELS = {
  [UserRole.CXO]: "Chief Executive Officer",
  [UserRole.ORG_ADMIN]: "Organization Administrator",
  [UserRole.MANAGER]: "Manager",
  [UserRole.HR]: "Human Resources",
  [UserRole.EMPLOYEE]: "Employee",
} as const;

export const USER_ROLE_COLORS = {
  [UserRole.CXO]: "#8b5cf6", // Purple - Executive level
  [UserRole.ORG_ADMIN]: "#dc3545", // Red - Admin level
  [UserRole.MANAGER]: "#6f42c1", // Violet - Management level
  [UserRole.HR]: "#17a2b8", // Teal - HR specialization
  [UserRole.EMPLOYEE]: "#28a745", // Green - Employee level
} as const;

export const USER_ROLE_PERMISSIONS = {
  [UserRole.CXO]: [
    // Executive level - Full access for strategic oversight
    Permission.TICKET_VIEW,
    Permission.ASSET_VIEW,
    Permission.USER_VIEW,
    Permission.DEPARTMENT_VIEW,
    Permission.DEPARTMENT_CREATE,
    Permission.DEPARTMENT_UPDATE,
    Permission.DEPARTMENT_DELETE,
    Permission.KNOWLEDGE_VIEW,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EXPORT,
    Permission.ADMIN_SETTINGS,
    Permission.ADMIN_USERS,
  ],
  [UserRole.ORG_ADMIN]: [
    // Organization administration - Full system management
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.TICKET_UPDATE,
    Permission.TICKET_DELETE,
    Permission.TICKET_ASSIGN,
    Permission.TICKET_RESOLVE,
    Permission.ASSET_CREATE,
    Permission.ASSET_VIEW,
    Permission.ASSET_UPDATE,
    Permission.ASSET_DELETE,
    Permission.USER_CREATE,
    Permission.USER_VIEW,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.DEPARTMENT_CREATE,
    Permission.DEPARTMENT_VIEW,
    Permission.DEPARTMENT_UPDATE,
    Permission.DEPARTMENT_DELETE,
    Permission.KNOWLEDGE_CREATE,
    Permission.KNOWLEDGE_VIEW,
    Permission.KNOWLEDGE_UPDATE,
    Permission.KNOWLEDGE_DELETE,
    Permission.KNOWLEDGE_PUBLISH,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EXPORT,
    Permission.NETWORK_VIEW,
    Permission.NETWORK_MANAGE,
    Permission.ADMIN_SETTINGS,
    Permission.ADMIN_USERS,
    Permission.ADMIN_SYSTEM,
  ],
  [UserRole.MANAGER]: [
    // Department/team management
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.TICKET_UPDATE,
    Permission.TICKET_ASSIGN,
    Permission.ASSET_VIEW,
    Permission.USER_VIEW,
    Permission.DEPARTMENT_VIEW,
    Permission.KNOWLEDGE_VIEW,
    Permission.KNOWLEDGE_CREATE,
    Permission.KNOWLEDGE_UPDATE,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EXPORT,
  ],
  [UserRole.HR]: [
    // Human resources management
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.USER_CREATE,
    Permission.USER_VIEW,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.DEPARTMENT_VIEW,
    Permission.DEPARTMENT_UPDATE,
    Permission.KNOWLEDGE_VIEW,
    Permission.KNOWLEDGE_CREATE,
    Permission.KNOWLEDGE_UPDATE,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
  ],
  [UserRole.EMPLOYEE]: [
    // Basic employee access
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.ASSET_VIEW,
    Permission.KNOWLEDGE_VIEW,
  ],
} as const;

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.CXO]:
    "Executive level access with strategic oversight and reporting capabilities",
  [UserRole.ORG_ADMIN]:
    "Full organizational administration with system management capabilities",
  [UserRole.MANAGER]:
    "Department and team management with reporting and oversight access",
  [UserRole.HR]:
    "Human resources management with employee administration capabilities",
  [UserRole.EMPLOYEE]:
    "Basic employee access with ticket creation and knowledge base viewing",
} as const;
