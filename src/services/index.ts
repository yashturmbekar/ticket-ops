// Main services exports (explicit, no conflicts)
export {
  // Auth
  login,
  register,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  updateProfile,
} from "./authService";

export {
  // SLA
  SlaService,
} from "./slaService";

export {
  // User
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus,
  resetUserPassword,
  getEmployeeProfile,
} from "./userService";

export {
  // Ticket
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  closeTicket,
  reopenTicket,
  addComment as addTicketComment,
  getTicketComments,
  updateComment as updateTicketComment,
  deleteComment as deleteTicketComment,
  uploadAttachment as uploadTicketAttachment,
  deleteAttachment as deleteTicketAttachment,
  rateTicket,
  getTicketHistory,
  getMyTickets,
  getAssignedTickets,
  getOverdueTickets,
  getTicketsByPriority,
  getTicketsByCategory,
  bulkAssignTickets,
  bulkCloseTickets,
  exportTickets,
  getTicketStats,
  searchTickets,
  searchMyTickets,
} from "./ticketService";

export {
  // Ticket Actions (aliased to avoid conflicts)
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  getTimeEntries,
  addTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  getTicketHistory as getTicketActionHistory,
  getAttachments as getTicketActionAttachments,
  addAttachment as addTicketActionAttachment,
  deleteAttachment as deleteTicketActionAttachment,
  getAvailableAgents,
  assignTicket as assignTicketAction,
  updateStatus,
  closeTicket as closeTicketAction,
  watchTicket,
  unwatchTicket,
  printTicket,
  exportTicket,
} from "./ticketActionsService";

export {
  // Asset
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  uploadAssetAttachment,
  deleteAssetAttachment,
  getAssetHistory,
  exportAssets,
} from "./assetService";

export {
  // Knowledge
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  addComment as addKnowledgeComment,
  getComments as getKnowledgeComments,
  updateComment as updateKnowledgeComment,
  deleteComment as deleteKnowledgeComment,
  uploadAttachment as uploadKnowledgeAttachment,
  deleteAttachment as deleteKnowledgeAttachment,
  getStats as getKnowledgeStats,
} from "./knowledgeService";

export {
  // Network
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  assignDevice,
  uploadDeviceAttachment,
  deleteDeviceAttachment,
  getDeviceHistory,
  exportDevices,
} from "./networkService";

export {
  // Reports
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  exportReports,
} from "./reportsService";

export {
  // WebSocket
  connect,
  disconnect,
  send,
  on,
  off,
} from "./websocketService";

export {
  // Helpdesk Departments
  createHelpdeskDepartment,
  searchHelpdeskDepartments,
} from "./helpdeskDepartmentService";

// Re-export types that still exist
export type { UserFilters } from "./userService";
export type { TicketFilters } from "./ticketService";
export type { AssetFilters } from "./assetService";
export type { KnowledgeSearchParams } from "./knowledgeService";
export type { ReportFilters } from "./reportsService";
export type { HelpdeskDepartment } from "./helpdeskDepartmentService";
