export const TICKET_STATUS_LABELS = {
  open: "Open",
  in_progress: "In Progress",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
} as const;

export const TICKET_STATUS_COLORS = {
  open: "#dc3545",
  in_progress: "#007bff",
  pending: "#ffc107",
  resolved: "#28a745",
  closed: "#6c757d",
  cancelled: "#17a2b8",
} as const;

export const TICKET_STATUS_ICONS = {
  open: "FaExclamationCircle",
  in_progress: "FaSpinner",
  pending: "FaClock",
  resolved: "FaCheckCircle",
  closed: "FaTimesCircle",
  cancelled: "FaBan",
} as const;

export const TICKET_STATUS_ORDER = [
  "open",
  "in_progress",
  "pending",
  "resolved",
  "closed",
  "cancelled",
] as const;
