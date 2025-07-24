// Core TypeScript types for the IT ticket management system

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  manager?: string;
  phone?: string;
  location: string;
  isActive: boolean;
  lastLogin?: Date;
  permissions: Permission[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Employee Profile interface for homepage API
export interface EmployeeProfile {
  id: number;
  employeeName: string;
  designation: string;
  profilePic?: string;
  profilePicContentType?: string;
  timesheetForCurrentWeekend: unknown[];
  locationId: number;
}

// API Response interfaces to match backend structure
export interface ApiTicketResponse {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  ticketCode: string;
  assignedDepartmentName: string;
  priority: Priority;
  raisedByEmployeeId: number;
  raiserEmployeeDetails: {
    employeeName: string;
    id: number;
    profilePic?: string;
    profilePicContentType?: string;
    designation: string;
  };
  assignedDepartmentId: string;
  assignedToEmployeeId?: number;
  assignedToEmployeeDetails?: {
    employeeName: string;
    id: number;
    profilePic?: string;
    profilePicContentType?: string;
    designation: string;
  };
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
  comment?: string;
  ticketCommentDTO?: Record<string, unknown>;
  attachments?: Record<string, unknown>[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignedDepartmentId: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  slaDeadline: Date;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  estimatedHours?: number;
  actualHours?: number;
  satisfactionRating?: number;
  requesterEmail?: string;
  requesterPhone?: string;
  location?: string;
  assignedDepartmentName?: string;
  totalCommentsCount?: number;
  category?: Category;
  asset?: string; // Asset ID
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
  location: string;
  assignedTo?: string;
  status: AssetStatus;
  value: number;
  depreciation?: number;
  specifications: Record<string, unknown>;
  maintenanceHistory: MaintenanceRecord[];
  purchaseOrder?: string;
  vendor?: string;
  description?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

export interface TicketNote {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

export interface TimeEntry {
  id: string;
  ticketId: string;
  userId: string;
  hours: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  changes: Record<string, { from: unknown; to: unknown }>;
  createdAt: Date;
}

export interface TicketLink {
  id: string;
  ticketId: string;
  linkedTicketId: string;
  linkType:
    | "duplicate"
    | "related"
    | "blocks"
    | "blocked_by"
    | "parent"
    | "child";
  description?: string;
  createdAt: Date;
  createdBy: string;
}

export interface TicketStats {
  id: string;
  ticketId: string;
  totalTimeSpent: number;
  responseTime: number;
  resolutionTime: number;
  slaCompliance: boolean;
  escalationCount: number;
  reopenCount: number;
  satisfactionScore?: number;
  updatedAt: Date;
}

export interface SlaInfo {
  id: string;
  ticketId: string;
  responseDeadline: Date;
  resolutionDeadline: Date;
  responseTime?: number;
  resolutionTime?: number;
  isResponseBreached: boolean;
  isResolutionBreached: boolean;
  breachReason?: string;
  updatedAt: Date;
}

export interface WebSocketEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
}

export interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  authorId: string;
  status: ArticleStatus;
  tags: string[];
  isPublic: boolean;
  viewCount: number;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  version: number;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  performedBy?: string;
  cost?: number;
  notes?: string;
  status: MaintenanceStatus;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: DeviceType;
  ipAddress: string;
  macAddress?: string;
  location: string;
  status: DeviceStatus;
  lastSeen: Date;
  uptime?: number;
  responseTime?: number;
  description?: string;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  configBackupDate?: Date;
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  description: string;
  parameters: Record<string, unknown>;
  schedule?: ReportSchedule;
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  isPublic: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

// Enums and constants
export const UserRole = {
  CXO: "CXO",
  HR: "HR",
  EMPLOYEE: "EMPLOYEE",
  MANAGER: "MANAGER",
  ORG_ADMIN: "ORG-ADMIN",
  HELPDESK_DEPARTMENT: "HELPDESK-DEPARTMENT",
  HELPDESK_ADMIN: "HELPDESK-ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const TicketStatus = {
  RAISED: "RAISED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  RESOLVED: "RESOLVED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const Category = {
  HARDWARE: "hardware",
  SOFTWARE: "software",
  NETWORK: "network",
  ACCESS: "access",
  EMAIL: "email",
  PHONE: "phone",
  PRINTER: "printer",
  MOBILE: "mobile",
  OTHER: "other",
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const AssetType = {
  DESKTOP: "desktop",
  LAPTOP: "laptop",
  SERVER: "server",
  NETWORK_DEVICE: "network_device",
  PRINTER: "printer",
  PHONE: "phone",
  TABLET: "tablet",
  MONITOR: "monitor",
  SOFTWARE: "software",
  LICENSE: "license",
  OTHER: "other",
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];

export const AssetStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  MAINTENANCE: "maintenance",
  DISPOSED: "disposed",
  LOST: "lost",
  STOLEN: "stolen",
} as const;

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];

export const ArticleStatus = {
  DRAFT: "draft",
  REVIEW: "review",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];

export const MaintenanceType = {
  PREVENTIVE: "preventive",
  CORRECTIVE: "corrective",
  EMERGENCY: "emergency",
} as const;

export type MaintenanceType =
  (typeof MaintenanceType)[keyof typeof MaintenanceType];

export const MaintenanceStatus = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type MaintenanceStatus =
  (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus];

export const DeviceType = {
  ROUTER: "router",
  SWITCH: "switch",
  FIREWALL: "firewall",
  ACCESS_POINT: "access_point",
  SERVER: "server",
  PRINTER: "printer",
  OTHER: "other",
} as const;

export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];

export const DeviceStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  WARNING: "warning",
  CRITICAL: "critical",
  UNKNOWN: "unknown",
} as const;

export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus];

export const ReportType = {
  TICKET_SUMMARY: "ticket_summary",
  ASSET_INVENTORY: "asset_inventory",
  USER_ACTIVITY: "user_activity",
  SLA_PERFORMANCE: "sla_performance",
  NETWORK_STATUS: "network_status",
  CUSTOM: "custom",
} as const;

export type ReportType = (typeof ReportType)[keyof typeof ReportType];

export const NotificationType = {
  TICKET_ASSIGNED: "ticket_assigned",
  TICKET_UPDATED: "ticket_updated",
  TICKET_RESOLVED: "ticket_resolved",
  ASSET_MAINTENANCE: "asset_maintenance",
  NETWORK_ALERT: "network_alert",
  SYSTEM_ALERT: "system_alert",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const Permission = {
  // Ticket permissions
  TICKET_CREATE: "ticket_create",
  TICKET_VIEW: "ticket_view",
  TICKET_UPDATE: "ticket_update",
  TICKET_DELETE: "ticket_delete",
  TICKET_ASSIGN: "ticket_assign",
  TICKET_RESOLVE: "ticket_resolve",

  // Asset permissions
  ASSET_CREATE: "asset_create",
  ASSET_VIEW: "asset_view",
  ASSET_UPDATE: "asset_update",
  ASSET_DELETE: "asset_delete",

  // User permissions
  USER_CREATE: "user_create",
  USER_VIEW: "user_view",
  USER_UPDATE: "user_update",
  USER_DELETE: "user_delete",

  // Department permissions
  DEPARTMENT_CREATE: "department_create",
  DEPARTMENT_VIEW: "department_view",
  DEPARTMENT_UPDATE: "department_update",
  DEPARTMENT_DELETE: "department_delete",

  // Knowledge permissions
  KNOWLEDGE_CREATE: "knowledge_create",
  KNOWLEDGE_VIEW: "knowledge_view",
  KNOWLEDGE_UPDATE: "knowledge_update",
  KNOWLEDGE_DELETE: "knowledge_delete",
  KNOWLEDGE_PUBLISH: "knowledge_publish",

  // Report permissions
  REPORT_VIEW: "report_view",
  REPORT_CREATE: "report_create",
  REPORT_EXPORT: "report_export",

  // Network permissions
  NETWORK_VIEW: "network_view",
  NETWORK_MANAGE: "network_manage",

  // Admin permissions
  ADMIN_SETTINGS: "admin_settings",
  ADMIN_USERS: "admin_users",
  ADMIN_SYSTEM: "admin_system",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface ReportSchedule {
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  hour: number;
  minute: number;
  isEnabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  avgResolutionTime: number;
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
  totalUsers: number;
  activeUsers: number;
  networkDevices: number;
  onlineDevices: number;
}

// Request types for API calls
export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  manager?: string;
  phone?: string;
  location: string;
  password: string;
  permissions?: Permission[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  department?: string;
  manager?: string;
  phone?: string;
  location?: string;
  isActive?: boolean;
  permissions?: Permission[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  assignedTo?: string;
  tags?: string[];
  attachments?: File[];
  requesterEmail?: string;
  requesterPhone?: string;
  location?: string;
  asset?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: Priority;
  category?: Category;
  assignedTo?: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  location?: string;
  asset?: string;
}

export interface CreateAssetRequest {
  name: string;
  type: AssetType;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
  location: string;
  assignedTo?: string;
  value: number;
  specifications?: Record<string, unknown>;
  purchaseOrder?: string;
  vendor?: string;
  description?: string;
  notes?: string;
}

export interface UpdateAssetRequest {
  name?: string;
  type?: AssetType;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  location?: string;
  assignedTo?: string;
  status?: AssetStatus;
  value?: number;
  specifications?: Record<string, unknown>;
  purchaseOrder?: string;
  vendor?: string;
  description?: string;
  notes?: string;
}

export interface CreateKnowledgeArticleRequest {
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdateKnowledgeArticleRequest {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: string;
  tags?: string[];
  isPublic?: boolean;
  status?: ArticleStatus;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  status?: string[];
  priority?: string[];
  category?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface AppConfig {
  companyName: string;
  appName: string;
  version: string;
  apiUrl: string;
  websocketUrl: string;
  supportEmail: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  defaultTicketPriority: Priority;
  defaultTicketCategory: Category;
  slaHours: Record<Priority, number>;
  theme: ThemeConfig;
  features: {
    networkMonitoring: boolean;
    assetManagement: boolean;
    knowledgeBase: boolean;
    reporting: boolean;
    mobileApp: boolean;
    emailIntegration: boolean;
    ldapIntegration: boolean;
    ssoIntegration: boolean;
  };
}
