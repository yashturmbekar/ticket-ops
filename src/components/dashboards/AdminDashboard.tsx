import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaArrowUp,
  FaChartLine,
  FaBolt,
  FaEye,
  FaChartBar,
  FaExclamationCircle,
  FaTasks,
  FaBusinessTime,
  FaCalendarCheck,
  FaBuilding,
  FaUser,
} from "react-icons/fa";
import { Loader, TicketTile } from "../common";
import type { Ticket } from "../../types";
import { searchTickets, searchMyTickets } from "../../services";
import { transformApiTicketsToTickets } from "../../utils/apiTransforms";
import { useNotifications } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/dashboardShared.css";

interface AdminDashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  slaBreaches: number;
  overdueTickets: number;
  avgResolutionTime: number;
  todayTickets: number;
  weeklyTickets: number;
  monthlyTickets: number;
  teamEfficiency: number;
  userSatisfaction: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    criticalTickets: 0,
    slaBreaches: 0,
    overdueTickets: 0,
    avgResolutionTime: 0,
    todayTickets: 0,
    weeklyTickets: 0,
    monthlyTickets: 0,
    teamEfficiency: 0,
    userSatisfaction: 0,
  });
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<"organization" | "my">(
    "organization"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch real tickets from API
        const [allTicketsResponse, recentTicketsResponse, myTicketsResponse] =
          await Promise.all([
            searchTickets({}, 0, 100, "createdDate,desc"), // Get more tickets for comprehensive stats
            searchTickets({}, 0, 12, "createdDate,desc"), // Get recent tickets for display
            searchMyTickets({ createdBy: user?.id }, 0, 12, "createdDate,desc"), // Get user's tickets
          ]);

        // Extract tickets from API response
        const allApiTickets = allTicketsResponse.items || [];
        const recentApiTickets = recentTicketsResponse.items || [];
        const myApiTickets = myTicketsResponse.items || [];

        if (allApiTickets.length > 0) {
          // Transform API tickets to internal format
          const allTransformedTickets =
            transformApiTicketsToTickets(allApiTickets);
          const recentTransformedTickets =
            transformApiTicketsToTickets(recentApiTickets);
          const myTransformedTickets =
            transformApiTicketsToTickets(myApiTickets);

          // Calculate comprehensive admin statistics
          const totalTickets = allTransformedTickets.length;
          const openTickets = allTransformedTickets.filter(
            (t: Ticket) =>
              t.status === "RAISED" ||
              t.status === "IN_PROGRESS" ||
              t.status === "PENDING_APPROVAL"
          ).length;

          const resolvedTickets = allTransformedTickets.filter(
            (t: Ticket) => t.status === "RESOLVED" || t.status === "APPROVED"
          ).length;

          const criticalTickets = allTransformedTickets.filter(
            (t: Ticket) => t.priority === "CRITICAL" || t.priority === "HIGH"
          ).length;

          // Calculate SLA breaches and overdue tickets
          const now = new Date();
          const overdueTickets = allTransformedTickets.filter((t: Ticket) => {
            if (
              t.slaDeadline &&
              (t.status === "RAISED" || t.status === "IN_PROGRESS")
            ) {
              return new Date(t.slaDeadline) < now;
            }
            return false;
          }).length;

          // Calculate time-based metrics
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTickets = allTransformedTickets.filter(
            (t: Ticket) => new Date(t.createdAt) >= today
          ).length;

          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - 7);
          const weeklyTickets = allTransformedTickets.filter(
            (t: Ticket) => new Date(t.createdAt) >= weekStart
          ).length;

          const monthStart = new Date(today);
          monthStart.setDate(today.getDate() - 30);
          const monthlyTickets = allTransformedTickets.filter(
            (t: Ticket) => new Date(t.createdAt) >= monthStart
          ).length;

          // Calculate team efficiency (resolved vs total in current month)
          const resolvedThisMonth = allTransformedTickets.filter(
            (t: Ticket) =>
              (t.status === "RESOLVED" || t.status === "APPROVED") &&
              new Date(t.updatedAt) >= monthStart
          ).length;

          const teamEfficiency =
            monthlyTickets > 0
              ? Math.round((resolvedThisMonth / monthlyTickets) * 100)
              : 100;

          setStats({
            totalTickets,
            openTickets,
            resolvedTickets,
            criticalTickets,
            slaBreaches: overdueTickets, // Using overdue as proxy for SLA breaches
            overdueTickets,
            avgResolutionTime: 18.5, // This would need more complex calculation with actual resolution times
            todayTickets,
            weeklyTickets,
            monthlyTickets,
            teamEfficiency,
            userSatisfaction: 4.2, // This would come from separate satisfaction API
          });

          // Filter active tickets for dashboard display
          const activeTickets = recentTransformedTickets.filter(
            (ticket) =>
              ticket.status !== "RESOLVED" && ticket.status !== "APPROVED"
          );

          // Filter active user tickets
          const activeMyTickets = myTransformedTickets.filter(
            (ticket) =>
              ticket.status !== "RESOLVED" && ticket.status !== "APPROVED"
          );

          setRecentTickets(activeTickets);
          setMyTickets(activeMyTickets);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load dashboard data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [addNotification, user?.id]);

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
            Comprehensive IT helpdesk operations monitoring and management
          </p>
        </div>
        <div className="modern-dashboard-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/reports")}
          >
            <FaChartLine />
            <span>Advanced Reports</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tickets")}
          >
            <FaTasks />
            <span>Manage Tickets</span>
          </button>
        </div>
      </div>

      {/* Enhanced Admin Stats Grid */}
      <div className="modern-stats-grid admin">
        {/* Total Tickets */}
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
            <span>
              +
              {stats.totalTickets > 0
                ? Math.round((stats.weeklyTickets / stats.totalTickets) * 100)
                : 0}
              % this week
            </span>
          </div>
          <div className="admin-metric-detail">
            <div className="metric-trend">
              <span>Monthly: {stats.monthlyTickets}</span>
            </div>
            <div className="metric-period">Last 30 days</div>
          </div>
        </div>

        {/* Active Tickets */}
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon info">
              <FaBolt />
            </div>
          </div>
          <div className="modern-stat-value">{stats.openTickets}</div>
          <div className="modern-stat-label">Active Tickets</div>
          <div className="modern-stat-change neutral">
            <span>Currently in progress</span>
          </div>
          <div className="admin-metric-detail">
            <div className="metric-trend">
              <span>Today: {stats.todayTickets}</span>
            </div>
            <div className="metric-period">New today</div>
          </div>
        </div>

        {/* Resolved Tickets */}
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
            <span>
              +
              {stats.totalTickets > 0
                ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100)
                : 0}
              % resolution rate
            </span>
          </div>
          <div className="admin-metric-detail">
            <div className="metric-trend">
              <span>Avg Time: {stats.avgResolutionTime}h</span>
            </div>
            <div className="metric-period">Resolution time</div>
          </div>
        </div>

        {/* Critical Tickets */}
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon warning">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="modern-stat-value">{stats.criticalTickets}</div>
          <div className="modern-stat-label">Critical & High Priority</div>
          <div className="modern-stat-change negative">
            <FaBusinessTime />
            <span>Requires immediate attention</span>
          </div>
          <div className="admin-metric-detail">
            <div className="metric-trend">
              <span>
                {stats.openTickets > 0
                  ? Math.round(
                      (stats.criticalTickets / stats.openTickets) * 100
                    )
                  : 0}
                % of active
              </span>
            </div>
            <div className="metric-period">Priority distribution</div>
          </div>
        </div>

        {/* SLA & Overdue */}
        <div className="modern-stat-card stat-highlight">
          <div className="modern-stat-header">
            <div className="modern-stat-icon error">
              <FaClock />
            </div>
          </div>
          <div className="modern-stat-value">{stats.overdueTickets}</div>
          <div className="modern-stat-label">Overdue Tickets</div>
          <div className="modern-stat-change negative">
            <FaExclamationCircle />
            <span>SLA breaches detected</span>
          </div>
          <div className="admin-metric-detail">
            <div className="metric-trend">
              <span>Breaches: {stats.slaBreaches}</span>
            </div>
            <div className="metric-period">Immediate action needed</div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon success">
              <FaChartBar />
            </div>
          </div>
          <div className="modern-stat-value">{stats.teamEfficiency}%</div>
          <div className="modern-stat-label">Team Efficiency</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>Performance this month</span>
          </div>
          <div className="admin-metric-detail">
            <div className="metric-trend">
              <span>Satisfaction: {stats.userSatisfaction}/5.0</span>
            </div>
            <div className="metric-period">User feedback</div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="modern-tickets-section">
        <div className="modern-section-header">
          <h2 className="modern-section-title">Active Tickets</h2>
          <div className="modern-section-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/tickets")}
            >
              <FaEye />
              <span>View All Tickets</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="modern-tabs">
          <button
            className={`modern-tab ${
              activeTab === "organization" ? "active" : ""
            }`}
            onClick={() => setActiveTab("organization")}
          >
            <FaBuilding />
            <span>Organisation Tickets</span>
            <span className="tab-count">{recentTickets.length}</span>
          </button>
          <button
            className={`modern-tab ${activeTab === "my" ? "active" : ""}`}
            onClick={() => setActiveTab("my")}
          >
            <FaUser />
            <span>My Tickets</span>
            <span className="tab-count">{myTickets.length}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="modern-tab-content">
          <div className="dashboard-tickets-grid">
            {activeTab === "organization" ? (
              recentTickets.length > 0 ? (
                recentTickets.slice(0, 8).map((ticket) => {
                  // Type cast to access extended properties from API transform
                  const extendedTicket = ticket as Ticket & {
                    assignedToDetails?: {
                      employeeName: string;
                      designation: string;
                    };
                    raiserEmployeeDetails?: {
                      employeeName: string;
                      designation: string;
                    };
                  };
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
                        assignedToDetails: extendedTicket.assignedToDetails,
                        createdBy: ticket.createdBy,
                        raiserEmployeeDetails:
                          extendedTicket.raiserEmployeeDetails || {
                            employeeName: ticket.createdBy || "Unknown",
                            designation: "Employee",
                          },
                        department: ticket.assignedDepartmentName,
                        helpdeskDepartmentDetails: {
                          name: ticket.assignedDepartmentName || "Unknown",
                        },
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
                })
              ) : (
                <div className="modern-empty-state-full">
                  <div className="modern-empty-icon">
                    <FaCalendarCheck />
                  </div>
                  <h3>All caught up!</h3>
                  <p>
                    No active organisation tickets at the moment. Your team is
                    doing great!
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/tickets")}
                  >
                    <FaEye />
                    <span>View All Tickets</span>
                  </button>
                </div>
              )
            ) : myTickets.length > 0 ? (
              myTickets.slice(0, 8).map((ticket) => {
                // Type cast to access extended properties from API transform
                const extendedTicket = ticket as Ticket & {
                  assignedToDetails?: {
                    employeeName: string;
                    designation: string;
                  };
                  raiserEmployeeDetails?: {
                    employeeName: string;
                    designation: string;
                  };
                };
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
                      assignedToDetails: extendedTicket.assignedToDetails,
                      createdBy: ticket.createdBy,
                      raiserEmployeeDetails:
                        extendedTicket.raiserEmployeeDetails || {
                          employeeName: ticket.createdBy || "Unknown",
                          designation: "Employee",
                        },
                      department: ticket.assignedDepartmentName,
                      helpdeskDepartmentDetails: {
                        name: ticket.assignedDepartmentName || "Unknown",
                      },
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
              })
            ) : (
              <div className="modern-empty-state-full">
                <div className="modern-empty-icon">
                  <FaCalendarCheck />
                </div>
                <h3>No tickets found!</h3>
                <p>You don't have any active tickets at the moment.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/create-ticket")}
                >
                  <FaTicketAlt />
                  <span>Create New Ticket</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
