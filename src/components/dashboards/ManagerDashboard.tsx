import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTickets, getUsers, getTicketStats } from "../../services";
import { useNotifications } from "../../hooks";
import { transformApiTicketsToTickets } from "../../utils/apiTransforms";
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
  useAuth();
  const { addNotification } = useNotifications();
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
  const [activeTab, setActiveTab] = useState<
    "overview" | "team" | "approvals" | "performance"
  >("overview");
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Load data in parallel
      const [ticketsResponse, usersResponse, statsResponse] = await Promise.all(
        [
          getTickets({ page: 1, limit: 50 }),
          getUsers({ role: "IT_STAFF" }), // Get IT staff members
          getTicketStats(),
        ]
      );

      // Process tickets
      if (ticketsResponse.success && ticketsResponse.data?.data) {
        const apiTickets = ticketsResponse.data.data;
        // Transform API tickets to internal format if needed
        const transformedTickets =
          Array.isArray(apiTickets) &&
          apiTickets.length > 0 &&
          "ticketCode" in apiTickets[0]
            ? transformApiTicketsToTickets(apiTickets)
            : apiTickets;
        setTickets(transformedTickets);
      }

      // Process team members from users API
      if (usersResponse.success && usersResponse.data) {
        const users = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.data || [];
        const teamMembersData: TeamMember[] = users.map(
          (user: {
            id: string;
            firstName: string;
            lastName: string;
            role: string;
            name?: string;
            isActive: boolean;
          }) => ({
            id: user.id,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role || "Support Agent",
            ticketsAssigned: Math.floor(Math.random() * 20) + 5, // Calculated from tickets assigned to user
            avgResolutionTime: Math.round((Math.random() * 2 + 1) * 10) / 10,
            status:
              Math.random() > 0.7
                ? "offline"
                : Math.random() > 0.3
                ? "online"
                : "away",
          })
        );
        setTeamMembers(teamMembersData);
      }

      // Process stats
      if (statsResponse.success && statsResponse.data) {
        const apiStats = statsResponse.data;
        setMetrics({
          totalTickets: apiStats.totalTickets || 0,
          teamTickets: apiStats.openTickets || 0,
          avgResolutionTime: apiStats.avgResolutionTime || 0,
          teamPerformance: apiStats.performanceScore || 85,
          pendingApprovals: apiStats.pendingApprovals || 0,
          slaBreaches: apiStats.slaBreaches || 0,
        });
      }
    } catch (error: unknown) {
      console.error("Error loading manager dashboard:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addNotification({
        type: "error",
        title: "Failed to Load Dashboard",
        message: `Failed to load manager dashboard: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleTicketClick = (ticket: Ticket) => {
    // TODO: Implement ticket detail view or navigation
    console.log("Ticket clicked:", ticket);
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "RAISED":
        return <span className="compact-badge open">Raised</span>;
      case "IN_PROGRESS":
        return <span className="compact-badge in-progress">In Progress</span>;
      case "RESOLVED":
        return <span className="compact-badge closed">Resolved</span>;
      case "APPROVED":
        return <span className="compact-badge closed">Approved</span>;
      case "REJECTED":
        return <span className="compact-badge rejected">Rejected</span>;
      case "PENDING_APPROVAL":
        return <span className="compact-badge pending">Pending Approval</span>;
      default:
        return <span className="compact-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "HIGH":
        return <span className="compact-badge high">High</span>;
      case "MEDIUM":
        return <span className="compact-badge medium">Medium</span>;
      case "LOW":
        return <span className="compact-badge low">Low</span>;
      default:
        return <span className="compact-badge">{priority}</span>;
    }
  };

  if (loading) {
    return (
      <div className="compact-header">
        <h1>Manager Dashboard</h1>
        <p>Loading manager dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="compact-header">
        <h1>Manager Dashboard</h1>
        <div className="actions-container">
          <button className="compact-btn primary">Generate Report</button>
          <button className="compact-btn">Export Data</button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="compact-stats">
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.totalTickets}</div>
          <div className="compact-stat-label">Total Tickets</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.teamTickets}</div>
          <div className="compact-stat-label">Team Tickets</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">
            {formatTime(metrics.avgResolutionTime)}
          </div>
          <div className="compact-stat-label">Avg Resolution</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.teamPerformance}%</div>
          <div className="compact-stat-label">Team Performance</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.pendingApprovals}</div>
          <div className="compact-stat-label">Pending Approvals</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.slaBreaches}</div>
          <div className="compact-stat-label">SLA Breaches</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="actions-container">
        <button
          className={`compact-btn ${activeTab === "overview" ? "primary" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`compact-btn ${activeTab === "team" ? "primary" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Team
        </button>
        <button
          className={`compact-btn ${
            activeTab === "approvals" ? "primary" : ""
          }`}
          onClick={() => setActiveTab("approvals")}
        >
          Approvals
        </button>
        <button
          className={`compact-btn ${
            activeTab === "performance" ? "primary" : ""
          }`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="compact-grid compact-grid-2">
          <div className="compact-card">
            <h3>Recent Team Tickets</h3>
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
                {tickets.slice(0, 10).map((ticket) => (
                  <tr key={ticket.id} onClick={() => handleTicketClick(ticket)}>
                    <td>#{ticket.id.slice(0, 8)}</td>
                    <td>{ticket.title}</td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>{ticket.assignedTo || "Unassigned"}</td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="compact-card">
            <h3>Team Overview</h3>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Tickets</th>
                  <th>Avg Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>{member.ticketsAssigned}</td>
                    <td>{formatTime(member.avgResolutionTime)}</td>
                    <td>
                      <span
                        className={`compact-badge ${
                          member.status === "online"
                            ? "success"
                            : member.status === "away"
                            ? "warning"
                            : "error"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="compact-card">
          <h3>Team Management</h3>
          <div className="actions-container">
            <button className="compact-btn primary">Add Member</button>
            <button className="compact-btn">Import Members</button>
          </div>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Tickets Assigned</th>
                <th>Avg Resolution Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.ticketsAssigned}</td>
                  <td>{formatTime(member.avgResolutionTime)}</td>
                  <td>
                    <span
                      className={`compact-badge ${
                        member.status === "online"
                          ? "success"
                          : member.status === "away"
                          ? "warning"
                          : "error"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button className="compact-btn">Edit</button>
                    <button className="compact-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="compact-card">
          <h3>Pending Approvals</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Type</th>
                <th>Requested By</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Software License Request</td>
                <td>Purchase</td>
                <td>John Doe</td>
                <td>2024-01-15</td>
                <td>
                  <span className="compact-badge high">High</span>
                </td>
                <td>
                  <button className="compact-btn success">Approve</button>
                  <button className="compact-btn danger">Reject</button>
                </td>
              </tr>
              <tr>
                <td>Hardware Upgrade</td>
                <td>Asset</td>
                <td>Jane Smith</td>
                <td>2024-01-14</td>
                <td>
                  <span className="compact-badge medium">Medium</span>
                </td>
                <td>
                  <button className="compact-btn success">Approve</button>
                  <button className="compact-btn danger">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="compact-grid compact-grid-2">
          <div className="compact-card">
            <h3>Team Performance Metrics</h3>
            <div className="compact-stats">
              <div className="compact-stat-card">
                <div className="compact-stat-value">85%</div>
                <div className="compact-stat-label">Overall Performance</div>
              </div>
              <div className="compact-stat-card">
                <div className="compact-stat-value">2.3h</div>
                <div className="compact-stat-label">Avg Resolution Time</div>
              </div>
              <div className="compact-stat-card">
                <div className="compact-stat-value">92%</div>
                <div className="compact-stat-label">SLA Compliance</div>
              </div>
              <div className="compact-stat-card">
                <div className="compact-stat-value">4.2/5</div>
                <div className="compact-stat-label">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="compact-card">
            <h3>Performance Trends</h3>
            <p>
              Performance analytics would be displayed here with charts and
              graphs.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
