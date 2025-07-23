import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaUsers,
  FaChartLine,
  FaBolt,
  FaEye,
} from "react-icons/fa";
import { Loader, TicketTile } from "../common";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "../../styles/dashboard.css";
import "../../styles/ticketsDashboard.css";

interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  slaBreaches: number;
  avgResolutionTime: number;
  userSatisfaction: number;
  todayTickets: number;
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
    todayTickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
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
          todayTickets: 24,
        };

        const mockTickets: Ticket[] = [
          {
            id: "T-001",
            title: "Email server not responding",
            description:
              "Users unable to access email services. Multiple departments affected.",
            priority: "high" as Priority,
            status: "RAISED" as TicketStatus,
            assignedTo: "John Smith",
            createdAt: new Date("2024-01-15T08:30:00"),
            updatedAt: new Date("2024-01-15T08:30:00"),
            createdBy: "user@company.com",
            category: "hardware",
            slaDeadline: new Date("2024-01-15T12:30:00"),
            tags: ["urgent", "email", "server"],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
          {
            id: "T-002",
            title: "Software installation request",
            description:
              "Need Adobe Creative Suite installed on workstation for new designer.",
            priority: "medium" as Priority,
            status: "IN_PROGRESS" as TicketStatus,
            assignedTo: "Jane Doe",
            createdAt: new Date("2024-01-15T09:15:00"),
            updatedAt: new Date("2024-01-15T09:15:00"),
            createdBy: "designer@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-15T17:15:00"),
            tags: ["software", "installation", "adobe"],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
          {
            id: "T-003",
            title: "Network connectivity issues",
            description:
              "Intermittent connection drops affecting productivity in Marketing dept.",
            priority: "high" as Priority,
            status: "RAISED" as TicketStatus,
            assignedTo: "Mike Wilson",
            createdAt: new Date("2024-01-15T10:00:00"),
            updatedAt: new Date("2024-01-15T10:00:00"),
            createdBy: "manager@company.com",
            category: "network",
            slaDeadline: new Date("2024-01-15T14:00:00"),
            tags: ["network", "connectivity", "urgent"],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
          {
            id: "T-004",
            title: "Password reset request",
            description:
              "User unable to access account after multiple failed login attempts.",
            priority: "low" as Priority,
            status: "resolved" as TicketStatus,
            assignedTo: "Sarah Johnson",
            createdAt: new Date("2024-01-15T07:45:00"),
            updatedAt: new Date("2024-01-15T08:15:00"),
            createdBy: "employee@company.com",
            category: "access",
            slaDeadline: new Date("2024-01-15T16:45:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
          {
            id: "T-005",
            title: "Printer not working",
            description:
              "Office printer showing error messages and not responding to print jobs.",
            priority: "medium" as Priority,
            status: "IN_PROGRESS" as TicketStatus,
            assignedTo: "Tom Brown",
            createdAt: new Date("2024-01-15T11:20:00"),
            updatedAt: new Date("2024-01-15T11:45:00"),
            createdBy: "reception@company.com",
            category: "hardware",
            slaDeadline: new Date("2024-01-15T15:20:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
          {
            id: "T-006",
            title: "Database performance slow",
            description:
              "Application queries taking longer than usual, affecting user experience.",
            priority: "high" as Priority,
            status: "RAISED" as TicketStatus,
            assignedTo: "Alex Chen",
            createdAt: new Date("2024-01-15T12:10:00"),
            updatedAt: new Date("2024-01-15T12:10:00"),
            createdBy: "dev@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-15T16:10:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
        ];

        // Filter out resolved/closed tickets for dashboard display
        const activeTickets = mockTickets.filter(
          (ticket) =>
            ticket.status !== "RESOLVED" && ticket.status !== "APPROVED"
        );

        setStats(mockStats);
        setRecentTickets(activeTickets);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (loading) {
    return <Loader centered text="Loading dashboard..." minHeight="60vh" />;
  }

  return (
    <div className="modern-dashboard">
      {/* Dashboard Header */}
      <div className="modern-dashboard-header">
        <div>
          <h1 className="modern-dashboard-title">Admin Dashboard</h1>
          <p className="modern-dashboard-subtitle">
            Monitor and manage your IT helpdesk operations
          </p>
        </div>
        <div className="modern-dashboard-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/reports")}
          >
            <FaChartLine />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="modern-stats-grid">
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon primary">
              <FaTicketAlt />
            </div>
          </div>
          <div className="modern-stat-value">
            {stats.totalTickets.toLocaleString()}
          </div>
          <div className="modern-stat-label">Total Tickets</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon info">
              <FaBolt />
            </div>
          </div>
          <div className="modern-stat-value">{stats.openTickets}</div>
          <div className="modern-stat-label">Raised Tickets</div>
          <div className="modern-stat-change neutral">
            <span>Active workload</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon success">
              <FaCheckCircle />
            </div>
          </div>
          <div className="modern-stat-value">
            {stats.resolvedTickets.toLocaleString()}
          </div>
          <div className="modern-stat-label">Resolved Tickets</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>+8% this week</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon warning">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="modern-stat-value">{stats.overdueTickets}</div>
          <div className="modern-stat-label">Overdue Tickets</div>
          <div className="modern-stat-change negative">
            <FaArrowDown />
            <span>Needs attention</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon error">
              <FaClock />
            </div>
          </div>
          <div className="modern-stat-value">{stats.slaBreaches}</div>
          <div className="modern-stat-label">SLA Breaches</div>
          <div className="modern-stat-change negative">
            <span>Critical priority</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon success">
              <FaUsers />
            </div>
          </div>
          <div className="modern-stat-value">
            {stats.userSatisfaction.toFixed(1)}
          </div>
          <div className="modern-stat-label">User Satisfaction</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>+0.3 this month</span>
          </div>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="modern-tickets-section">
        <div className="modern-section-header">
          <h2 className="modern-section-title">Recent Tickets</h2>
          <div className="modern-section-actions">
            <button className="btn btn-secondary btn-sm">
              <FaFilter />
              <span>Filter</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/tickets")}
            >
              <FaEye />
              <span>View All</span>
            </button>
          </div>
        </div>

        <div className="dashboard-tickets-grid">
          {recentTickets.map((ticket) => {
            return (
              <TicketTile
                key={ticket.id}
                ticket={{
                  id: ticket.id,
                  ticketCode: `TKT-${ticket.id.slice(0, 8)}`,
                  title: ticket.title,
                  description: ticket.description,
                  status: ticket.status,
                  priority: ticket.priority,
                  assignedTo: ticket.assignedTo,
                  department: ticket.assignedDepartmentName,
                  createdAt: ticket.createdAt.toISOString(),
                  slaDeadline: ticket.slaDeadline?.toISOString(),
                  commentCount: ticket.comments?.length || 0,
                  attachmentCount: ticket.attachments?.length || 0,
                  tags: ticket.tags,
                }}
                onClick={handleTicketClick}
                compact={true}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
