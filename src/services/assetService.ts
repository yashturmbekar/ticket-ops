import { apiService } from "./api";
import type {
  Asset,
  CreateAssetRequest,
  UpdateAssetRequest,
  MaintenanceRecord,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export interface AssetFilters {
  type?: string;
  status?: string;
  location?: string;
  assignedTo?: string;
  manufacturer?: string;
  model?: string;
  search?: string;
  warrantyStatus?: "active" | "expired" | "expiring-soon";
  purchaseDateRange?: {
    start: string;
    end: string;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  page?: number;
  limit?: number;
  [key: string]:
    | string
    | number
    | boolean
    | { start: string; end: string }
    | { min: number; max: number }
    | undefined;
}

export class AssetService {
  private endpoint = "/assets";

  async getAssets(
    filters?: AssetFilters
  ): Promise<ApiResponse<PaginatedResponse<Asset>>> {
    const cleanFilters = filters
      ? (Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>)
      : undefined;

    return apiService.get<PaginatedResponse<Asset>>(
      this.endpoint,
      cleanFilters
    );
  }

  async getAssetById(id: string): Promise<ApiResponse<Asset>> {
    return apiService.get<Asset>(`${this.endpoint}/${id}`);
  }

  async createAsset(
    assetData: CreateAssetRequest
  ): Promise<ApiResponse<Asset>> {
    return apiService.post<Asset>(this.endpoint, assetData);
  }

  async updateAsset(
    id: string,
    assetData: UpdateAssetRequest
  ): Promise<ApiResponse<Asset>> {
    return apiService.put<Asset>(`${this.endpoint}/${id}`, assetData);
  }

  async deleteAsset(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  async assignAsset(id: string, userId: string): Promise<ApiResponse<Asset>> {
    return apiService.patch<Asset>(`${this.endpoint}/${id}/assign`, { userId });
  }

  async unassignAsset(id: string): Promise<ApiResponse<Asset>> {
    return apiService.patch<Asset>(`${this.endpoint}/${id}/unassign`, {});
  }

  async addMaintenanceRecord(
    assetId: string,
    record: Omit<MaintenanceRecord, "id" | "assetId">
  ): Promise<ApiResponse<MaintenanceRecord>> {
    return apiService.post<MaintenanceRecord>(
      `${this.endpoint}/${assetId}/maintenance`,
      record
    );
  }

  async getMaintenanceHistory(
    assetId: string
  ): Promise<ApiResponse<MaintenanceRecord[]>> {
    return apiService.get<MaintenanceRecord[]>(
      `${this.endpoint}/${assetId}/maintenance`
    );
  }

  async updateMaintenanceRecord(
    assetId: string,
    recordId: string,
    updates: Partial<MaintenanceRecord>
  ): Promise<ApiResponse<MaintenanceRecord>> {
    return apiService.put<MaintenanceRecord>(
      `${this.endpoint}/${assetId}/maintenance/${recordId}`,
      updates
    );
  }

  async deleteMaintenanceRecord(
    assetId: string,
    recordId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      `${this.endpoint}/${assetId}/maintenance/${recordId}`
    );
  }

  async getAssetsByType(type: string): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>(`${this.endpoint}/by-type/${type}`);
  }

  async getAssetsByLocation(location: string): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>(`${this.endpoint}/by-location/${location}`);
  }

  async getAssetsByUser(userId: string): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>(`${this.endpoint}/by-user/${userId}`);
  }

  async getExpiringWarranties(
    days: number = 30
  ): Promise<ApiResponse<Asset[]>> {
    return apiService.get<Asset[]>(`${this.endpoint}/expiring-warranties`, {
      days,
    });
  }

  async getAssetDepreciation(id: string): Promise<
    ApiResponse<{
      currentValue: number;
      depreciationRate: number;
      depreciationSchedule: Array<{
        year: number;
        value: number;
        depreciation: number;
      }>;
    }>
  > {
    return apiService.get<{
      currentValue: number;
      depreciationRate: number;
      depreciationSchedule: Array<{
        year: number;
        value: number;
        depreciation: number;
      }>;
    }>(`${this.endpoint}/${id}/depreciation`);
  }

  async generateAssetReport(
    type: "inventory" | "depreciation" | "warranty" | "maintenance",
    filters?: AssetFilters
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const cleanFilters = filters
      ? (Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>)
      : undefined;

    const params = { ...cleanFilters, type };
    return apiService.get<{ downloadUrl: string }>(
      `${this.endpoint}/reports`,
      params
    );
  }

  async bulkUpdateAssets(
    assetIds: string[],
    updates: Partial<Asset>
  ): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.endpoint}/bulk-update`, {
      assetIds,
      updates,
    });
  }

  async bulkAssignAssets(
    assetIds: string[],
    userId: string
  ): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.endpoint}/bulk-assign`, {
      assetIds,
      userId,
    });
  }

  async bulkDeleteAssets(assetIds: string[]): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/bulk-delete`, { assetIds });
  }

  async importAssets(
    file: File
  ): Promise<
    ApiResponse<{ imported: number; failed: number; errors: string[] }>
  > {
    return apiService.uploadFile<{
      imported: number;
      failed: number;
      errors: string[];
    }>(`${this.endpoint}/import`, file);
  }

  async exportAssets(
    filters?: AssetFilters,
    format: "csv" | "xlsx" = "csv"
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const cleanFilters = filters
      ? (Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>)
      : undefined;

    const params = { ...cleanFilters, format };
    return apiService.get<{ downloadUrl: string }>(
      `${this.endpoint}/export`,
      params
    );
  }

  async getAssetQRCode(
    id: string
  ): Promise<ApiResponse<{ qrCodeUrl: string }>> {
    return apiService.get<{ qrCodeUrl: string }>(
      `${this.endpoint}/${id}/qr-code`
    );
  }

  async getAssetStats(): Promise<
    ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      maintenance: number;
      retired: number;
      totalValue: number;
      avgAge: number;
      warrantyExpiring: number;
    }>
  > {
    return apiService.get<{
      total: number;
      active: number;
      inactive: number;
      maintenance: number;
      retired: number;
      totalValue: number;
      avgAge: number;
      warrantyExpiring: number;
    }>(`${this.endpoint}/stats`);
  }
}

// Export singleton instance
export const assetService = new AssetService();
export default assetService;
