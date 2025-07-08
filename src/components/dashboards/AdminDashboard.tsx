import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaBell,
  FaFilter,
  FaRoute,
  FaShieldAlt,
  FaCog,
} from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { PageLayout } from "../common/PageLayout";
import { ticketService, reportsService } from "../../services";
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
  const [slaBreaches, setSlaBreaches] = useState<SLABreach[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "sla" | "performance"
  >("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load dashboard stats
      const dashboardData = await reportsService.getDashboardData();
      setStats({
        totalTickets: dashboardData.metrics.totalTickets,
        openTickets: dashboardData.metrics.openTickets,
        resolvedTickets: dashboardData.metrics.resolvedToday,
        overdueTickets: 15, // Mock data
        slaBreaches: 8, // Mock data
        avgResolutionTime: dashboardData.metrics.avgResolutionTime,
        userSatisfaction: dashboardData.metrics.userSatisfaction,
      });

      // Load recent tickets
      const ticketsResponse = await ticketService.getTickets({ limit: 10 });
      setRecentTickets(ticketsResponse.data.data);

      // Mock SLA breaches data
      setSlaBreaches([
        {
          id: "T-001",
          title: "Server performance issues",
          priority: "critical" as Priority,
          createdAt: new Date("2024-01-15T10:00:00Z"),
          slaDeadline: new Date("2024-01-15T14:00:00Z"),
          assignedTo: "John Smith",
          timeBreach: 6,
        },
        {
          id: "T-002",
          title: "Email configuration problem",
          priority: "high" as Priority,
          createdAt: new Date("2024-01-15T08:00:00Z"),
          slaDeadline: new Date("2024-01-15T16:00:00Z"),
          assignedTo: "Jane Doe",
          timeBreach: 2,
        },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "critical":
        return "#dc3545";
      case "high":
        return "#fd7e14";
      case "medium":
        return "#ffc107";
      case "low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case "open":
        return "#dc3545";
      case "in_progress":
        return "#007bff";
      case "pending":
        return "#ffc107";
      case "resolved":
        return "#28a745";
      case "closed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const formatTime = (hours: number): string => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="admin-dashboard loading">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="dashboard-actions">
            <Button variant="primary" icon={<FaBell />}>
              Alerts ({stats.slaBreaches})
            </Button>
            <Button variant="outline" icon={<FaFilter />}>
              Filters
            </Button>
          </div>
        </div>

        {/* Quick Access Admin Tools */}
        <div className="admin-tools">
          <Card className="admin-tools-card">
            <h3>Admin Tools</h3>
            <div className="admin-tools-grid">
              <Button
                variant="outline"
                icon={<FaRoute />}
                onClick={() => navigate("/admin/ticket-rules")}
              >
                Ticket Rules
              </Button>
              <Button
                variant="outline"
                icon={<FaShieldAlt />}
                onClick={() => navigate("/admin/settings")}
              >
                Admin Settings
              </Button>
              <Button
                variant="outline"
                icon={<FaCog />}
                onClick={() => navigate("/settings")}
              >
                System Settings
              </Button>
            </div>
          </Card>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "sla" ? "active" : ""}`}
            onClick={() => setActiveTab("sla")}
          >
            SLA Breaches
          </button>
          <button
            className={`tab-button ${
              activeTab === "performance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="dashboard-content">
            {/* Key Metrics Cards */}
            <div className="metrics-grid">
              <Card className="metric-card total">
                <div className="metric-icon">
                  <FaTicketAlt />
                </div>
                <div className="metric-content">
                  <h3>Total Tickets</h3>
                  <p className="metric-number">{stats.totalTickets}</p>
                  <span className="metric-trend">+5% from last week</span>
                </div>
              </Card>

              <Card className="metric-card open">
                <div className="metric-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="metric-content">
                  <h3>Open Tickets</h3>
                  <p className="metric-number">{stats.openTickets}</p>
                  <span className="metric-trend">-2% from yesterday</span>
                </div>
              </Card>

              <Card className="metric-card resolved">
                <div className="metric-icon">
                  <FaCheckCircle />
                </div>
                <div className="metric-content">
                  <h3>Resolved Today</h3>
                  <p className="metric-number">{stats.resolvedTickets}</p>
                  <span className="metric-trend">+15% from yesterday</span>
                </div>
              </Card>

              <Card className="metric-card overdue">
                <div className="metric-icon">
                  <FaClock />
                </div>
                <div className="metric-content">
                  <h3>Overdue</h3>
                  <p className="metric-number">{stats.overdueTickets}</p>
                  <span className="metric-trend critical">Needs attention</span>
                </div>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="secondary-metrics">
              <Card className="secondary-metric">
                <h4>Average Resolution Time</h4>
                <p className="secondary-number">
                  {formatTime(stats.avgResolutionTime)}
                </p>
              </Card>
              <Card className="secondary-metric">
                <h4>SLA Compliance</h4>
                <p className="secondary-number">92%</p>
              </Card>
              <Card className="secondary-metric">
                <h4>User Satisfaction</h4>
                <p className="secondary-number">
                  {(stats.userSatisfaction * 100).toFixed(0)}%
                </p>
              </Card>
              <Card className="secondary-metric">
                <h4>Active Agents</h4>
                <p className="secondary-number">24</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section">
              <Card className="recent-tickets">
                <div className="section-header">
                  <h3>Recent Tickets</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="tickets-list">
                  {recentTickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-info">
                        <h4>{ticket.title}</h4>
                        <p>
                          #{ticket.id} • Created by {ticket.createdBy}
                        </p>
                      </div>
                      <div className="ticket-meta">
                        <span
                          className="priority-badge"
                          style={{
                            backgroundColor: getPriorityColor(ticket.priority),
                          }}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(ticket.status),
                          }}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "sla" && (
          <div className="dashboard-content">
            <Card className="sla-breaches">
              <div className="section-header">
                <h3>SLA Breaches ({slaBreaches.length})</h3>
                <div className="sla-actions">
                  <Button variant="primary" size="sm">
                    Export Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
              </div>
              <div className="sla-list">
                {slaBreaches.map((breach) => (
                  <div key={breach.id} className="sla-item">
                    <div className="sla-info">
                      <h4>{breach.title}</h4>
                      <p>
                        #{breach.id} • Assigned to {breach.assignedTo}
                      </p>
                      <div className="sla-timeline">
                        <span>
                          Created: {breach.createdAt.toLocaleDateString()}
                        </span>
                        <span>
                          SLA: {breach.slaDeadline.toLocaleDateString()}
                        </span>
                        <span className="breach-time">
                          Overdue by {breach.timeBreach} hours
                        </span>
                      </div>
                    </div>
                    <div className="sla-meta">
                      <span
                        className="priority-badge"
                        style={{
                          backgroundColor: getPriorityColor(breach.priority),
                        }}
                      >
                        {breach.priority}
                      </span>
                      <div className="sla-actions">
                        <Button variant="outline" size="sm">
                          Escalate
                        </Button>
                        <Button variant="primary" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="dashboard-content">
            <div className="performance-grid">
              <Card className="performance-chart">
                <h3>Ticket Trends (Last 30 Days)</h3>
                <div className="chart-placeholder">
                  <FaChartLine size={48} />
                  <p>Chart visualization would go here</p>
                </div>
              </Card>

              <Card className="agent-performance">
                <h3>Top Performing Agents</h3>
                <div className="agent-list">
                  <div className="agent-item">
                    <span className="agent-name">John Smith</span>
                    <span className="agent-score">98%</span>
                  </div>
                  <div className="agent-item">
                    <span className="agent-name">Jane Doe</span>
                    <span className="agent-score">95%</span>
                  </div>
                  <div className="agent-item">
                    <span className="agent-name">Mike Wilson</span>
                    <span className="agent-score">92%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
