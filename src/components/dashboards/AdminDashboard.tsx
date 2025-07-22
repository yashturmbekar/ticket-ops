import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFilter, FaCog } from "react-icons/fa";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "./AdminDashboard.css";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  slaBreaches: number;
  avgResolutionTime: number;
  userSatisfaction: number;
}

interface SLABreach {
  id: string;
  title: string;
  priority: Priority;
  createdAt: Date;
  slaDeadline: Date;
  assignedTo: string;
  timeBreach: number; // hours over SLA
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    overdueTickets: 0,
    slaBreaches: 0,
    avgResolutionTime: 0,
    userSatisfaction: 0,
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [slaBreaches, setSlaBreaches] = useState<SLABreach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Mock data for demonstration
        const mockStats = {
          totalTickets: 1247,
          openTickets: 89,
          resolvedTickets: 1158,
          overdueTickets: 12,
          slaBreaches: 5,
          avgResolutionTime: 18.5,
          userSatisfaction: 4.2,
        };

        const mockTickets: Ticket[] = [
          {
            id: "T-001",
            title: "Email server not responding",
            description: "Users unable to access email",
            priority: "high" as Priority,
            status: "open" as TicketStatus,
            assignedTo: "John Smith",
            createdAt: new Date("2024-01-15T08:30:00"),
            updatedAt: new Date("2024-01-15T08:30:00"),
            createdBy: "user@company.com",
            category: "hardware",
            slaDeadline: new Date("2024-01-15T12:30:00"),
            tags: [],
            attachments: [],
            comments: [],
          },
          {
            id: "T-002",
            title: "Software installation request",
            description: "Need Adobe Creative Suite installed",
            priority: "medium" as Priority,
            status: "in_progress" as TicketStatus,
            assignedTo: "Jane Doe",
            createdAt: new Date("2024-01-15T09:15:00"),
            updatedAt: new Date("2024-01-15T09:15:00"),
            createdBy: "designer@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-15T17:15:00"),
            tags: [],
            attachments: [],
            comments: [],
          },
          {
            id: "T-003",
            title: "Network connectivity issues",
            description: "Intermittent connection drops",
            priority: "high" as Priority,
            status: "open" as TicketStatus,
            assignedTo: "Mike Wilson",
            createdAt: new Date("2024-01-15T10:00:00"),
            updatedAt: new Date("2024-01-15T10:00:00"),
            createdBy: "manager@company.com",
            category: "network",
            slaDeadline: new Date("2024-01-15T14:00:00"),
            tags: [],
            attachments: [],
            comments: [],
          },
        ];

        const mockBreaches: SLABreach[] = [
          {
            id: "T-045",
            title: "Critical system outage",
            priority: "critical" as Priority,
            createdAt: new Date("2024-01-14T14:00:00"),
            slaDeadline: new Date("2024-01-14T16:00:00"),
            assignedTo: "John Smith",
            timeBreach: 26,
          },
          {
            id: "T-078",
            title: "Database performance issues",
            priority: "high" as Priority,
            createdAt: new Date("2024-01-14T16:30:00"),
            slaDeadline: new Date("2024-01-14T20:30:00"),
            assignedTo: "Jane Doe",
            timeBreach: 8,
          },
        ];

        setStats(mockStats);
        setRecentTickets(mockTickets);
        setSlaBreaches(mockBreaches);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatTime = (hours: number): string => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case "open":
        return "info";
      case "in_progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
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
    <div className="dashboard-page">
      <div className="compact-header">
        <h1>Admin Dashboard</h1>
        <div className="actions-container">
          <button className="compact-btn compact-btn-primary">
            <FaBell /> Alerts ({stats.slaBreaches})
          </button>
          <button className="compact-btn">
            <FaFilter /> Filters
          </button>
          <button className="compact-btn" onClick={() => navigate("/settings")}>
            <FaCog /> Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="compact-stats">
        <div className="compact-stat">
          <div className="compact-stat-value">{stats.totalTickets}</div>
          <div className="compact-stat-label">Total Tickets</div>
        </div>
        <div className="compact-stat">
          <div className="compact-stat-value">{stats.openTickets}</div>
          <div className="compact-stat-label">Open Tickets</div>
        </div>
        <div className="compact-stat">
          <div className="compact-stat-value">{stats.resolvedTickets}</div>
          <div className="compact-stat-label">Resolved</div>
        </div>
        <div className="compact-stat">
          <div className="compact-stat-value">{stats.overdueTickets}</div>
          <div className="compact-stat-label">Overdue</div>
        </div>
        <div className="compact-stat">
          <div className="compact-stat-value">{stats.slaBreaches}</div>
          <div className="compact-stat-label">SLA Breaches</div>
        </div>
        <div className="compact-stat">
          <div className="compact-stat-value">
            {formatTime(stats.avgResolutionTime)}
          </div>
          <div className="compact-stat-label">Avg Resolution</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="compact-grid">
        {/* Recent Tickets */}
        <div className="compact-card">
          <h3>Recent Tickets</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>
                    <span
                      className={`compact-badge compact-badge-${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`compact-badge compact-badge-${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.assignedTo || "Unassigned"}</td>
                  <td>{formatDate(ticket.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SLA Breaches */}
        <div className="compact-card">
          <h3>SLA Breaches</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th>Breach Time</th>
              </tr>
            </thead>
            <tbody>
              {slaBreaches.map((breach) => (
                <tr key={breach.id}>
                  <td>#{breach.id}</td>
                  <td>{breach.title}</td>
                  <td>
                    <span
                      className={`compact-badge compact-badge-${getPriorityColor(
                        breach.priority
                      )}`}
                    >
                      {breach.priority}
                    </span>
                  </td>
                  <td>{breach.assignedTo}</td>
                  <td className="text-error">
                    +{formatTime(breach.timeBreach)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
