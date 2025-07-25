import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaTasks,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaTicketAlt,
  FaUserCheck,
  FaChartLine,
  FaFilter,
  FaEye,
} from "react-icons/fa";
import { Loader, TicketTile } from "../common";
import type { Ticket, TicketStatus, Priority } from "../../types";
import "../../styles/dashboardShared.css";

interface ManagerStats {
  teamTickets: number;
  pendingApprovals: number;
  teamMembers: number;
  avgResolutionTime: number;
  ticketTrend: number;
  teamPerformance: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  activeTickets: number;
  resolvedToday: number;
  status: "online" | "away" | "offline";
}

export const HelpdeskDepartmentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ManagerStats>({
    teamTickets: 0,
    pendingApprovals: 0,
    teamMembers: 0,
    avgResolutionTime: 0,
    ticketTrend: 0,
    teamPerformance: 0,
  });
  const [teamTickets, setTeamTickets] = useState<Ticket[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Mock data for demonstration
        const mockStats = {
          teamTickets: 24,
          pendingApprovals: 3,
          teamMembers: 8,
          avgResolutionTime: 6.5,
          ticketTrend: 12,
          teamPerformance: 94,
        };

        const mockTeamMembers: TeamMember[] = [
          {
            id: "emp1",
            name: "Sarah Johnson",
            role: "Senior Technician",
            activeTickets: 5,
            resolvedToday: 3,
            status: "online",
          },
          {
            id: "emp2",
            name: "Tom Brown",
            role: "IT Specialist",
            activeTickets: 3,
            resolvedToday: 2,
            status: "online",
          },
          {
            id: "emp3",
            name: "Jane Doe",
            role: "Help Desk Agent",
            activeTickets: 7,
            resolvedToday: 1,
            status: "away",
          },
          {
            id: "emp4",
            name: "Mike Wilson",
            role: "Network Admin",
            activeTickets: 2,
            resolvedToday: 4,
            status: "online",
          },
        ];

        const mockTickets: Ticket[] = [
          {
            id: "T-201",
            title: "Server maintenance approval needed",
            description:
              "Requesting approval for scheduled server maintenance this weekend.",
            priority: "high" as Priority,
            status: "pending_approval" as TicketStatus,
            assignedTo: "Mike Wilson",
            createdAt: new Date("2024-01-15T10:30:00"),
            updatedAt: new Date("2024-01-15T10:30:00"),
            createdBy: "mike@company.com",
            category: "network",
            slaDeadline: new Date("2024-01-15T18:30:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
          {
            id: "T-202",
            title: "Critical database connection issue",
            description:
              "Production database experiencing intermittent connection failures.",
            priority: "critical" as Priority,
            status: "IN_PROGRESS" as TicketStatus,
            assignedTo: "Sarah Johnson",
            createdAt: new Date("2024-01-15T08:15:00"),
            updatedAt: new Date("2024-01-15T09:45:00"),
            createdBy: "system@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-15T12:15:00"),
            tags: [],
            attachments: [],
            comments: [],
            assignedDepartmentId: "45c30b4a-52d2-4535-800b-d8fada23dcb6",
          },
        ];

        // Filter out resolved/closed tickets for dashboard display
        const activeTickets = mockTickets.filter(
          (ticket) =>
            ticket.status !== "RESOLVED" && ticket.status !== "APPROVED"
        );

        setStats(mockStats);
        setTeamMembers(mockTeamMembers);
        setTeamTickets(activeTickets);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIndicator = (
    status: "online" | "away" | "offline"
  ): string => {
    return status;
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
    return <Loader centered text="Loading dashboard..." minHeight="60vh" />;
  }

  return (
    <div className="modern-dashboard">
      {/* Dashboard Header */}
      <div className="modern-dashboard-header">
        <div>
          <h1 className="modern-dashboard-title">Manager Dashboard</h1>
          <p className="modern-dashboard-subtitle">
            Oversee team performance and manage critical tickets
          </p>
        </div>
        <div className="modern-dashboard-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/reports")}
          >
            <FaChartLine />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="modern-stats-grid manager">
        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon primary">
              <FaTasks />
            </div>
          </div>
          <div className="modern-stat-value">{stats.teamTickets}</div>
          <div className="modern-stat-label">Team Tickets</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>+{stats.ticketTrend}% this week</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon warning">
              <FaUserCheck />
            </div>
          </div>
          <div className="modern-stat-value">{stats.pendingApprovals}</div>
          <div className="modern-stat-label">Pending Approvals</div>
          <div className="modern-stat-change neutral">
            <span>Awaiting your review</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon info">
              <FaUsers />
            </div>
          </div>
          <div className="modern-stat-value">{stats.teamMembers}</div>
          <div className="modern-stat-label">Team Members</div>
          <div className="modern-stat-change positive">
            <FaArrowUp />
            <span>{stats.teamPerformance}% performance</span>
          </div>
        </div>

        <div className="modern-stat-card">
          <div className="modern-stat-header">
            <div className="modern-stat-icon success">
              <FaClock />
            </div>
          </div>
          <div className="modern-stat-value">{stats.avgResolutionTime}h</div>
          <div className="modern-stat-label">Avg Resolution</div>
          <div className="modern-stat-change negative">
            <FaArrowDown />
            <span>Improved this month</span>
          </div>
        </div>
      </div>

      <div className="modern-dashboard-content">
        {/* Team Performance Section */}
        <div className="modern-section">
          <div className="modern-section-header">
            <h2 className="modern-section-title">Team Performance</h2>
            <div className="modern-section-actions">
              <button className="btn btn-secondary btn-sm">
                <FaFilter />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="modern-team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="modern-team-card">
                <div className="modern-team-header">
                  <div className="modern-team-avatar">
                    {getInitials(member.name)}
                    <div
                      className={`modern-status-indicator ${getStatusIndicator(
                        member.status
                      )}`}
                    ></div>
                  </div>
                  <div className="modern-team-info">
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                </div>
                <div className="modern-team-stats">
                  <div className="modern-team-stat">
                    <span className="value">{member.activeTickets}</span>
                    <span className="label">Active</span>
                  </div>
                  <div className="modern-team-stat">
                    <span className="value">{member.resolvedToday}</span>
                    <span className="label">Resolved Today</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Tickets Section */}
        <div className="modern-section">
          <div className="modern-section-header">
            <h2 className="modern-section-title">Critical & Pending Tickets</h2>
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
            {teamTickets.map((ticket) => {
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
            })}
          </div>

          {teamTickets.length === 0 && (
            <div className="modern-empty-state">
              <div className="modern-empty-icon">
                <FaTicketAlt />
              </div>
              <h3>No critical tickets</h3>
              <p>Your team is doing great! No urgent items need attention.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
