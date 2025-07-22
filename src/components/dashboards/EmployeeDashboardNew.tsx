import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaEye,
  FaUser,
  FaTasks,
  FaExclamationTriangle,
  FaSpinner,
  FaBan,
} from "react-icons/fa";
import type { Ticket, TicketStatus, Priority } from "../../types";

// Extended ticket type for displaying API data
type DisplayTicket = Ticket & { ticketCode?: string };
import { searchTickets } from "../../services";
import { useNotifications } from "../../hooks";
import { transformApiTicketsToTickets } from "../../utils/apiTransforms";
import "../../styles/dashboardModern.css";
import "../../styles/ticketsModern.css";

interface EmployeeStats {
  myTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
}

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState<EmployeeStats>({
    myTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: 0,
  });
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch real data from APIs
        const [myTicketsResponse] = await Promise.all([
          searchTickets({}, 0, 50, "createdDate,desc"), // Get user's tickets
          //getTicketStats(),
        ]);

        // Process my tickets

        // Extract tickets from API response
        const apiTickets = myTicketsResponse.items || [];

        if (apiTickets.length > 0) {
          // Transform API tickets to internal format
          const transformedTickets = transformApiTicketsToTickets(apiTickets);
          console.log("Transformed Tickets:", transformedTickets); // Debug log

          setMyTickets(transformedTickets);

          // Calculate stats from actual ticket data
          const totalTickets = transformedTickets.length;
          const openTickets = transformedTickets.filter(
            (t: Ticket) => t.status === "RAISED" || t.status === "IN_PROGRESS"
          ).length;
          const resolvedTickets = transformedTickets.filter(
            (t: Ticket) => t.status === "RESOLVED"
          ).length;

          setStats({
            myTickets: totalTickets,
            openTickets: openTickets,
            resolvedTickets: resolvedTickets,
            avgResponseTime: 0,
          });
        } else {
          // No tickets found
          console.log("No tickets found in API response");
          setMyTickets([]);
          setStats({
            myTickets: 0,
            openTickets: 0,
            resolvedTickets: 0,
            avgResponseTime: 0,
          });
        }
      } catch (error: unknown) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [addNotification]);

  const getPriorityClass = (priority: Priority): string => {
    return priority.toLowerCase();
  };

  const getStatusClass = (status: TicketStatus): string => {
    return status;
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "RAISED":
        return <FaExclamationTriangle />;
      case "IN_PROGRESS":
        return <FaSpinner />;
      case "PENDING_APPROVAL":
        return <FaClock />;
      case "RESOLVED":
        return <FaCheckCircle />;
      case "APPROVED":
        return <FaCheckCircle />;
      case "REJECTED":
        return <FaBan />;
      default:
        return <FaTicketAlt />;
    }
  };

  const getSLAStatus = (deadline: Date): { status: string; text: string } => {
    const now = new Date();
    const hoursUntilDeadline =
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline < 0) {
      return { status: "critical", text: "Overdue" };
    } else if (hoursUntilDeadline < 2) {
      return { status: "warning", text: "Due soon" };
    } else {
      return { status: "good", text: "On track" };
    }
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
          <h1 className="modern-dashboard-title">My Dashboard</h1>
          <p className="modern-dashboard-subtitle">
            Track your tickets and get the help you need
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="modern-stats-grid">
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon primary">
              <FaUser />
            </div>
          </div>
          <div className="modern-stat-value">{stats.myTickets}</div>
          <div className="modern-stat-label">My Tickets</div>
          <div className="modern-stat-change neutral">
            <span>Total submitted</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon info">
              <FaTicketAlt />
            </div>
          </div>
          <div className="modern-stat-value">{stats.openTickets}</div>
          <div className="modern-stat-label">Raised Tickets</div>
          <div className="modern-stat-change neutral">
            <span>Awaiting resolution</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon success">
              <FaCheckCircle />
            </div>
          </div>
          <div className="modern-stat-value">{stats.resolvedTickets}</div>
          <div className="modern-stat-label">Resolved</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>Issues solved</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon warning">
              <FaClock />
            </div>
          </div>
          <div className="modern-stat-value">
            {stats.avgResponseTime.toFixed(1)}h
          </div>
          <div className="modern-stat-label">Avg Response</div>
          <div className="modern-stat-change neutral">
            <span>Support team</span>
          </div>
        </div>
      </div>

      {/* My Tickets Section */}
      <div className="modern-tickets-section">
        <div className="modern-section-header">
          <h2 className="modern-section-title">My Tickets</h2>
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

        <div className="tickets-grid">
          {myTickets.map((ticket) => {
            const slaStatus = getSLAStatus(ticket.slaDeadline);

            return (
              <div
                key={ticket.id}
                className="ticket-tile"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <div className="ticket-tile-header">
                  <span className="ticket-id">
                    {(ticket as DisplayTicket).ticketCode ||
                      ticket.id.slice(0, 8)}
                  </span>
                  <span
                    className={`ticket-priority ${getPriorityClass(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description">{ticket.description}</p>

                <div className="ticket-meta">
                  <div className="ticket-assignee">
                    <div className="ticket-avatar">
                      {getInitials(ticket.assignedTo || "Unknown")}
                    </div>
                    <span>{ticket.assignedTo}</span>
                  </div>
                  <span className="ticket-date">
                    {formatTimeAgo(ticket.createdAt)}
                  </span>
                </div>

                <div className="ticket-tags">
                  {ticket.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="ticket-tag">
                      {tag}
                    </span>
                  ))}
                  {ticket.tags.length > 3 && (
                    <span className="ticket-tag-more">
                      +{ticket.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="ticket-footer">
                  <div className="ticket-status-container">
                    <div
                      className={`ticket-status-icon ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {getStatusIcon(ticket.status)}
                    </div>
                    <span
                      className={`ticket-status ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="ticket-sla">
                    <div className={`sla-indicator ${slaStatus.status}`}></div>
                    <span>{slaStatus.text}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {myTickets.length === 0 && (
          <div className="modern-empty-state">
            <div className="modern-empty-icon">
              <FaTasks />
            </div>
            <h3>No tickets yet</h3>
            <p>When you create support tickets, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
