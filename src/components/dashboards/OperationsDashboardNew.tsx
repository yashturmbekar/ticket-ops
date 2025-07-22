import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaServer,
  FaNetworkWired,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaTools,
  FaEye,
  FaPlus,
  FaBell,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
} from "react-icons/fa";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "../../styles/dashboardModern.css";

interface OperationsStats {
  systemHealth: number;
  activeIncidents: number;
  resolvedToday: number;
  avgResponseTime: number;
  serverUptime: number;
  networkLatency: number;
  securityAlerts: number;
  performanceAlerts: number;
}

interface SystemStatus {
  id: string;
  name: string;
  type: "server" | "database" | "network" | "application";
  status: "healthy" | "warning" | "critical";
  uptime: number;
  lastCheck: Date;
  responseTime?: number;
}

export const OperationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<OperationsStats>({
    systemHealth: 0,
    activeIncidents: 0,
    resolvedToday: 0,
    avgResponseTime: 0,
    serverUptime: 0,
    networkLatency: 0,
    securityAlerts: 0,
    performanceAlerts: 0,
  });
  const [criticalTickets, setCriticalTickets] = useState<Ticket[]>([]);
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Mock data for demonstration
        const mockStats = {
          systemHealth: 97,
          activeIncidents: 2,
          resolvedToday: 12,
          avgResponseTime: 2.1,
          serverUptime: 99.8,
          networkLatency: 24,
          securityAlerts: 1,
          performanceAlerts: 3,
        };

        const mockSystemStatuses: SystemStatus[] = [
          {
            id: "srv-001",
            name: "Web Server 01",
            type: "server",
            status: "healthy",
            uptime: 99.9,
            lastCheck: new Date(),
            responseTime: 120,
          },
          {
            id: "db-001",
            name: "Primary Database",
            type: "database",
            status: "warning",
            uptime: 98.5,
            lastCheck: new Date(),
            responseTime: 340,
          },
          {
            id: "net-001",
            name: "Core Network",
            type: "network",
            status: "healthy",
            uptime: 99.7,
            lastCheck: new Date(),
            responseTime: 25,
          },
          {
            id: "app-001",
            name: "Main Application",
            type: "application",
            status: "critical",
            uptime: 85.2,
            lastCheck: new Date(),
            responseTime: 2100,
          },
        ];

        const mockCriticalTickets: Ticket[] = [
          {
            id: "T-301",
            title: "Database performance degradation",
            description:
              "Primary database showing slow query performance affecting all applications.",
            priority: "critical" as Priority,
            status: "IN_PROGRESS" as TicketStatus,
            assignedTo: "Database Team",
            createdAt: new Date("2024-01-15T06:30:00"),
            updatedAt: new Date("2024-01-15T08:45:00"),
            createdBy: "monitoring@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-15T10:30:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId : "45c30b4a-52d2-4535-800b-d8fada23dcb6"

          },
          {
            id: "T-302",
            title: "Security alert - Unusual network activity",
            description:
              "Detected unusual outbound network traffic from internal servers.",
            priority: "high" as Priority,
            status: "RAISED" as TicketStatus,
            assignedTo: "Security Team",
            createdAt: new Date("2024-01-15T09:15:00"),
            updatedAt: new Date("2024-01-15T09:15:00"),
            createdBy: "security@company.com",
            category: "network",
            slaDeadline: new Date("2024-01-15T13:15:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6"
          },
        ];

        setStats(mockStats);
        setSystemStatuses(mockSystemStatuses);
        setCriticalTickets(mockCriticalTickets);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (
    status: "healthy" | "warning" | "critical"
  ): string => {
    return status;
  };

  const getSystemIcon = (
    type: "server" | "database" | "network" | "application"
  ) => {
    switch (type) {
      case "server":
        return <FaServer />;
      case "database":
        return <FaDatabase />;
      case "network":
        return <FaNetworkWired />;
      case "application":
        return <FaCloud />;
      default:
        return <FaServer />;
    }
  };

  const getTicketPriorityClass = (priority: Priority): string => {
    return priority.toLowerCase();
  };

  const getTicketStatusClass = (status: TicketStatus): string => {
    return status;
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Dashboard Header */}
      <div className="modern-dashboard-header">
        <div>
          <h1 className="modern-dashboard-title">Operations Dashboard</h1>
          <p className="modern-dashboard-subtitle">
            Monitor system health and manage critical incidents
          </p>
        </div>
        <div className="modern-dashboard-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/network")}
          >
            <FaNetworkWired />
            <span>Network Monitor</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tickets/create")}
          >
            <FaPlus />
            <span>Create Incident</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="modern-stats-grid">
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon success">
              <FaCheckCircle />
            </div>
          </div>
          <div className="modern-stat-value">{stats.systemHealth}%</div>
          <div className="modern-stat-label">System Health</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>+2% this week</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon critical">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="modern-stat-value">{stats.activeIncidents}</div>
          <div className="modern-stat-label">Active Incidents</div>
          <div className="modern-stat-change negative">
            <span>Require attention</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon primary">
              <FaTools />
            </div>
          </div>
          <div className="modern-stat-value">{stats.resolvedToday}</div>
          <div className="modern-stat-label">Resolved Today</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>+25% vs yesterday</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon info">
              <FaClock />
            </div>
          </div>
          <div className="modern-stat-value">{stats.avgResponseTime}m</div>
          <div className="modern-stat-label">Avg Response</div>
          <div className="modern-stat-change positive">
            <FaArrowDown />
            <span>Improved by 30%</span>
          </div>
        </div>
      </div>

      <div className="modern-dashboard-content">
        {/* System Status Section */}
        <div className="modern-section">
          <div className="modern-section-header">
            <h2 className="modern-section-title">System Status</h2>
            <div className="modern-section-actions">
              <button className="btn btn-secondary btn-sm">
                <FaChartLine />
                <span>View Details</span>
              </button>
            </div>
          </div>

          <div className="modern-system-grid">
            {systemStatuses.map((system) => (
              <div key={system.id} className="modern-system-card">
                <div className="modern-system-header">
                  <div className="modern-system-icon">
                    {getSystemIcon(system.type)}
                  </div>
                  <div className="modern-system-info">
                    <h4>{system.name}</h4>
                    <span className="modern-system-type">{system.type}</span>
                  </div>
                  <div
                    className={`modern-system-status ${getStatusColor(
                      system.status
                    )}`}
                  >
                    <div className="modern-status-dot"></div>
                    <span>{system.status}</span>
                  </div>
                </div>

                <div className="modern-system-metrics">
                  <div className="modern-system-metric">
                    <span className="metric-label">Uptime</span>
                    <span className="metric-value">{system.uptime}%</span>
                  </div>
                  {system.responseTime && (
                    <div className="modern-system-metric">
                      <span className="metric-label">Response</span>
                      <span className="metric-value">
                        {system.responseTime}ms
                      </span>
                    </div>
                  )}
                  <div className="modern-system-metric">
                    <span className="metric-label">Last Check</span>
                    <span className="metric-value">
                      {formatTimeAgo(system.lastCheck)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Incidents Section */}
        <div className="modern-section">
          <div className="modern-section-header">
            <h2 className="modern-section-title">Critical Incidents</h2>
            <div className="modern-section-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/tickets")}
              >
                <FaEye />
                <span>View All</span>
              </button>
            </div>
          </div>

          <div className="modern-tickets-grid">
            {criticalTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="modern-ticket-tile critical-incident"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <div className="modern-ticket-header">
                  <span className="modern-ticket-id">{ticket.id}</span>
                  <span
                    className={`modern-ticket-priority ${getTicketPriorityClass(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <h3 className="modern-ticket-title">{ticket.title}</h3>
                <p className="modern-ticket-description">
                  {ticket.description}
                </p>

                <div className="modern-ticket-meta">
                  <div className="modern-ticket-assignee">
                    <div className="modern-ticket-avatar">
                      {getInitials(ticket.assignedTo || "Unknown")}
                    </div>
                    <span>{ticket.assignedTo}</span>
                  </div>
                  <span className="modern-ticket-date">
                    {formatTimeAgo(ticket.createdAt)}
                  </span>
                </div>

                <div className="modern-ticket-footer">
                  <span
                    className={`modern-ticket-status ${getTicketStatusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                  <div className="modern-ticket-urgency">
                    <FaBell className="urgency-icon" />
                    <span>SLA: 2h remaining</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {criticalTickets.length === 0 && (
            <div className="modern-empty-state">
              <div className="modern-empty-icon">
                <FaShieldAlt />
              </div>
              <h3>All systems operational</h3>
              <p>No critical incidents require immediate attention.</p>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="modern-section">
          <div className="modern-section-header">
            <h2 className="modern-section-title">Quick Actions</h2>
          </div>

          <div className="modern-quick-actions">
            <button
              className="modern-quick-action"
              onClick={() => navigate("/network")}
            >
              <FaNetworkWired />
              <span>Network Monitor</span>
            </button>

            <button
              className="modern-quick-action"
              onClick={() => navigate("/reports")}
            >
              <FaChartLine />
              <span>System Reports</span>
            </button>

            <button
              className="modern-quick-action"
              onClick={() => navigate("/assets")}
            >
              <FaServer />
              <span>Asset Management</span>
            </button>

            <button
              className="modern-quick-action"
              onClick={() => navigate("/settings")}
            >
              <FaTools />
              <span>System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
