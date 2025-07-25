import apiClient from "./apiClient";

// Simplified types (customize as needed)
export interface TicketFilters {
  status?: string;
  priority?: string;
  assignedDepartmentId?: string;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  dateRange?: { start: string; end: string };
  slaOverdue?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | { start: string; end: string }
    | undefined;
}

const endpoint = "/helpdesk-tickets";

export async function getTickets(filters?: TicketFilters) {
  const params = filters
    ? Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      )
    : undefined;
  return apiClient.get(endpoint, { params });
}

export async function getTicketById(id: string) {
  return apiClient.get(`${endpoint}/details/${id}`);
}

export async function createTicket(ticketData: Record<string, unknown>) {
  // Use specialized retry method for tickets with attachments
  if (
    ticketData.attachments &&
    Array.isArray(ticketData.attachments) &&
    ticketData.attachments.length > 0
  ) {
    console.log("Creating ticket with attachments - using retry logic");
    return apiClient.postWithFiles("/helpdesk-tickets", ticketData, 3);
  }
  return apiClient.post("/helpdesk-tickets", ticketData);
}

export async function updateTicket(ticketData: Record<string, unknown>) {
  console.log("Updating ticket with full object:", ticketData);
  return apiClient.put(`${endpoint}`, ticketData);
}

export async function deleteTicket(id: string) {
  return apiClient.delete(`${endpoint}/${id}`);
}

export async function assignTicket(id: string, assignedTo: string) {
  return apiClient.patch(`${endpoint}/${id}/assign`, { assignedTo });
}

export async function approveTicket(ticketData: Record<string, unknown>) {
  return apiClient.post("/helpdesk-tickets/approve", ticketData);
}

export async function rejectTicket(ticketData: Record<string, unknown>) {
  return apiClient.post(`${endpoint}/reject`, ticketData);
}

export async function closeTicket(ticketData: Record<string, unknown>) {
  return apiClient.post(`${endpoint}/close`, ticketData);
}

export async function searchTickets(
  searchData: Record<string, unknown>,
  page = 0,
  size = 10,
  sort = "id,desc"
) {
  return apiClient.post(
    `${endpoint}/search?page=${page}&size=${size}&sort=${sort}`,
    searchData
  );
}

export async function searchMyTickets(
  searchData: Record<string, unknown>,
  page = 0,
  size = 10,
  sort = "id,desc"
) {
  return apiClient.post(
    `${endpoint}/my-tickets/search?page=${page}&size=${size}&sort=${sort}`,
    searchData
  );
}

export async function searchAssignedTickets(
  searchData: Record<string, unknown>,
  page = 0,
  size = 10,
  sort = "id,desc"
) {
  return apiClient.post(
    `${endpoint}/assigned/search?page=${page}&size=${size}&sort=${sort}`,
    searchData
  );
}

export async function reopenTicket(id: string, reason?: string) {
  return apiClient.patch(`${endpoint}/${id}/reopen`, { reason });
}

export async function addComment(ticketId: string, comment: string) {
  return apiClient.post(`/helpdesk-ticket-comments`, {
    id: null,
    ticketId: ticketId,
    comment: comment,
    commenterEmployeeId: null,
    isDeleted: false,
  });
}

export async function getTicketComments(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/comments`);
}

export async function updateComment(
  ticketId: string,
  commentId: string,
  content: string,
  commenterEmployeeId?: number
) {
  return apiClient.put(`/helpdesk-ticket-comments`, {
    id: commentId,
    ticketId: ticketId,
    comment: content,
    commenterEmployeeId: commenterEmployeeId,
    isDeleted: false,
  });
}

export async function deleteComment(ticketId: string, commentId: string) {
  return apiClient.delete(`${endpoint}/${ticketId}/comments/${commentId}`);
}

export async function uploadAttachment(file: File, commentId: string) {
  // Convert File to byte array
  const fileData = await new Promise<number[]>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(Array.from(uint8Array)); // convert Uint8Array to number[]
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const payload = {
    id: null,
    commentId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileData, // byte array (number[])
  };

  return apiClient.post(`/helpdesk/ticket-attachments`, payload, {
    headers: { "Content-Type": "application/json" },
  });
}

export async function deleteAttachment(ticketId: string, attachmentId: string) {
  return apiClient.delete(
    `${endpoint}/${ticketId}/attachments/${attachmentId}`
  );
}

export async function rateTicket(
  id: string,
  rating: number,
  feedback?: string
) {
  return apiClient.post(`${endpoint}/${id}/rate`, { rating, feedback });
}

export async function getTicketHistory(id: string) {
  return apiClient.get(`${endpoint}/${id}/history`);
}

export async function getMyTickets() {
  return apiClient.get(`${endpoint}/my-tickets/search`);
}

export async function getAssignedTickets() {
  return apiClient.get(`${endpoint}/assigned-to-me`);
}

export async function getOverdueTickets() {
  return apiClient.get(`${endpoint}/overdue`);
}

export async function getTicketsByPriority(priority: string) {
  return apiClient.get(`${endpoint}/by-priority/${priority}`);
}

export async function getTicketsByCategory(category: string) {
  return apiClient.get(`${endpoint}/by-category/${category}`);
}

export async function bulkAssignTickets(
  ticketIds: string[],
  assignedTo: string
) {
  return apiClient.patch(`${endpoint}/bulk-assign`, { ticketIds, assignedTo });
}

export async function bulkCloseTickets(
  ticketIds: string[],
  resolution?: string
) {
  return apiClient.patch(`${endpoint}/bulk-close`, { ticketIds, resolution });
}

export async function exportTickets(
  filters?: TicketFilters,
  format: "csv" | "xlsx" = "csv"
) {
  const params = {
    ...(filters
      ? Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== undefined)
        )
      : {}),
    format,
  };
  return apiClient.get(`${endpoint}/export`, { params });
}

export async function getTicketStats() {
  return apiClient.get(`${endpoint}/stats`);
}
