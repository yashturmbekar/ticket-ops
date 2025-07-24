import apiClient from "./apiClient";

export interface AssetFilters {
  type?: string;
  status?: string;
  assignedTo?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

const endpoint = "/assets";

export async function getAssets(filters?: AssetFilters) {
  const params = filters
    ? Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      )
    : undefined;
  return apiClient.get(endpoint, { params });
}

export async function getAssetById(id: string) {
  return apiClient.get(`${endpoint}/${id}`);
}

export async function createAsset(assetData: Record<string, unknown>) {
  return apiClient.post(endpoint, assetData);
}

export async function updateAsset(
  id: string,
  assetData: Record<string, unknown>
) {
  return apiClient.put(`${endpoint}/${id}`, assetData);
}

export async function deleteAsset(id: string) {
  return apiClient.delete(`${endpoint}/${id}`);
}

export async function assignAsset(id: string, assignedTo: string) {
  return apiClient.patch(`${endpoint}/${id}/assign`, { assignedTo });
}

export async function uploadAssetAttachment(assetId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`${endpoint}/${assetId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteAssetAttachment(
  assetId: string,
  attachmentId: string
) {
  return apiClient.delete(`${endpoint}/${assetId}/attachments/${attachmentId}`);
}

export async function getAssetHistory(id: string) {
  return apiClient.get(`${endpoint}/${id}/history`);
}

export async function exportAssets(
  filters?: AssetFilters,
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
