import { UserRole, Permission } from "../types";

export const USER_ROLE_LABELS = {
  [UserRole.ADMIN]: "Administrator",
  [UserRole.IT_STAFF]: "IT Staff",
  [UserRole.MANAGER]: "Manager",
  [UserRole.USER]: "User",
} as const;

export const USER_ROLE_COLORS = {
  [UserRole.ADMIN]: "#dc3545",
  [UserRole.IT_STAFF]: "#007bff",
  [UserRole.MANAGER]: "#6f42c1",
  [UserRole.USER]: "#28a745",
} as const;

export const USER_ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    // All permissions for admin
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
  [UserRole.IT_STAFF]: [
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.TICKET_UPDATE,
    Permission.TICKET_ASSIGN,
    Permission.TICKET_RESOLVE,
    Permission.ASSET_CREATE,
    Permission.ASSET_VIEW,
    Permission.ASSET_UPDATE,
    Permission.USER_VIEW,
    Permission.KNOWLEDGE_CREATE,
    Permission.KNOWLEDGE_VIEW,
    Permission.KNOWLEDGE_UPDATE,
    Permission.KNOWLEDGE_PUBLISH,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EXPORT,
    Permission.NETWORK_VIEW,
  ],
  [UserRole.MANAGER]: [
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.TICKET_UPDATE,
    Permission.TICKET_ASSIGN,
    Permission.ASSET_VIEW,
    Permission.USER_VIEW,
    Permission.KNOWLEDGE_VIEW,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EXPORT,
  ],
  [UserRole.USER]: [
    Permission.TICKET_CREATE,
    Permission.TICKET_VIEW,
    Permission.ASSET_VIEW,
    Permission.KNOWLEDGE_VIEW,
  ],
} as const;

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.ADMIN]: "Full system access and administration capabilities",
  [UserRole.IT_STAFF]:
    "IT support staff with ticket and asset management access",
  [UserRole.MANAGER]: "Department managers with reporting and oversight access",
  [UserRole.USER]: "End users with basic ticket creation and viewing access",
} as const;
