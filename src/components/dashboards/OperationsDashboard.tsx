import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getTickets, updateTicket, getTicketStats } from "../../services";
import { useNotifications } from "../../hooks";
import { transformApiTicketsToTickets } from "../../utils/apiTransforms";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "./OperationsDashboard.css";

interface OperationsMetrics {
  assignedTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
  avgResolutionTime: number;
  slaBreaches: number;
  teamAvgResolutionTime: number;
  performanceScore: number;
}

export const OperationsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [metrics, setMetrics] = useState<OperationsMetrics>({
    assignedTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedToday: 0,
    avgResolutionTime: 0,
    slaBreaches: 0,
    teamAvgResolutionTime: 0,
    performanceScore: 0,
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<
    "assigned" | "team" | "sla" | "reports"
  >("assigned");
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Load tickets and stats in parallel
      const [ticketsResponse, statsResponse] = await Promise.all([
        getTickets({ page: 1, limit: 100 }),
        getTicketStats(),
      ]);

      if (ticketsResponse.success && ticketsResponse.data?.data) {
        const apiTickets = ticketsResponse.data.data;
        // Transform API tickets to internal format if needed
        const allTickets =
          Array.isArray(apiTickets) &&
          apiTickets.length > 0 &&
          "ticketCode" in apiTickets[0]
            ? transformApiTicketsToTickets(apiTickets)
            : apiTickets;

        const userTickets = allTickets.filter(
          (t: Ticket) => t.assignedTo === user?.id
        );
        setTickets(userTickets);

        // Calculate real metrics from tickets
        const assignedTickets = userTickets.length;
        const openTickets = userTickets.filter(
          (t: Ticket) => t.status === "RAISED"
        ).length;
        const inProgressTickets = userTickets.filter(
          (t: Ticket) => t.status === "IN_PROGRESS"
        ).length;
        const resolvedToday = userTickets.filter((t: Ticket) => {
          const today = new Date();
          const resolvedDate = t.resolvedAt ? new Date(t.resolvedAt) : null;
          return (
            resolvedDate && resolvedDate.toDateString() === today.toDateString()
          );
        }).length;
        const slaBreaches = userTickets.filter(
          (t: Ticket) => t.slaDeadline && new Date(t.slaDeadline) < new Date()
        ).length;

        // Use stats API data where available
        const apiStats = statsResponse.data || {};

        setMetrics({
          assignedTickets,
          openTickets,
          inProgressTickets,
          resolvedToday,
          avgResolutionTime: apiStats.avgResolutionTime || 0,
          slaBreaches,
          teamAvgResolutionTime: apiStats.teamAvgResolutionTime || 0,
          performanceScore: apiStats.performanceScore || 0,
        });
      }
    } catch (error: unknown) {
      console.error("Error loading operations dashboard:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addNotification({
        type: "error",
        title: "Failed to Load Dashboard",
        message: `Failed to load operations dashboard: ${errorMessage}`,
      });
      // Ensure tickets is always an array even on error
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, addNotification]);

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

  const updateTicketStatus = async (
    ticketId: string,
    newStatus: TicketStatus
  ) => {
    try {
      await updateTicket(ticketId, { status: newStatus });
      loadDashboardData();
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  if (loading) {
    return (
      <div className="compact-header">
        <h1>Operations Dashboard</h1>
        <p>Loading operations dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="compact-header">
        <h1>Operations Dashboard</h1>
        <div className="actions-container">
          <input
            type="search"
            placeholder="Search tickets..."
            className="compact-search"
          />
          <button className="compact-btn primary">Create Ticket</button>
          <button className="compact-btn">Refresh</button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="compact-stats">
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.assignedTickets}</div>
          <div className="compact-stat-label">Assigned Tickets</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.openTickets}</div>
          <div className="compact-stat-label">Open Tickets</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.inProgressTickets}</div>
          <div className="compact-stat-label">In Progress</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.resolvedToday}</div>
          <div className="compact-stat-label">Resolved Today</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">
            {formatTime(metrics.avgResolutionTime)}
          </div>
          <div className="compact-stat-label">Avg Resolution</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.slaBreaches}</div>
          <div className="compact-stat-label">SLA Breaches</div>
        </div>
        <div className="compact-stat-card">
          <div className="compact-stat-value">{metrics.performanceScore}%</div>
          <div className="compact-stat-label">Performance Score</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="actions-container">
        <button
          className={`compact-btn ${activeTab === "assigned" ? "primary" : ""}`}
          onClick={() => setActiveTab("assigned")}
        >
          My Tickets
        </button>
        <button
          className={`compact-btn ${activeTab === "team" ? "primary" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Team Queue
        </button>
        <button
          className={`compact-btn ${activeTab === "sla" ? "primary" : ""}`}
          onClick={() => setActiveTab("sla")}
        >
          SLA Monitoring
        </button>
        <button
          className={`compact-btn ${activeTab === "reports" ? "primary" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "assigned" && (
        <div className="compact-card">
          <h3>My Assigned Tickets</h3>
          <table className="compact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>SLA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(tickets || []).map((ticket) => (
                <tr key={ticket.id} onClick={() => handleTicketClick(ticket)}>
                  <td>#{ticket.id.slice(0, 8)}</td>
                  <td>{ticket.title}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    {ticket.slaDeadline ? (
                      <span
                        className={`compact-badge ${
                          new Date(ticket.slaDeadline) < new Date()
                            ? "high"
                            : "medium"
                        }`}
                      >
                        {new Date(ticket.slaDeadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="compact-badge">No SLA</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-container">
                      {ticket.status === "RAISED" && (
                        <button
                          className="compact-btn primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTicketStatus(ticket.id, "IN_PROGRESS");
                          }}
                        >
                          Start
                        </button>
                      )}
                      {ticket.status === "IN_PROGRESS" && (
                        <button
                          className="compact-btn success"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTicketStatus(ticket.id, "RESOLVED");
                          }}
                        >
                          Resolve
                        </button>
                      )}
                      <button className="compact-btn">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "team" && (
        <div className="compact-card">
          <h3>Team Ticket Queue</h3>
          <div className="actions-container">
            <button className="compact-btn">Filter by Priority</button>
            <button className="compact-btn">Filter by Status</button>
            <button className="compact-btn">Auto-assign</button>
          </div>
          <table className="compact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 20).map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.id.slice(0, 8)}</td>
                  <td>{ticket.title}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>{ticket.assignedTo || "Unassigned"}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="compact-btn">Assign</button>
                    <button className="compact-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "sla" && (
        <div className="compact-card">
          <h3>SLA Monitoring</h3>
          <div className="compact-stats">
            <div className="compact-stat-card">
              <div className="compact-stat-value">{metrics.slaBreaches}</div>
              <div className="compact-stat-label">Breached SLAs</div>
            </div>
            <div className="compact-stat-card">
              <div className="compact-stat-value">15</div>
              <div className="compact-stat-label">At Risk</div>
            </div>
            <div className="compact-stat-card">
              <div className="compact-stat-value">92%</div>
              <div className="compact-stat-label">SLA Compliance</div>
            </div>
          </div>
          <table className="compact-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>SLA Deadline</th>
                <th>Time Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets
                .filter((t) => t.slaDeadline)
                .map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id.slice(0, 8)}</td>
                    <td>{ticket.title}</td>
                    <td>{getPriorityBadge(ticket.priority)}</td>
                    <td>
                      {ticket.slaDeadline
                        ? new Date(ticket.slaDeadline).toLocaleDateString()
                        : "No SLA"}
                    </td>
                    <td>
                      {ticket.slaDeadline ? (
                        <span
                          className={`compact-badge ${
                            new Date(ticket.slaDeadline) < new Date()
                              ? "high"
                              : "medium"
                          }`}
                        >
                          {new Date(ticket.slaDeadline) < new Date()
                            ? "OVERDUE"
                            : "On Time"}
                        </span>
                      ) : (
                        <span className="compact-badge">No SLA</span>
                      )}
                    </td>
                    <td>{getStatusBadge(ticket.status)}</td>
                    <td>
                      <button className="compact-btn primary">
                        Prioritize
                      </button>
                      <button className="compact-btn">View</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="compact-grid compact-grid-2">
          <div className="compact-card">
            <h3>Performance Summary</h3>
            <div className="compact-stats">
              <div className="compact-stat-card">
                <div className="compact-stat-value">
                  {metrics.performanceScore}%
                </div>
                <div className="compact-stat-label">Performance Score</div>
              </div>
              <div className="compact-stat-card">
                <div className="compact-stat-value">
                  {formatTime(metrics.avgResolutionTime)}
                </div>
                <div className="compact-stat-label">Avg Resolution Time</div>
              </div>
              <div className="compact-stat-card">
                <div className="compact-stat-value">
                  {metrics.resolvedToday}
                </div>
                <div className="compact-stat-label">Tickets Resolved Today</div>
              </div>
            </div>
          </div>

          <div className="compact-card">
            <h3>Quick Actions</h3>
            <div className="actions-container">
              <button className="compact-btn primary">Export Report</button>
              <button className="compact-btn">Generate Summary</button>
              <button className="compact-btn">View Analytics</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
