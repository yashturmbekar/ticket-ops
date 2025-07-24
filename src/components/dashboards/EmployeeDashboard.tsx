import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaTasks,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Loader, TicketTile } from "../common";
import type { Ticket } from "../../types";

// Extended ticket type for displaying API data
type DisplayTicket = Ticket & { ticketCode?: string };
import { searchMyTickets } from "../../services";
import { useNotifications } from "../../hooks";
import { transformApiTicketsToTickets } from "../../utils/apiTransforms";
import "../../styles/dashboardShared.css";

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
          searchMyTickets({}, 0, 20, "createdDate,desc"), // Get user's recent tickets (increased limit)
          //getTicketStats(),
        ]);

        // Process my tickets

        // Extract tickets from API response
        const apiTickets = myTicketsResponse.items || [];

        if (apiTickets.length > 0) {
          // Transform API tickets to internal format
          const transformedTickets = transformApiTicketsToTickets(apiTickets);
          console.log("Transformed Tickets:", transformedTickets); // Debug log

          // Filter out closed/resolved tickets for dashboard display
          const openTickets = transformedTickets.filter(
            (ticket) => ticket.status !== "RESOLVED"
          );

          setMyTickets(openTickets);

          // Calculate stats from actual ticket data
          const totalTickets = transformedTickets.length;
          const activeTicketsCount = transformedTickets.filter(
            (t: Ticket) =>
              t.status === "RAISED" ||
              t.status === "IN_PROGRESS" ||
              t.status === "PENDING_APPROVAL"
          ).length;
          const resolvedTickets = transformedTickets.filter(
            (t: Ticket) => t.status === "RESOLVED"
          ).length;

          setStats({
            myTickets: totalTickets,
            openTickets: activeTicketsCount,
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
          <h1 className="modern-dashboard-title">My Dashboard</h1>
          <p className="modern-dashboard-subtitle">
            Track your tickets and get the help you need
          </p>
        </div>
      </div>

      {/* Employee Stats Grid */}
      <div className="modern-stats-grid employee">
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon primary">
              <FaTicketAlt />
            </div>
          </div>
          <div className="modern-stat-value">{stats.myTickets}</div>
          <div className="modern-stat-label">Total Tickets</div>
          <div className="modern-stat-change neutral">
            <span>All time</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon warning">
              <FaExclamationTriangle />
            </div>
          </div>
          <div className="modern-stat-value">{stats.openTickets}</div>
          <div className="modern-stat-label">Open Tickets</div>
          <div className="modern-stat-change neutral">
            <span>Active requests</span>
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
            <span>Completed</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon info">
              <FaClock />
            </div>
          </div>
          <div className="modern-stat-value">
            {stats.avgResponseTime > 0
              ? `${stats.avgResponseTime.toFixed(1)}h`
              : "N/A"}
          </div>
          <div className="modern-stat-label">Avg Response</div>
          <div className="modern-stat-change neutral">
            <span>Response time</span>
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

        <div className="dashboard-tickets-grid">
          {myTickets.map((ticket) => {
            return (
              <TicketTile
                key={ticket.id}
                ticket={{
                  id: ticket.id,
                  ticketCode:
                    (ticket as DisplayTicket).ticketCode ||
                    `TKT-${ticket.id.slice(0, 8)}`,
                  title: ticket.title,
                  description: ticket.description,
                  status: ticket.status,
                  priority: ticket.priority,
                  assignedTo: ticket.assignedTo,
                  department: ticket.assignedDepartmentName,
                  createdAt: ticket.createdAt.toISOString(),
                  slaDeadline: ticket.slaDeadline?.toISOString(),
                  commentCount: ticket.totalCommentsCount,
                  attachmentCount: ticket.attachments?.length || 0,
                  tags: ticket.tags,
                }}
                onClick={handleTicketClick}
                compact={true}
              />
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
