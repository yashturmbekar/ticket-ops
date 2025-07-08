// Main services exports
export { apiService } from "./api";
export { authService } from "./authService";
export { userService } from "./userService";
export { ticketService } from "./ticketService";
export { assetService } from "./assetService";

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
