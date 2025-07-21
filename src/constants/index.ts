// Application constants
export const APP_NAME = "IT Ticket Management System";
export const APP_VERSION = "1.0.0";
export const COMPANY_NAME = "Your Company";
export const SUPPORT_EMAIL = "support@company.com";

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export const WEBSOCKET_URL =
  import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3000";
export const API_TIMEOUT = 10000; // 10 seconds default
export const UNAUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Pagination
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Theme
export const THEME_STORAGE_KEY = "it-ticket-theme";
export const DEFAULT_THEME = "light";

// Local Storage Keys
export const AUTH_TOKEN_KEY = "it-ticket-auth-token";
export const USER_DATA_KEY = "it-ticket-user-data";
export const PREFERENCES_KEY = "it-ticket-preferences";

// Notification Settings
export const NOTIFICATION_TIMEOUT = 5000;
export const MAX_NOTIFICATIONS = 5;

// WebSocket Events
export const WS_EVENTS = {
  TICKET_CREATED: "ticket.created",
  TICKET_UPDATED: "ticket.updated",
  TICKET_ASSIGNED: "ticket.assigned",
  TICKET_RESOLVED: "ticket.resolved",
  ASSET_UPDATED: "asset.updated",
  USER_ONLINE: "user.online",
  USER_OFFLINE: "user.offline",
  NETWORK_ALERT: "network.alert",
  SYSTEM_ALERT: "system.alert",
} as const;

// Date Formats
export const DATE_FORMATS = {
  FULL: "PPP p",
  SHORT: "MM/dd/yyyy",
  TIME: "HH:mm",
  DATETIME: "MM/dd/yyyy HH:mm",
  ISO: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: "#0066CC",
  SUCCESS: "#28a745",
  WARNING: "#ffc107",
  DANGER: "#dc3545",
  INFO: "#17a2b8",
  LIGHT: "#f8f9fa",
  DARK: "#343a40",
  PURPLE: "#6f42c1",
  PINK: "#e83e8c",
  ORANGE: "#fd7e14",
  YELLOW: "#ffc107",
  GREEN: "#28a745",
  TEAL: "#20c997",
  CYAN: "#17a2b8",
} as const;

// Export individual constants for specific domains
// Note: Importing these individually to avoid module resolution issues
export {
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_ICONS,
  TICKET_STATUS_ORDER,
} from "./ticketStatus.ts";
export {
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  PRIORITY_ICONS,
  PRIORITY_ORDER,
  PRIORITY_WEIGHTS,
  SLA_HOURS,
} from "./priorities.ts";
export {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  USER_ROLE_PERMISSIONS,
  USER_ROLE_DESCRIPTIONS,
} from "./userRoles.ts";
export {
  ASSET_TYPE_LABELS,
  ASSET_TYPE_ICONS,
  ASSET_TYPE_COLORS,
} from "./assetTypes.ts";
export { DEPARTMENTS, DEPARTMENT_COLORS } from "./departments.ts";
export {
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  PERMISSION_CATEGORIES,
} from "./permissions.ts";
