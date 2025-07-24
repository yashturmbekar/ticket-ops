import apiClient from "./apiClient";
import { Priority } from "../types";

export interface SlaPolicy {
  id: string;
  helpdeskDepartmentId: string;
  helpdeskDepartmentName?: string;
  priority: Priority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
}

export interface PrioritySlaData {
  priority: Priority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
}

export interface SlaRuleFormData {
  helpdeskDepartmentId: string;
  prioritySlaSettings: PrioritySlaData[];
}

export interface HelpdeskDepartment {
  id: string;
  name: string;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
  organizationId: number;
}

export class SlaService {
  /**
   * Create SLA policies for multiple priorities for a department
   */
  static async createSlaPolicy(data: SlaRuleFormData): Promise<SlaPolicy[]> {
    const payload = {
      helpdeskDepartmentId: data.helpdeskDepartmentId,
      ticketPrioritySlaRulesDTOS: data.prioritySlaSettings.map(
        (prioritySla) => ({
          priority: prioritySla.priority,
          responseTimeMinutes: prioritySla.responseTimeMinutes,
          resolutionTimeMinutes: prioritySla.resolutionTimeMinutes,
          isActive: true,
        })
      ),
    };

    const response = await apiClient.post(
      "/helpdesk-tickets-sla-policy",
      payload
    );

    return response;
  }

  /**
   * Get all SLA policies
   */
  static async getSlapolicies(): Promise<SlaPolicy[]> {
    const response = await apiClient.get("/helpdesk-tickets-sla-policy");
    return response;
  }

  /**
   * Get SLA policy by ID
   */
  static async getSlaPolicy(id: string): Promise<SlaPolicy> {
    const response = await apiClient.get(`/helpdesk-tickets-sla-policy/${id}`);
    return response;
  }

  /**
   * Update an existing SLA policy
   */
  static async updateSlaPolicy(
    id: string,
    data: Partial<SlaRuleFormData>
  ): Promise<SlaPolicy> {
    const response = await apiClient.put(
      `/helpdesk-tickets-sla-policy/${id}`,
      data
    );
    return response;
  }

  /**
   * Delete an SLA policy
   */
  static async deleteSlaPolicy(id: string): Promise<void> {
    await apiClient.delete(`/helpdesk-tickets-sla-policy/${id}`);
  }

  /**
   * Get active helpdesk departments for SLA assignment
   */
  static async getActiveHelpdeskDepartments(): Promise<HelpdeskDepartment[]> {
    const response = await apiClient.get("/helpdesk-departments/all");
    if (response && Array.isArray(response)) {
      return response.filter((dept: HelpdeskDepartment) => dept.isActive);
    }
    return [];
  }

  /**
   * Validate SLA rule data before submission
   */
  static validateSlaRule(data: SlaRuleFormData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.helpdeskDepartmentId) {
      errors.push("Please select a helpdesk department");
    }

    if (!data.prioritySlaSettings || data.prioritySlaSettings.length === 0) {
      errors.push("Please configure at least one priority level");
    }

    data.prioritySlaSettings.forEach((prioritySla) => {
      if (
        !prioritySla.responseTimeMinutes ||
        prioritySla.responseTimeMinutes <= 0
      ) {
        errors.push(
          `Response time for ${prioritySla.priority} must be greater than 0`
        );
      }

      if (
        !prioritySla.resolutionTimeMinutes ||
        prioritySla.resolutionTimeMinutes <= 0
      ) {
        errors.push(
          `Resolution time for ${prioritySla.priority} must be greater than 0`
        );
      }

      if (
        prioritySla.responseTimeMinutes >= prioritySla.resolutionTimeMinutes
      ) {
        errors.push(
          `Resolution time must be greater than response time for ${prioritySla.priority}`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format time in minutes to human readable format
   */
  static formatTimeMinutes(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return hours === 1 ? `${hours} hour` : `${hours} hours`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Convert hours to minutes
   */
  static hoursToMinutes(hours: number): number {
    return hours * 60;
  }

  /**
   * Convert minutes to hours
   */
  static minutesToHours(minutes: number): number {
    return minutes / 60;
  }
}

export default SlaService;
