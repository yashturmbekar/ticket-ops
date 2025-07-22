// Utility functions for transforming API responses to internal types

import type { ApiTicketResponse, Ticket, Category } from "../types";

/**
 * Transform API ticket response to internal Ticket format
 */
export function transformApiTicketToTicket(
  apiTicket: ApiTicketResponse
): Ticket {
  return {
    id: apiTicket.id,
    title: apiTicket.title,
    description: apiTicket.description,
    status: apiTicket.status,
    priority: apiTicket.priority,
    assignedDepartmentId: apiTicket.assignedDepartmentId,
    createdBy: apiTicket.raiserEmployeeDetails.employeeName,
    assignedTo: apiTicket.assignedToEmployeeId?.toString(),
    createdAt: new Date(apiTicket.createdDate),
    updatedAt: new Date(apiTicket.lastModifiedDate),
    slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h SLA
    tags: [],
    attachments: [],
    comments: [],
    requesterEmail: "", // Not provided in API response
    category: "other" as Category, // Default category
    // Add ticketCode as a custom property that can be displayed
    ticketCode: apiTicket.ticketCode,
  } as Ticket & { ticketCode: string };
}

/**
 * Transform multiple API tickets to internal format
 */
export function transformApiTicketsToTickets(
  apiTickets: ApiTicketResponse[]
): Ticket[] {
  return apiTickets.map(transformApiTicketToTicket);
}
