import apiClient from "./apiClient";

const endpoint = "/ticket-actions";

export async function getNotes(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/notes`);
}

export async function addNote(ticketId: string, noteData: Record<string, unknown>) {
  return apiClient.post(`${endpoint}/${ticketId}/notes`, noteData);
}

export async function updateNote(ticketId: string, noteId: string, noteData: Record<string, unknown>) {
  return apiClient.put(`${endpoint}/${ticketId}/notes/${noteId}`, noteData);
}

export async function deleteNote(ticketId: string, noteId: string) {
  return apiClient.delete(`${endpoint}/${ticketId}/notes/${noteId}`);
}

export async function getTimeEntries(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/time-entries`);
}

export async function addTimeEntry(ticketId: string, timeEntryData: Record<string, unknown>) {
  return apiClient.post(`${endpoint}/${ticketId}/time-entries`, timeEntryData);
}

export async function updateTimeEntry(ticketId: string, timeEntryId: string, timeEntryData: Record<string, unknown>) {
  return apiClient.put(`${endpoint}/${ticketId}/time-entries/${timeEntryId}`, timeEntryData);
}

export async function deleteTimeEntry(ticketId: string, timeEntryId: string) {
  return apiClient.delete(`${endpoint}/${ticketId}/time-entries/${timeEntryId}`);
}

export async function getTicketHistory(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/history`);
}

export async function getAttachments(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/attachments`);
}

export async function addAttachment(ticketId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`${endpoint}/${ticketId}/attachments`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export async function deleteAttachment(ticketId: string, attachmentId: string) {
  return apiClient.delete(`${endpoint}/${ticketId}/attachments/${attachmentId}`);
}

export async function getAvailableAgents(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/available-agents`);
}

export async function assignTicket(ticketId: string, assignData: Record<string, unknown>) {
  return apiClient.patch(`${endpoint}/${ticketId}/assign`, assignData);
}

export async function updateStatus(ticketId: string, statusData: Record<string, unknown>) {
  return apiClient.patch(`${endpoint}/${ticketId}/status`, statusData);
}

export async function closeTicket(ticketId: string, closeData: Record<string, unknown>) {
  return apiClient.patch(`${endpoint}/${ticketId}/close`, closeData);
}

export async function watchTicket(ticketId: string) {
  return apiClient.post(`${endpoint}/${ticketId}/watch`);
}

export async function unwatchTicket(ticketId: string) {
  return apiClient.post(`${endpoint}/${ticketId}/unwatch`);
}

export async function printTicket(ticketId: string) {
  return apiClient.get(`${endpoint}/${ticketId}/print`);
}

export async function exportTicket(ticketId: string, format: "pdf" | "csv" = "pdf") {
  return apiClient.get(`${endpoint}/${ticketId}/export`, { params: { format } });
}
