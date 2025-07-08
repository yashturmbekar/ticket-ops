import type {
  KnowledgeArticle,
  KnowledgeCategory,
  ArticleStatus,
  ApiResponse,
  PaginatedResponse,
  CreateKnowledgeArticleRequest,
  UpdateKnowledgeArticleRequest,
} from "../types";
import { apiService } from "./api";

export interface KnowledgeSearchParams {
  query?: string;
  category?: string;
  status?: ArticleStatus;
  tags?: string[];
  authorId?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt" | "viewCount" | "rating";
  sortOrder?: "asc" | "desc";
}

export interface KnowledgeStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  reviewArticles: number;
  archivedArticles: number;
  totalViews: number;
  avgRating: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  topAuthors: Array<{
    authorId: string;
    authorName: string;
    articleCount: number;
  }>;
}

class KnowledgeService {
  private baseUrl = "/knowledge";

  // Article management
  async getArticles(
    params?: KnowledgeSearchParams
  ): Promise<PaginatedResponse<KnowledgeArticle>> {
    const queryParams = new URLSearchParams();

    if (params?.query) queryParams.append("query", params.query);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.tags) queryParams.append("tags", params.tags.join(","));
    if (params?.authorId) queryParams.append("authorId", params.authorId);
    if (params?.isPublic !== undefined)
      queryParams.append("isPublic", params.isPublic.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const query = queryParams.toString();
    const url = query ? `${this.baseUrl}?${query}` : this.baseUrl;

    const response = await apiService.get<PaginatedResponse<KnowledgeArticle>>(
      url
    );
    return response.data;
  }

  async getArticleById(id: string): Promise<KnowledgeArticle> {
    const response = await apiService.get<KnowledgeArticle>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async createArticle(
    article: CreateKnowledgeArticleRequest
  ): Promise<KnowledgeArticle> {
    const response = await apiService.post<KnowledgeArticle>(
      this.baseUrl,
      article
    );
    return response.data;
  }

  async updateArticle(
    id: string,
    article: UpdateKnowledgeArticleRequest
  ): Promise<KnowledgeArticle> {
    const response = await apiService.put<KnowledgeArticle>(
      `${this.baseUrl}/${id}`,
      article
    );
    return response.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  async publishArticle(id: string): Promise<KnowledgeArticle> {
    const response = await apiService.post<KnowledgeArticle>(
      `${this.baseUrl}/${id}/publish`
    );
    return response.data;
  }

  async archiveArticle(id: string): Promise<KnowledgeArticle> {
    const response = await apiService.post<KnowledgeArticle>(
      `${this.baseUrl}/${id}/archive`
    );
    return response.data;
  }

  async duplicateArticle(id: string): Promise<KnowledgeArticle> {
    const response = await apiService.post<KnowledgeArticle>(
      `${this.baseUrl}/${id}/duplicate`
    );
    return response.data;
  }

  // Article interactions
  async incrementViewCount(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/${id}/view`);
  }

  async rateArticle(id: string, rating: number): Promise<void> {
    await apiService.post(`${this.baseUrl}/${id}/rate`, { rating });
  }

  async searchArticles(
    query: string,
    filters?: Partial<KnowledgeSearchParams>
  ): Promise<PaginatedResponse<KnowledgeArticle>> {
    return this.getArticles({ ...filters, query });
  }

  // Categories
  async getCategories(): Promise<KnowledgeCategory[]> {
    const response = await apiService.get<KnowledgeCategory[]>(
      `${this.baseUrl}/categories`
    );
    return response.data;
  }

  async createCategory(
    category: Omit<KnowledgeCategory, "id">
  ): Promise<KnowledgeCategory> {
    const response = await apiService.post<KnowledgeCategory>(
      `${this.baseUrl}/categories`,
      category
    );
    return response.data;
  }

  async updateCategory(
    id: string,
    category: Partial<KnowledgeCategory>
  ): Promise<KnowledgeCategory> {
    const response = await apiService.put<KnowledgeCategory>(
      `${this.baseUrl}/categories/${id}`,
      category
    );
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/categories/${id}`);
  }

  // Tags
  async getTags(): Promise<string[]> {
    const response = await apiService.get<string[]>(`${this.baseUrl}/tags`);
    return response.data;
  }

  async getPopularTags(
    limit: number = 10
  ): Promise<Array<{ tag: string; count: number }>> {
    const response = await apiService.get<
      Array<{ tag: string; count: number }>
    >(`${this.baseUrl}/tags/popular?limit=${limit}`);
    return response.data;
  }

  // Statistics and analytics
  async getStats(): Promise<KnowledgeStats> {
    const response = await apiService.get<KnowledgeStats>(
      `${this.baseUrl}/stats`
    );
    return response.data;
  }

  async getArticleAnalytics(id: string): Promise<{
    views: number;
    rating: number;
    ratingCount: number;
    viewsOverTime: Array<{ date: string; views: number }>;
    ratingsOverTime: Array<{ date: string; rating: number }>;
  }> {
    const response = await apiService.get<{
      views: number;
      rating: number;
      ratingCount: number;
      viewsOverTime: Array<{ date: string; views: number }>;
      ratingsOverTime: Array<{ date: string; rating: number }>;
    }>(`${this.baseUrl}/${id}/analytics`);
    return response.data;
  }

  // Bulk operations
  async bulkUpdateArticles(
    articleIds: string[],
    updates: Partial<KnowledgeArticle>
  ): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseUrl}/bulk-update`, {
      articleIds,
      updates,
    });
  }

  async bulkDeleteArticles(articleIds: string[]): Promise<ApiResponse<void>> {
    return apiService.post(`${this.baseUrl}/bulk-delete`, { articleIds });
  }

  // Export/Import
  async exportArticles(format: "json" | "csv" | "pdf" = "json"): Promise<Blob> {
    const response = await fetch(
      `/api${this.baseUrl}/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    return response.blob();
  }

  async importArticles(file: File): Promise<
    ApiResponse<{
      imported: number;
      errors: Array<{ line: number; error: string }>;
    }>
  > {
    const formData = new FormData();
    formData.append("file", file);

    return apiService.post(`${this.baseUrl}/import`, formData);
  }
}

export const knowledgeService = new KnowledgeService();
