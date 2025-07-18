import apiClient from "./apiClient";

export interface NetworkFilters {
  status?: string;
  type?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

const endpoint = "/network";

export async function getDevices(filters?: NetworkFilters) {
  const params = filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) : undefined;
  return apiClient.get(endpoint, { params });
}

export async function getDeviceById(id: string) {
  return apiClient.get(`${endpoint}/${id}`);
}

export async function createDevice(deviceData: Record<string, unknown>) {
  return apiClient.post(endpoint, deviceData);
}

export async function updateDevice(id: string, deviceData: Record<string, unknown>) {
  return apiClient.put(`${endpoint}/${id}`, deviceData);
}

export async function deleteDevice(id: string) {
  return apiClient.delete(`${endpoint}/${id}`);
}

export async function assignDevice(id: string, assignedTo: string) {
  return apiClient.patch(`${endpoint}/${id}/assign`, { assignedTo });
}

export async function uploadDeviceAttachment(deviceId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`${endpoint}/${deviceId}/attachments`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export async function deleteDeviceAttachment(deviceId: string, attachmentId: string) {
  return apiClient.delete(`${endpoint}/${deviceId}/attachments/${attachmentId}`);
}

export async function getDeviceHistory(id: string) {
  return apiClient.get(`${endpoint}/${id}/history`);
}

export async function bulkUpdateDevices(deviceIds: string[], updates: Record<string, unknown>) {
  return apiClient.patch(`${endpoint}/bulk-update`, { deviceIds, updates });
}

export async function exportDevices(filters?: NetworkFilters, format: "csv" | "xlsx" = "csv") {
  const params = { ...(filters ? Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined)) : {}), format };
  return apiClient.get(`${endpoint}/export`, { params });
}
