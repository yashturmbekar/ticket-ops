import type { Report, ReportType, ReportSchedule } from "../types";
import { apiService } from "./api";

export interface ReportFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  departments?: string[];
  users?: string[];
  categories?: string[];
  priorities?: string[];
  statuses?: string[];
  assetTypes?: string[];
}

export interface ReportData {
  id: string;
  title: string;
  data: Record<string, unknown>;
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    filters: ReportFilter;
    totalRecords: number;
    executionTime: number;
  };
  charts?: Array<{
    type: "line" | "bar" | "pie" | "area" | "scatter";
    title: string;
    data: Record<string, unknown>;
    options?: Record<string, unknown>;
  }>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "table" | "gauge";
  size: "sm" | "md" | "lg" | "xl";
  position: { x: number; y: number };
  config: Record<string, unknown>;
  refreshInterval?: number;
  lastUpdated: Date;
}

class ReportsService {
  private baseUrl = "/reports";

  // Report management
  async getReports(): Promise<Report[]> {
    const response = await apiService.get<Report[]>(`${this.baseUrl}`);
    return response.data;
  }

  async getReportById(id: string): Promise<Report> {
    const response = await apiService.get<Report>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createReport(report: Omit<Report, "id">): Promise<Report> {
    const response = await apiService.post<Report>(`${this.baseUrl}`, report);
    return response.data;
  }

  async updateReport(id: string, report: Partial<Report>): Promise<Report> {
    const response = await apiService.put<Report>(
      `${this.baseUrl}/${id}`,
      report
    );
    return response.data;
  }

  async deleteReport(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  // Report generation
  async generateReport(
    id: string,
    filters?: ReportFilter
  ): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/${id}/generate`,
      { filters }
    );
    return response.data;
  }

  async generateCustomReport(
    type: ReportType,
    parameters: Record<string, unknown>,
    filters?: ReportFilter
  ): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/generate`,
      {
        type,
        parameters,
        filters,
      }
    );
    return response.data;
  }

  // Pre-defined reports
  async getTicketSummaryReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/tickets/summary`,
      { filters }
    );
    return response.data;
  }

  async getTicketPerformanceReport(
    filters?: ReportFilter
  ): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/tickets/performance`,
      { filters }
    );
    return response.data;
  }

  async getAssetUtilizationReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/assets/utilization`,
      { filters }
    );
    return response.data;
  }

  async getUserActivityReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/users/activity`,
      { filters }
    );
    return response.data;
  }

  async getSLAComplianceReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/sla/compliance`,
      { filters }
    );
    return response.data;
  }

  async getKnowledgeBaseReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/knowledge/stats`,
      { filters }
    );
    return response.data;
  }

  async getNetworkHealthReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/network/health`,
      { filters }
    );
    return response.data;
  }

  async getSecurityReport(filters?: ReportFilter): Promise<ReportData> {
    const response = await apiService.post<ReportData>(
      `${this.baseUrl}/security/overview`,
      { filters }
    );
    return response.data;
  }

  // Analytics and insights
  async getTicketTrends(
    timeRange: "7d" | "30d" | "90d" | "1y" = "30d"
  ): Promise<{
    totalTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number;
    trendsData: Array<{
      date: string;
      created: number;
      resolved: number;
      pending: number;
    }>;
  }> {
    const response = await apiService.get<{
      totalTickets: number;
      resolvedTickets: number;
      averageResolutionTime: number;
      trendsData: Array<{
        date: string;
        created: number;
        resolved: number;
        pending: number;
      }>;
    }>(`${this.baseUrl}/analytics/ticket-trends?range=${timeRange}`);
    return response.data;
  }

  async getPerformanceMetrics(): Promise<{
    slaCompliance: number;
    averageResponseTime: number;
    firstCallResolution: number;
    customerSatisfaction: number;
    ticketBacklog: number;
    agentProductivity: number;
    topIssues: Array<{
      category: string;
      count: number;
      trend: "up" | "down" | "stable";
    }>;
  }> {
    const response = await apiService.get<{
      slaCompliance: number;
      averageResponseTime: number;
      firstCallResolution: number;
      customerSatisfaction: number;
      ticketBacklog: number;
      agentProductivity: number;
      topIssues: Array<{
        category: string;
        count: number;
        trend: "up" | "down" | "stable";
      }>;
    }>(`${this.baseUrl}/analytics/performance`);
    return response.data;
  }

  // Export functionality
  async exportReport(
    reportId: string,
    format: "pdf" | "xlsx" | "csv" | "json" = "pdf",
    filters?: ReportFilter
  ): Promise<Blob> {
    const response = await fetch(
      `/api${this.baseUrl}/${reportId}/export?format=${format}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ filters }),
      }
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    return response.blob();
  }

  async exportDashboard(
    dashboardId: string,
    format: "pdf" | "png" | "jpg" = "pdf"
  ): Promise<Blob> {
    const response = await fetch(
      `/api${this.baseUrl}/dashboard/${dashboardId}/export?format=${format}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Dashboard export failed");
    }

    return response.blob();
  }

  // Scheduled reports
  async getScheduledReports(): Promise<
    Array<Report & { schedule: ReportSchedule }>
  > {
    const response = await apiService.get<
      Array<Report & { schedule: ReportSchedule }>
    >(`${this.baseUrl}/scheduled`);
    return response.data;
  }

  async scheduleReport(
    reportId: string,
    schedule: ReportSchedule
  ): Promise<void> {
    await apiService.post(`${this.baseUrl}/${reportId}/schedule`, { schedule });
  }

  async unscheduleReport(reportId: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${reportId}/schedule`);
  }

  // Dashboard management
  async getDashboardWidgets(): Promise<DashboardWidget[]> {
    const response = await apiService.get<DashboardWidget[]>(
      `${this.baseUrl}/dashboard/widgets`
    );
    return response.data;
  }

  async createDashboardWidget(
    widget: Omit<DashboardWidget, "id">
  ): Promise<DashboardWidget> {
    const response = await apiService.post<DashboardWidget>(
      `${this.baseUrl}/dashboard/widgets`,
      widget
    );
    return response.data;
  }

  async updateDashboardWidget(
    id: string,
    widget: Partial<DashboardWidget>
  ): Promise<DashboardWidget> {
    const response = await apiService.put<DashboardWidget>(
      `${this.baseUrl}/dashboard/widgets/${id}`,
      widget
    );
    return response.data;
  }

  async deleteDashboardWidget(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/dashboard/widgets/${id}`);
  }

  async getDashboardData(): Promise<{
    widgets: DashboardWidget[];
    metrics: {
      totalTickets: number;
      openTickets: number;
      resolvedToday: number;
      avgResolutionTime: number;
      slaCompliance: number;
      userSatisfaction: number;
    };
    charts: Array<{
      id: string;
      type: string;
      title: string;
      data: Record<string, unknown>;
    }>;
  }> {
    const response = await apiService.get<{
      widgets: DashboardWidget[];
      metrics: {
        totalTickets: number;
        openTickets: number;
        resolvedToday: number;
        avgResolutionTime: number;
        slaCompliance: number;
        userSatisfaction: number;
      };
      charts: Array<{
        id: string;
        type: string;
        title: string;
        data: Record<string, unknown>;
      }>;
    }>(`${this.baseUrl}/dashboard/data`);
    return response.data;
  }

  // Real-time data
  async getRealtimeMetrics(): Promise<{
    activeUsers: number;
    onlineAgents: number;
    pendingTickets: number;
    averageWaitTime: number;
    systemHealth: number;
    recentActivity: Array<{
      type:
        | "ticket_created"
        | "ticket_resolved"
        | "user_login"
        | "system_alert";
      message: string;
      timestamp: Date;
      userId?: string;
    }>;
  }> {
    const response = await apiService.get<{
      activeUsers: number;
      onlineAgents: number;
      pendingTickets: number;
      averageWaitTime: number;
      systemHealth: number;
      recentActivity: Array<{
        type:
          | "ticket_created"
          | "ticket_resolved"
          | "user_login"
          | "system_alert";
        message: string;
        timestamp: Date;
        userId?: string;
      }>;
    }>(`${this.baseUrl}/realtime/metrics`);
    return response.data;
  }
}

export const reportsService = new ReportsService();
