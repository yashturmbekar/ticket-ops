import { apiService } from "./api";
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  Comment,
  Attachment,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export interface TicketFilters {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
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

export class TicketService {
  private endpoint = "/tickets";

  async getTickets(
    filters?: TicketFilters
  ): Promise<ApiResponse<PaginatedResponse<Ticket>>> {
    const cleanFilters = filters
      ? (Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined)
        ) as Record<string, string | number | boolean>)
      : undefined;

    return apiService.get<PaginatedResponse<Ticket>>(
      this.endpoint,
      cleanFilters
    );
  }

  async getTicketById(id: string): Promise<ApiResponse<Ticket>> {
    return apiService.get<Ticket>(`${this.endpoint}/${id}`);
  }

  async createTicket(
    ticketData: CreateTicketRequest
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post<Ticket>(this.endpoint, ticketData);
  }

  async updateTicket(
    id: string,
    ticketData: UpdateTicketRequest
  ): Promise<ApiResponse<Ticket>> {
    return apiService.put<Ticket>(`${this.endpoint}/${id}`, ticketData);
  }

  async deleteTicket(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  async assignTicket(
    id: string,
    assignedTo: string
  ): Promise<ApiResponse<Ticket>> {
    return apiService.patch<Ticket>(`${this.endpoint}/${id}/assign`, {
      assignedTo,
    });
  }

  async closeTicket(
    id: string,
    resolution?: string
  ): Promise<ApiResponse<Ticket>> {
    return apiService.patch<Ticket>(`${this.endpoint}/${id}/close`, {
      resolution,
    });
  }

  async reopenTicket(
    id: string,
    reason?: string
  ): Promise<ApiResponse<Ticket>> {
    return apiService.patch<Ticket>(`${this.endpoint}/${id}/reopen`, {
      reason,
    });
  }

  async addComment(
    ticketId: string,
    content: string,
    isInternal: boolean = false
  ): Promise<ApiResponse<Comment>> {
    return apiService.post<Comment>(`${this.endpoint}/${ticketId}/comments`, {
      content,
      isInternal,
    });
  }

  async getTicketComments(ticketId: string): Promise<ApiResponse<Comment[]>> {
    return apiService.get<Comment[]>(`${this.endpoint}/${ticketId}/comments`);
  }

  async updateComment(
    ticketId: string,
    commentId: string,
    content: string
  ): Promise<ApiResponse<Comment>> {
    return apiService.put<Comment>(
      `${this.endpoint}/${ticketId}/comments/${commentId}`,
      {
        content,
      }
    );
  }

  async deleteComment(
    ticketId: string,
    commentId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      `${this.endpoint}/${ticketId}/comments/${commentId}`
    );
  }

  async uploadAttachment(
    ticketId: string,
    file: File
  ): Promise<ApiResponse<Attachment>> {
    return apiService.uploadFile<Attachment>(
      `${this.endpoint}/${ticketId}/attachments`,
      file
    );
  }

  async deleteAttachment(
    ticketId: string,
    attachmentId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      `${this.endpoint}/${ticketId}/attachments/${attachmentId}`
    );
  }

  async rateTicket(
    id: string,
    rating: number,
    feedback?: string
  ): Promise<ApiResponse<void>> {
    return apiService.post<void>(`${this.endpoint}/${id}/rate`, {
      rating,
      feedback,
    });
  }

  async getTicketHistory(id: string): Promise<
    ApiResponse<
      Array<{
        action: string;
        details: string;
        performedBy: string;
        timestamp: Date;
      }>
    >
  > {
    return apiService.get<
      Array<{
        action: string;
        details: string;
        performedBy: string;
        timestamp: Date;
      }>
    >(`${this.endpoint}/${id}/history`);
  }

  async getMyTickets(): Promise<ApiResponse<Ticket[]>> {
    return apiService.get<Ticket[]>(`${this.endpoint}/my-tickets`);
  }

  async getAssignedTickets(): Promise<ApiResponse<Ticket[]>> {
    return apiService.get<Ticket[]>(`${this.endpoint}/assigned-to-me`);
  }

  async getOverdueTickets(): Promise<ApiResponse<Ticket[]>> {
    return apiService.get<Ticket[]>(`${this.endpoint}/overdue`);
  }

  async getTicketsByPriority(priority: string): Promise<ApiResponse<Ticket[]>> {
    return apiService.get<Ticket[]>(`${this.endpoint}/by-priority/${priority}`);
  }

  async getTicketsByCategory(category: string): Promise<ApiResponse<Ticket[]>> {
    return apiService.get<Ticket[]>(`${this.endpoint}/by-category/${category}`);
  }

  async bulkUpdateTickets(
    ticketIds: string[],
    updates: Partial<Ticket>
  ): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.endpoint}/bulk-update`, {
      ticketIds,
      updates,
    });
  }

  async bulkAssignTickets(
    ticketIds: string[],
    assignedTo: string
  ): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.endpoint}/bulk-assign`, {
      ticketIds,
      assignedTo,
    });
  }

  async bulkCloseTickets(
    ticketIds: string[],
    resolution?: string
  ): Promise<ApiResponse<void>> {
    return apiService.patch<void>(`${this.endpoint}/bulk-close`, {
      ticketIds,
      resolution,
    });
  }

  async exportTickets(
    filters?: TicketFilters,
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

  async getTicketStats(): Promise<
    ApiResponse<{
      total: number;
      open: number;
      inProgress: number;
      resolved: number;
      closed: number;
      overdue: number;
      avgResolutionTime: number;
    }>
  > {
    return apiService.get<{
      total: number;
      open: number;
      inProgress: number;
      resolved: number;
      closed: number;
      overdue: number;
      avgResolutionTime: number;
    }>(`${this.endpoint}/stats`);
  }
}

// Export singleton instance
export const ticketService = new TicketService();
export default ticketService;
