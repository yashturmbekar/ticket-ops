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
import "../../styles/dashboardModern.css";

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
          searchMyTickets({}, 0, 50, "createdDate,desc"), // Get user's tickets
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

      {/* Compact Stats Bar */}
      <div className="compact-stats-bar">
        <div className="compact-stat-item">
          <div className="compact-stat-icon primary">
            <FaTicketAlt />
          </div>
          <div className="compact-stat-content">
            <div className="compact-stat-value">{stats.myTickets}</div>
            <div className="compact-stat-label">Total Tickets</div>
          </div>
        </div>

        <div className="compact-stat-divider"></div>

        <div className="compact-stat-item">
          <div className="compact-stat-icon warning">
            <FaExclamationTriangle />
          </div>
          <div className="compact-stat-content">
            <div className="compact-stat-value">{stats.openTickets}</div>
            <div className="compact-stat-label">Open</div>
          </div>
        </div>

        <div className="compact-stat-divider"></div>

        <div className="compact-stat-item">
          <div className="compact-stat-icon success">
            <FaCheckCircle />
          </div>
          <div className="compact-stat-content">
            <div className="compact-stat-value">{stats.resolvedTickets}</div>
            <div className="compact-stat-label">Resolved</div>
          </div>
        </div>

        <div className="compact-stat-divider"></div>

        <div className="compact-stat-item">
          <div className="compact-stat-icon info">
            <FaClock />
          </div>
          <div className="compact-stat-content">
            <div className="compact-stat-value">
              {stats.avgResponseTime.toFixed(1)}h
            </div>
            <div className="compact-stat-label">Avg Response</div>
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
                  department: "IT Department",
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
