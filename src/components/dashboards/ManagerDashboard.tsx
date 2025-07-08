import React, { useState, useEffect, useCallback } from "react";
import {
  FaUsers,
  FaTicketAlt,
  FaTasks,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaCalendar,
  FaUser,
  FaComment,
  FaClipboardList,
} from "react-icons/fa";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { PageLayout } from "../common/PageLayout";
import { useAuth } from "../../hooks/useAuth";
import { ticketService } from "../../services";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "./ManagerDashboard.css";

interface ManagerMetrics {
  totalTickets: number;
  teamTickets: number;
  avgResolutionTime: number;
  teamPerformance: number;
  pendingApprovals: number;
  slaBreaches: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  ticketsAssigned: number;
  avgResolutionTime: number;
  status: "online" | "offline" | "away";
}

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ManagerMetrics>({
    totalTickets: 0,
    teamTickets: 0,
    avgResolutionTime: 0,
    teamPerformance: 0,
    pendingApprovals: 0,
    slaBreaches: 0,
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "team" | "approvals" | "performance"
  >("overview");
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Load tickets for the manager's team
      const ticketsResponse = await ticketService.getTickets({
        page: 1,
        limit: 50,
      });

      if (ticketsResponse.success) {
        const teamTickets = ticketsResponse.data.data;
        setTickets(teamTickets);

        // Calculate metrics
        const totalTickets = teamTickets.length;
        const openTickets = teamTickets.filter(
          (t: Ticket) => t.status === "open"
        ).length;
        const slaBreaches = teamTickets.filter(
          (t: Ticket) => t.slaDeadline && new Date(t.slaDeadline) < new Date()
        ).length;

        setMetrics({
          totalTickets,
          teamTickets: openTickets,
          avgResolutionTime: 2.5, // Mock data
          teamPerformance: 85, // Mock data
          pendingApprovals: 12, // Mock data
          slaBreaches,
        });
      }

      // Mock team members data
      setTeamMembers([
        {
          id: "1",
          name: "John Doe",
          role: "Support Agent",
          ticketsAssigned: 15,
          avgResolutionTime: 2.1,
          status: "online",
        },
        {
          id: "2",
          name: "Jane Smith",
          role: "IT Specialist",
          ticketsAssigned: 12,
          avgResolutionTime: 1.8,
          status: "online",
        },
        {
          id: "3",
          name: "Mike Chen",
          role: "Network Administrator",
          ticketsAssigned: 8,
          avgResolutionTime: 3.2,
          status: "away",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleTicketAction = async (
    ticketId: string,
    action: "assign" | "escalate" | "approve"
  ) => {
    try {
      // Implementation would depend on the specific action
      console.log(`Performing ${action} on ticket ${ticketId}`);
      // Reload data after action
      loadDashboardData();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return "#f44336";
      case "in_progress":
        return "#2196f3";
      case "pending":
        return "#ff9800";
      case "resolved":
        return "#4caf50";
      case "closed":
        return "#9e9e9e";
      default:
        return "#757575";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "critical":
        return "#d32f2f";
      case "high":
        return "#f57c00";
      case "medium":
        return "#1976d2";
      case "low":
        return "#388e3c";
      default:
        return "#757575";
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="manager-dashboard">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="manager-dashboard">
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>
            Welcome back, {user?.firstName || user?.email}! Here's your team
            overview.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaTicketAlt />
              </div>
              <div className="metric-details">
                <h3>{metrics.totalTickets}</h3>
                <p>Total Tickets</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaTasks />
              </div>
              <div className="metric-details">
                <h3>{metrics.teamTickets}</h3>
                <p>Team Tickets</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaClock />
              </div>
              <div className="metric-details">
                <h3>{metrics.avgResolutionTime}h</h3>
                <p>Avg Resolution Time</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaChartLine />
              </div>
              <div className="metric-details">
                <h3>{metrics.teamPerformance}%</h3>
                <p>Team Performance</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaClipboardList />
              </div>
              <div className="metric-details">
                <h3>{metrics.pendingApprovals}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-content">
              <div className="metric-icon">
                <FaExclamationTriangle />
              </div>
              <div className="metric-details">
                <h3>{metrics.slaBreaches}</h3>
                <p>SLA Breaches</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaTicketAlt />
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <FaUsers />
            Team Management
          </button>
          <button
            className={`tab-button ${
              activeTab === "approvals" ? "active" : ""
            }`}
            onClick={() => setActiveTab("approvals")}
          >
            <FaClipboardList />
            Approvals
          </button>
          <button
            className={`tab-button ${
              activeTab === "performance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("performance")}
          >
            <FaChartLine />
            Performance
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <Card className="recent-tickets">
                <h3>Recent Team Tickets</h3>
                <div className="ticket-list">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="ticket-item"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="ticket-info">
                        <h4>{ticket.title}</h4>
                        <p>
                          <span className="ticket-id">#{ticket.id}</span>
                          <FaCalendar />{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                          <FaUser /> {ticket.assignedTo || "Unassigned"}
                        </p>
                      </div>
                      <div className="ticket-meta">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(ticket.status),
                          }}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className="priority-badge"
                          style={{
                            backgroundColor: getPriorityColor(ticket.priority),
                          }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="team-overview">
                <h3>Team Overview</h3>
                <div className="team-stats">
                  <div className="stat-item">
                    <FaUsers />
                    <div>
                      <h4>{teamMembers.length}</h4>
                      <p>Team Members</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <FaCheckCircle />
                    <div>
                      <h4>
                        {
                          teamMembers.filter((m) => m.status === "online")
                            .length
                        }
                      </h4>
                      <p>Online Now</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <FaClock />
                    <div>
                      <h4>
                        {(
                          teamMembers.reduce(
                            (acc, m) => acc + m.avgResolutionTime,
                            0
                          ) / teamMembers.length
                        ).toFixed(1)}
                        h
                      </h4>
                      <p>Team Avg Resolution</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="team-header">
                <h3>Team Management</h3>
                <Button variant="primary">Add Member</Button>
              </div>
              <div className="team-grid">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="team-member-card">
                    <div className="member-info">
                      <div className="member-avatar">
                        {member.name.charAt(0)}
                      </div>
                      <div className="member-details">
                        <h4>{member.name}</h4>
                        <p>{member.role}</p>
                        <span className={`status-indicator ${member.status}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                    <div className="member-stats">
                      <div className="stat">
                        <span className="stat-value">
                          {member.ticketsAssigned}
                        </span>
                        <span className="stat-label">Assigned</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">
                          {member.avgResolutionTime}h
                        </span>
                        <span className="stat-label">Avg Time</span>
                      </div>
                    </div>
                    <div className="member-actions">
                      <Button variant="outline" size="sm">
                        <FaEye />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <FaComment />
                        Message
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "approvals" && (
            <div>
              <h3>Pending Approvals</h3>
              <div className="approval-list">
                {tickets
                  .filter((t) => t.status === "pending")
                  .map((ticket) => (
                    <div key={ticket.id} className="approval-item">
                      <div className="approval-info">
                        <h4>{ticket.title}</h4>
                        <p>
                          <FaUser /> {ticket.createdBy}
                          <FaCalendar />{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}
                          <span className="ticket-id">#{ticket.id}</span>
                        </p>
                      </div>
                      <div className="approval-actions">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleTicketAction(ticket.id, "approve")
                          }
                        >
                          <FaCheckCircle />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <FaEye />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="performance-grid">
              <Card className="performance-chart">
                <h3>Performance Chart</h3>
                <p>Chart placeholder - would integrate with charting library</p>
              </Card>
              <Card className="sla-metrics">
                <h3>SLA Metrics</h3>
                <div className="sla-item">
                  <span className="sla-label">On-time Resolution</span>
                  <span className="sla-value">87%</span>
                </div>
                <div className="sla-item">
                  <span className="sla-label">Response Time</span>
                  <span className="sla-value">2.3h</span>
                </div>
                <div className="sla-item">
                  <span className="sla-label">Customer Satisfaction</span>
                  <span className="sla-value">4.2/5</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <Modal
            isOpen={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            title={`Ticket #${selectedTicket.id}`}
          >
            <div className="ticket-detail">
              <h3>{selectedTicket.title}</h3>
              <p>
                <strong>Status:</strong> {selectedTicket.status}
              </p>
              <p>
                <strong>Priority:</strong> {selectedTicket.priority}
              </p>
              <p>
                <strong>Assigned to:</strong>{" "}
                {selectedTicket.assignedTo || "Unassigned"}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedTicket.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong>
              </p>
              <p>{selectedTicket.description}</p>
            </div>
          </Modal>
        )}
      </div>
    </PageLayout>
  );
};
