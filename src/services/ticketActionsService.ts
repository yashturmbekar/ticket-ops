import { apiService } from "./api";
import type {
  Ticket,
  TicketStatus,
  Priority,
  User,
  TicketNote,
  Attachment,
  TimeEntry,
  TicketHistory,
  TicketLink,
  TicketStats,
  SlaInfo,
  KnowledgeArticle,
  ApiResponse,
} from "../types";

export interface TicketUpdateData {
  status?: TicketStatus;
  priority?: Priority;
  assignedTo?: string;
  category?: string;
  tags?: string[];
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
}

export interface TicketNoteData {
  content: string;
  isInternal: boolean;
  attachments?: File[];
}

export interface TicketAssignmentData {
  userId: string;
  note?: string;
  notifyUser?: boolean;
}

export interface TicketEscalationData {
  escalateTo: string;
  reason: string;
  priority?: Priority;
  notifyManagement?: boolean;
}

export interface TicketMergeData {
  primaryTicketId: string;
  secondaryTicketIds: string[];
  mergeReason: string;
}

export interface TicketLinkData {
  ticketId: string;
  linkType:
    | "duplicate"
    | "related"
    | "blocks"
    | "blocked_by"
    | "parent"
    | "child";
  linkedTicketId: string;
  description?: string;
}

export interface BulkTicketAction {
  ticketIds: string[];
  action:
    | "update_status"
    | "assign"
    | "add_tag"
    | "remove_tag"
    | "set_priority"
    | "close";
  data: Record<string, unknown>;
}

export interface TicketApprovalData {
  action: "approve" | "reject";
  comments?: string;
  nextApprover?: string;
}

class TicketActionsService {
  // Update ticket properties
  async updateTicket(
    ticketId: string,
    data: TicketUpdateData
  ): Promise<ApiResponse<Ticket>> {
    return apiService.put(`/tickets/${ticketId}`, data);
  }

  // Add note/comment to ticket
  async addNote(
    ticketId: string,
    noteData: TicketNoteData
  ): Promise<ApiResponse<TicketNote>> {
    if (noteData.attachments && noteData.attachments.length > 0) {
      // Use uploadFile for form data with files
      const formData = new FormData();
      formData.append("content", noteData.content);
      formData.append("isInternal", noteData.isInternal.toString());

      noteData.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
      const response = await fetch(
        `${API_BASE_URL}/tickets/${ticketId}/notes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.statusText}`);
      }

      return response.json();
    } else {
      // Use regular post for JSON data
      return apiService.post(`/tickets/${ticketId}/notes`, {
        content: noteData.content,
        isInternal: noteData.isInternal,
      });
    }
  }

  // Get all notes for a ticket
  async getNotes(ticketId: string): Promise<ApiResponse<TicketNote[]>> {
    return apiService.get(`/tickets/${ticketId}/notes`);
  }

  // Update note
  async updateNote(
    ticketId: string,
    noteId: string,
    content: string
  ): Promise<ApiResponse<TicketNote>> {
    return apiService.put(`/tickets/${ticketId}/notes/${noteId}`, { content });
  }

  // Delete note
  async deleteNote(
    ticketId: string,
    noteId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete(`/tickets/${ticketId}/notes/${noteId}`);
  }

  // Assign ticket to user
  async assignTicket(
    ticketId: string,
    assignmentData: TicketAssignmentData
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/assign`, assignmentData);
  }

  // Reassign ticket
  async reassignTicket(
    ticketId: string,
    assignmentData: TicketAssignmentData
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/reassign`, assignmentData);
  }

  // Escalate ticket
  async escalateTicket(
    ticketId: string,
    escalationData: TicketEscalationData
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/escalate`, escalationData);
  }

  // Close ticket
  async closeTicket(
    ticketId: string,
    resolution: string,
    satisfactionRating?: number
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/close`, {
      resolution,
      satisfactionRating,
    });
  }

  // Reopen ticket
  async reopenTicket(
    ticketId: string,
    reason: string
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/reopen`, { reason });
  }

  // Merge tickets
  async mergeTickets(mergeData: TicketMergeData): Promise<ApiResponse<Ticket>> {
    return apiService.post("/tickets/merge", mergeData);
  }

  // Link tickets
  async linkTickets(linkData: TicketLinkData): Promise<ApiResponse<void>> {
    return apiService.post("/tickets/link", linkData);
  }

  // Unlink tickets
  async unlinkTickets(
    ticketId: string,
    linkedTicketId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete(`/tickets/${ticketId}/links/${linkedTicketId}`);
  }

  // Get ticket links
  async getTicketLinks(ticketId: string): Promise<ApiResponse<TicketLink[]>> {
    return apiService.get(`/tickets/${ticketId}/links`);
  }

  // Bulk actions
  async bulkAction(
    bulkAction: BulkTicketAction
  ): Promise<
    ApiResponse<{ successCount: number; failedCount: number; errors: string[] }>
  > {
    return apiService.post("/tickets/bulk-action", bulkAction);
  }

  // Add attachment to ticket
  async addAttachment(
    ticketId: string,
    file: File,
    description?: string
  ): Promise<ApiResponse<Attachment>> {
    const additionalData: Record<string, string | number | boolean> = {};
    if (description) {
      additionalData.description = description;
    }
    return apiService.uploadFile(
      `/tickets/${ticketId}/attachments`,
      file,
      additionalData
    );
  }

  // Remove attachment
  async removeAttachment(
    ticketId: string,
    attachmentId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete(
      `/tickets/${ticketId}/attachments/${attachmentId}`
    );
  }

  // Get ticket attachments
  async getAttachments(ticketId: string): Promise<ApiResponse<Attachment[]>> {
    return apiService.get(`/tickets/${ticketId}/attachments`);
  }

  // Update ticket status with workflow validation
  async updateStatus(
    ticketId: string,
    status: TicketStatus,
    note?: string
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/status`, { status, note });
  }

  // Get available status transitions
  async getStatusTransitions(
    ticketId: string
  ): Promise<ApiResponse<{ from: TicketStatus; to: TicketStatus[] }>> {
    return apiService.get(`/tickets/${ticketId}/status-transitions`);
  }

  // Add time tracking entry
  async addTimeEntry(
    ticketId: string,
    hours: number,
    description: string,
    date?: Date
  ): Promise<ApiResponse<TimeEntry>> {
    return apiService.post(`/tickets/${ticketId}/time-entries`, {
      hours,
      description,
      date: date || new Date(),
    });
  }

  // Get time entries
  async getTimeEntries(ticketId: string): Promise<ApiResponse<TimeEntry[]>> {
    return apiService.get(`/tickets/${ticketId}/time-entries`);
  }

  // Get ticket history/audit trail
  async getTicketHistory(
    ticketId: string
  ): Promise<ApiResponse<TicketHistory[]>> {
    return apiService.get(`/tickets/${ticketId}/history`);
  }

  // Submit ticket for approval
  async submitForApproval(
    ticketId: string,
    approverId: string,
    comments?: string
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(`/tickets/${ticketId}/submit-approval`, {
      approverId,
      comments,
    });
  }

  // Process approval
  async processApproval(
    ticketId: string,
    approvalData: TicketApprovalData
  ): Promise<ApiResponse<Ticket>> {
    return apiService.post(
      `/tickets/${ticketId}/process-approval`,
      approvalData
    );
  }

  // Get pending approvals
  async getPendingApprovals(userId?: string): Promise<ApiResponse<Ticket[]>> {
    return userId
      ? apiService.get("/tickets/pending-approvals", { userId })
      : apiService.get("/tickets/pending-approvals");
  }

  // Watch/unwatch ticket
  async watchTicket(ticketId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/tickets/${ticketId}/watch`);
  }

  async unwatchTicket(ticketId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/tickets/${ticketId}/watch`);
  }

  // Get watchers
  async getWatchers(ticketId: string): Promise<ApiResponse<User[]>> {
    return apiService.get(`/tickets/${ticketId}/watchers`);
  }

  // Send custom notification
  async sendNotification(
    ticketId: string,
    recipients: string[],
    message: string,
    type: "email" | "sms" | "push"
  ): Promise<ApiResponse<void>> {
    return apiService.post(`/tickets/${ticketId}/notify`, {
      recipients,
      message,
      type,
    });
  }

  // Archive ticket
  async archiveTicket(ticketId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/tickets/${ticketId}/archive`);
  }

  // Restore archived ticket
  async restoreTicket(ticketId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/tickets/${ticketId}/restore`);
  }

  // Get ticket statistics
  async getTicketStats(ticketId: string): Promise<ApiResponse<TicketStats>> {
    return apiService.get(`/tickets/${ticketId}/stats`);
  }

  // Print ticket
  async printTicket(
    ticketId: string,
    format: "pdf" | "html" = "pdf"
  ): Promise<ApiResponse<{ url: string }>> {
    return apiService.get(`/tickets/${ticketId}/print`, { format });
  }

  // Export ticket
  async exportTicket(
    ticketId: string,
    format: "pdf" | "excel" | "json" = "pdf"
  ): Promise<ApiResponse<{ url: string }>> {
    return apiService.get(`/tickets/${ticketId}/export`, { format });
  }

  // Get SLA information
  async getSlaInfo(ticketId: string): Promise<ApiResponse<SlaInfo>> {
    return apiService.get(`/tickets/${ticketId}/sla`);
  }

  // Reset SLA
  async resetSla(ticketId: string, reason: string): Promise<ApiResponse<void>> {
    return apiService.post(`/tickets/${ticketId}/sla/reset`, { reason });
  }

  // Get available agents for assignment
  async getAvailableAgents(ticketId: string): Promise<ApiResponse<User[]>> {
    return apiService.get(`/tickets/${ticketId}/available-agents`);
  }

  // Get suggested knowledge base articles
  async getSuggestedArticles(
    ticketId: string
  ): Promise<ApiResponse<KnowledgeArticle[]>> {
    return apiService.get(`/tickets/${ticketId}/suggested-articles`);
  }

  // Link knowledge base article
  async linkKbArticle(
    ticketId: string,
    articleId: string
  ): Promise<ApiResponse<void>> {
    return apiService.post(`/tickets/${ticketId}/kb-links`, { articleId });
  }

  // Unlink knowledge base article
  async unlinkKbArticle(
    ticketId: string,
    articleId: string
  ): Promise<ApiResponse<void>> {
    return apiService.delete(`/tickets/${ticketId}/kb-links/${articleId}`);
  }
}

export const ticketActionsService = new TicketActionsService();
