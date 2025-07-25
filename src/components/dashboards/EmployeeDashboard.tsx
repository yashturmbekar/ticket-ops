import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaTasks,
  FaExclamationTriangle,
  FaUser,
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
  const [activeTab, setActiveTab] = useState<"my">("my");
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
          <h1 className="modern-dashboard-title">Employee Dashboard</h1>
          <p className="modern-dashboard-subtitle">
            Track your tickets, access resources, and manage your IT requests
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

      {/* Active Tickets Section */}
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
            {activeTab === "my" ? (
              myTickets.length > 0 ? (
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
                        ticketCode:
                          (ticket as DisplayTicket).ticketCode ||
                          `TKT-${ticket.id.slice(0, 8)}`,
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
                        commentCount: ticket.totalCommentsCount,
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
                    <FaTasks />
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
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
