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

// New interfaces for the SLA policy display
export interface TicketPrioritySlaRule {
  id: string | null;
  priority: Priority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  isActive: boolean;
}

export interface DepartmentSlaPolicy {
  helpdeskDepartmentId: string;
  helpdeskDepartmentName: string;
  ticketPrioritySlaRulesDTOS: TicketPrioritySlaRule[];
}

export class SlaService {
  /**
   * Get all helpdesk departments
   */
  static async getAllHelpdeskDepartments(): Promise<HelpdeskDepartment[]> {
    const response = await apiClient.get("/helpdesk-departments/all");
    return response || [];
  }

  /**
   * Get SLA policies for a specific department
   */
  static async getSlaPoliciesByDepartment(departmentId: string): Promise<DepartmentSlaPolicy> {
    const response = await apiClient.get(`/helpdesk-tickets-sla-policy/${departmentId}`);
    return response;
  }

  /**
   * Get SLA policies for all departments
   */
  static async getAllSlaPolicies(): Promise<DepartmentSlaPolicy[]> {
    try {
      // First get all departments
      const departments = await this.getAllHelpdeskDepartments();
      
      // Then fetch SLA policies for each department
      const slaPoliciesPromises = departments.map(async (department) => {
        try {
          return await this.getSlaPoliciesByDepartment(department.id);
        } catch (error) {
          console.warn(`Failed to fetch SLA policies for department ${department.name}:`, error);
          // Return a default structure for departments without SLA policies
          return {
            helpdeskDepartmentId: department.id,
            helpdeskDepartmentName: department.name,
            ticketPrioritySlaRulesDTOS: []
          };
        }
      });

      const slaPolicies = await Promise.all(slaPoliciesPromises);
      return slaPolicies.filter(policy => policy !== null);
    } catch (error) {
      console.error("Error fetching all SLA policies:", error);
      throw error;
    }
  }

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
   * Update SLA policies for a department (creates or updates all priority rules)
   */
  static async updateDepartmentSlaPolicy(departmentId: string, rules: TicketPrioritySlaRule[]): Promise<SlaPolicy[]> {
    const payload = {
      helpdeskDepartmentId: departmentId,
      ticketPrioritySlaRulesDTOS: rules.map(rule => ({
        id: rule.id,
        priority: rule.priority,
        responseTimeMinutes: rule.responseTimeMinutes,
        resolutionTimeMinutes: rule.resolutionTimeMinutes,
        isActive: rule.isActive,
      })),
    };

    const response = await apiClient.put(
      `/helpdesk-tickets-sla-policy`,
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
