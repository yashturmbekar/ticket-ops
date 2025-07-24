import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaUserCheck,
  FaChartLine,
  FaFilter,
  FaEye,
  FaTools,
  FaHeadset,
} from "react-icons/fa";
import { Loader, TicketTile } from "../common";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "../../styles/dashboardShared.css";

interface HelpdeskStats {
  myTickets: number;
  assignedTickets: number;
  resolvedToday: number;
  avgResolutionTime: number;
  ticketTrend: number;
  successRate: number;
}

export const HelpdeskDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<HelpdeskStats>({
    myTickets: 0,
    assignedTickets: 0,
    resolvedToday: 0,
    avgResolutionTime: 0,
    ticketTrend: 0,
    successRate: 0,
  });
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Simulate API calls for helpdesk stats
        const mockStats: HelpdeskStats = {
          myTickets: 12,
          assignedTickets: 8,
          resolvedToday: 5,
          avgResolutionTime: 4.2,
          ticketTrend: 12.5,
          successRate: 94.5,
        };

        // Simulate my tickets
        const mockMyTickets: Ticket[] = [
          {
            id: "TKT-1001",
            title: "Email configuration issue",
            description: "Cannot access company email",
            status: "IN_PROGRESS" as TicketStatus,
            priority: "HIGH" as Priority,
            assignedDepartmentId: "dept-1",
            createdBy: "john.doe@company.com",
            assignedTo: "helpdesk@company.com",
            createdAt: new Date("2024-01-15T09:00:00Z"),
            updatedAt: new Date("2024-01-15T10:30:00Z"),
            slaDeadline: new Date("2024-01-16T09:00:00Z"),
            tags: ["email", "access"],
            attachments: [],
            comments: [],
          },
          {
            id: "TKT-1002",
            title: "Software installation request",
            description: "Need Microsoft Office 365 installed",
            status: "RAISED" as TicketStatus,
            priority: "MEDIUM" as Priority,
            assignedDepartmentId: "dept-1",
            createdBy: "jane.smith@company.com",
            assignedTo: "helpdesk@company.com",
            createdAt: new Date("2024-01-15T11:00:00Z"),
            updatedAt: new Date("2024-01-15T11:00:00Z"),
            slaDeadline: new Date("2024-01-16T11:00:00Z"),
            tags: ["software", "installation"],
            attachments: [],
            comments: [],
          },
        ];

        // Simulate assigned tickets
        const mockAssignedTickets: Ticket[] = [
          {
            id: "TKT-1003",
            title: "Network connectivity problem",
            description: "Cannot connect to internal network",
            status: "IN_PROGRESS" as TicketStatus,
            priority: "HIGH" as Priority,
            assignedDepartmentId: "dept-1",
            createdBy: "mike.wilson@company.com",
            assignedTo: "helpdesk@company.com",
            createdAt: new Date("2024-01-15T08:00:00Z"),
            updatedAt: new Date("2024-01-15T09:00:00Z"),
            slaDeadline: new Date("2024-01-16T08:00:00Z"),
            tags: ["network", "connectivity"],
            attachments: [],
            comments: [],
          },
        ];

        setStats(mockStats);
        setMyTickets(mockMyTickets);
        setAssignedTickets(mockAssignedTickets);
      } catch (error) {
        console.error("Error fetching helpdesk dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewAllMyTickets = () => {
    navigate("/tickets/my");
  };

  const handleViewAllAssignedTickets = () => {
    navigate("/tickets/assigned");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <FaHeadset className="title-icon" />
          Helpdesk Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Manage your tickets and provide excellent customer support
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FaTicketAlt />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.myTickets}</h3>
            <p className="stat-label">My Tickets</p>
            <div className="stat-trend positive">
              <FaArrowUp />
              <span>{stats.ticketTrend}% this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FaUserCheck />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.assignedTickets}</h3>
            <p className="stat-label">Assigned to Me</p>
            <div className="stat-trend">
              <span>Active assignments</span>
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FaTools />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.resolvedToday}</h3>
            <p className="stat-label">Resolved Today</p>
            <div className="stat-trend positive">
              <FaArrowUp />
              <span>Great progress!</span>
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.avgResolutionTime}h</h3>
            <p className="stat-label">Avg Resolution Time</p>
            <div className="stat-trend positive">
              <FaArrowDown />
              <span>Improved efficiency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* My Recent Tickets */}
        <div className="dashboard-section tickets-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaTicketAlt className="section-icon" />
              My Recent Tickets
            </h2>
            <button className="btn-view-all" onClick={handleViewAllMyTickets}>
              <FaEye />
              View All
            </button>
          </div>
          <div className="tickets-list">
            {myTickets.length > 0 ? (
              myTickets.slice(0, 5).map((ticket) => (
                <TicketTile
                  key={ticket.id}
                  ticket={{
                    id: ticket.id,
                    title: ticket.title,
                    description: ticket.description,
                    status: ticket.status,
                    priority: ticket.priority,
                    assignedTo: ticket.assignedTo,
                    createdAt: ticket.createdAt.toISOString(),
                    slaDeadline: ticket.slaDeadline.toISOString(),
                    tags: ticket.tags,
                  }}
                />
              ))
            ) : (
              <div className="empty-state">
                <FaTicketAlt className="empty-icon" />
                <p>No tickets found</p>
              </div>
            )}
          </div>
        </div>

        {/* My Recent Assigned Tickets */}
        <div className="dashboard-section assigned-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaUserCheck className="section-icon" />
              My Recent Assigned Tickets
            </h2>
            <button
              className="btn-view-all"
              onClick={handleViewAllAssignedTickets}
            >
              <FaEye />
              View All
            </button>
          </div>
          <div className="tickets-list">
            {assignedTickets.length > 0 ? (
              assignedTickets.slice(0, 5).map((ticket) => (
                <TicketTile
                  key={ticket.id}
                  ticket={{
                    id: ticket.id,
                    title: ticket.title,
                    description: ticket.description,
                    status: ticket.status,
                    priority: ticket.priority,
                    assignedTo: ticket.assignedTo,
                    createdAt: ticket.createdAt.toISOString(),
                    slaDeadline: ticket.slaDeadline.toISOString(),
                    tags: ticket.tags,
                  }}
                />
              ))
            ) : (
              <div className="empty-state">
                <FaUserCheck className="empty-icon" />
                <p>No assigned tickets found</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="dashboard-section performance-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaChartLine className="section-icon" />
              Performance Overview
            </h2>
          </div>
          <div className="performance-metrics">
            <div className="metric-item">
              <div className="metric-label">Success Rate</div>
              <div className="metric-value">{stats.successRate}%</div>
              <div className="metric-bar">
                <div
                  className="metric-fill success"
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Average Rating</div>
              <div className="metric-value">4.8/5</div>
              <div className="metric-bar">
                <div
                  className="metric-fill success"
                  style={{ width: "96%" }}
                ></div>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">First Contact Resolution</div>
              <div className="metric-value">87%</div>
              <div className="metric-bar">
                <div
                  className="metric-fill warning"
                  style={{ width: "87%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section actions-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaFilter className="section-icon" />
              Quick Actions
            </h2>
          </div>
          <div className="quick-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate("/tickets/create")}
            >
              <FaTicketAlt />
              Create New Ticket
            </button>
            <button
              className="action-btn success"
              onClick={() => navigate("/tickets/my")}
            >
              <FaEye />
              View My Tickets
            </button>
            <button
              className="action-btn warning"
              onClick={() => navigate("/tickets/assigned")}
            >
              <FaUserCheck />
              Assigned Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpdeskDashboard;
