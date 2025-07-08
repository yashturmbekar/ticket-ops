// Main services exports
export { apiService } from "./api";
export { authService } from "./authService";
export { userService } from "./userService";
export { ticketService } from "./ticketService";
export { ticketActionsService } from "./ticketActionsService";
export { assetService } from "./assetService";
export { knowledgeService } from "./knowledgeService";
export { networkService } from "./networkService";
export { reportsService } from "./reportsService";
export { websocketService } from "./websocketService";

// Re-export types
export type { ApiResponse, PaginatedResponse, ApiError } from "./api";
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "./authService";
export type { UserFilters } from "./userService";
export type { TicketFilters } from "./ticketService";
export type { AssetFilters } from "./assetService";
export type { KnowledgeSearchParams, KnowledgeStats } from "./knowledgeService";
export type {
  NetworkAlert,
  NetworkMetrics,
  NetworkScanResult,
} from "./networkService";
export type {
  ReportFilter,
  ReportData,
  DashboardWidget,
} from "./reportsService";
export type {
  WebSocketEventType,
  WebSocketMessage,
  WebSocketEventHandler,
} from "./websocketService";
