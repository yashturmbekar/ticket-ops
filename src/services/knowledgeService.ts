import apiClient from "./apiClient";

export interface KnowledgeSearchParams {
  query?: string;
  tags?: string[];
  author?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

const endpoint = "/knowledge";

export async function getArticles(params?: KnowledgeSearchParams) {
  const searchParams = params ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) : undefined;
  return apiClient.get(endpoint, { params: searchParams });
}

export async function getArticleById(id: string) {
  return apiClient.get(`${endpoint}/${id}`);
}

export async function createArticle(articleData: Record<string, unknown>) {
  return apiClient.post(endpoint, articleData);
}

export async function updateArticle(id: string, articleData: Record<string, unknown>) {
  return apiClient.put(`${endpoint}/${id}`, articleData);
}

export async function deleteArticle(id: string) {
  return apiClient.delete(`${endpoint}/${id}`);
}

export async function addComment(articleId: string, content: string) {
  return apiClient.post(`${endpoint}/${articleId}/comments`, { content });
}

export async function getComments(articleId: string) {
  return apiClient.get(`${endpoint}/${articleId}/comments`);
}

export async function updateComment(articleId: string, commentId: string, content: string) {
  return apiClient.put(`${endpoint}/${articleId}/comments/${commentId}`, { content });
}

export async function deleteComment(articleId: string, commentId: string) {
  return apiClient.delete(`${endpoint}/${articleId}/comments/${commentId}`);
}

export async function uploadAttachment(articleId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`${endpoint}/${articleId}/attachments`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export async function deleteAttachment(articleId: string, attachmentId: string) {
  return apiClient.delete(`${endpoint}/${articleId}/attachments/${attachmentId}`);
}

export async function getStats() {
  return apiClient.get(`${endpoint}/stats`);
}
