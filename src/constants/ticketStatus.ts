export const TICKET_STATUS_LABELS = {
  RAISED: "Raised",
  IN_PROGRESS: "In Progress",
  PENDING_APPROVAL: "Pending Approval",
  RESOLVED: "Resolved",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export const TICKET_STATUS_COLORS = {
  RAISED: "#dc3545",
  IN_PROGRESS: "#007bff",
  PENDING_APPROVAL: "#ffc107",
  RESOLVED: "#28a745",
  APPROVED: "#198754",
  REJECTED: "#dc3545",
} as const;

export const TICKET_STATUS_ICONS = {
  RAISED: "FaExclamationCircle",
  IN_PROGRESS: "FaSpinner",
  PENDING_APPROVAL: "FaClock",
  RESOLVED: "FaCheckCircle",
  APPROVED: "FaCheck",
  REJECTED: "FaTimes",
} as const;

export const TICKET_STATUS_ORDER = [
  "RAISED",
  "IN_PROGRESS",
  "PENDING_APPROVAL",
  "APPROVED",
  "RESOLVED",
  "REJECTED",
] as const;
