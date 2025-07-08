import { Priority } from "../types";

export const PRIORITY_LABELS = {
  [Priority.LOW]: "Low",
  [Priority.MEDIUM]: "Medium",
  [Priority.HIGH]: "High",
  [Priority.CRITICAL]: "Critical",
} as const;

export const PRIORITY_COLORS = {
  [Priority.LOW]: "#28a745",
  [Priority.MEDIUM]: "#ffc107",
  [Priority.HIGH]: "#fd7e14",
  [Priority.CRITICAL]: "#dc3545",
} as const;

export const PRIORITY_ICONS = {
  [Priority.LOW]: "FaArrowDown",
  [Priority.MEDIUM]: "FaMinus",
  [Priority.HIGH]: "FaArrowUp",
  [Priority.CRITICAL]: "FaExclamationTriangle",
} as const;

export const PRIORITY_ORDER = [
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.CRITICAL,
] as const;

export const PRIORITY_WEIGHTS = {
  [Priority.LOW]: 1,
  [Priority.MEDIUM]: 2,
  [Priority.HIGH]: 3,
  [Priority.CRITICAL]: 4,
} as const;

export const SLA_HOURS = {
  [Priority.LOW]: 72,
  [Priority.MEDIUM]: 48,
  [Priority.HIGH]: 24,
  [Priority.CRITICAL]: 4,
} as const;
