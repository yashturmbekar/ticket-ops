import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaBan,
} from "react-icons/fa";
import type { Ticket, TicketStatus, Priority } from "../types";
import "../styles/ticketsModern.css";

interface TicketsFilter {
  status: string;
  priority: string;
  category: string;
  assignee: string;
  search: string;
}

export const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"tiles" | "list">("tiles");

  const [filters, setFilters] = useState<TicketsFilter>({
    status: "",
    priority: "",
    category: "",
    assignee: "",
    search: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);

        // Mock data - replace with actual API call
        const mockTickets: Ticket[] = [
          {
            id: "T-001",
            title: "Unable to access company email",
            description:
              "Email client showing authentication errors since this morning. Unable to send or receive emails.",
            priority: "HIGH" as Priority,
            status: "RAISED" as TicketStatus,
            assignedTo: "Sarah Johnson",
            createdAt: new Date("2024-01-15T09:30:00"),
            updatedAt: new Date("2024-01-15T09:30:00"),
            createdBy: "john.doe@company.com",
            category: "email",
            slaDeadline: new Date("2024-01-15T17:30:00"),
            tags: ["email", "authentication", "urgent"],
            attachments: [],
            comments: [],
          },
          {
            id: "T-002",
            title: "Printer not responding in conference room",
            description:
              "Main conference room printer showing offline status. Unable to print documents for client meetings.",
            priority: "MEDIUM" as Priority,
            status: "IN_PROGRESS" as TicketStatus,
            assignedTo: "Tom Brown",
            createdAt: new Date("2024-01-15T08:45:00"),
            updatedAt: new Date("2024-01-15T11:20:00"),
            createdBy: "jane.smith@company.com",
            category: "printer",
            slaDeadline: new Date("2024-01-16T08:45:00"),
            tags: ["printer", "conference-room"],
            attachments: [],
            comments: [],
          },
          {
            id: "T-003",
            title: "Software installation request - Adobe Creative Suite",
            description:
              "Need Adobe Creative Suite installed on marketing team workstations for upcoming campaign work.",
            priority: "LOW" as Priority,
            status: "PENDING_APPROVAL" as TicketStatus,
            assignedTo: "Mike Wilson",
            createdAt: new Date("2024-01-14T14:20:00"),
            updatedAt: new Date("2024-01-15T09:10:00"),
            createdBy: "marketing@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-17T14:20:00"),
            tags: ["software", "installation", "marketing"],
            attachments: [],
            comments: [],
          },
          {
            id: "T-004",
            title: "Critical: Database server performance issues",
            description:
              "Production database experiencing severe performance degradation. Query response times increased by 300%.",
            priority: "CRITICAL" as Priority,
            status: "IN_PROGRESS" as TicketStatus,
            assignedTo: "Database Team",
            createdAt: new Date("2024-01-15T06:15:00"),
            updatedAt: new Date("2024-01-15T12:30:00"),
            createdBy: "monitoring@company.com",
            category: "software",
            slaDeadline: new Date("2024-01-15T10:15:00"),
            tags: ["database", "performance", "critical"],
            attachments: [],
            comments: [],
          },
          {
            id: "T-005",
            title: "New employee laptop setup",
            description:
              "Setup and configure laptop for new marketing team member starting next week.",
            priority: "MEDIUM" as Priority,
            status: "RESOLVED" as TicketStatus,
            assignedTo: "Jane Doe",
            createdAt: new Date("2024-01-13T11:00:00"),
            updatedAt: new Date("2024-01-14T16:45:00"),
            createdBy: "hr@company.com",
            category: "hardware",
            slaDeadline: new Date("2024-01-15T11:00:00"),
            tags: ["hardware", "setup", "new-employee"],
            attachments: [],
            comments: [],
          },
          {
            id: "T-006",
            title: "Wi-Fi connectivity issues in Building B",
            description:
              "Multiple users reporting intermittent Wi-Fi disconnections on the 3rd floor of Building B.",
            priority: "HIGH" as Priority,
            status: "RAISED" as TicketStatus,
            assignedTo: "Network Team",
            createdAt: new Date("2024-01-15T10:30:00"),
            updatedAt: new Date("2024-01-15T10:30:00"),
            createdBy: "facilities@company.com",
            category: "network",
            slaDeadline: new Date("2024-01-15T18:30:00"),
            tags: ["network", "wifi", "building-b"],
            attachments: [],
            comments: [],
          },
        ];

        setTickets(mockTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filters]);

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

  const getPriorityClass = (priority: Priority): string => {
    return priority.toLowerCase();
  };

  const getStatusClass = (status: TicketStatus): string => {
    return status;
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

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map((ticket) => ticket.id));
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        ticket.id.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesPriority =
        !filters.priority || ticket.priority === filters.priority;
      const matchesCategory =
        !filters.category || ticket.category === filters.category;
      const matchesAssignee =
        !filters.assignee ||
        ticket.assignedTo
          ?.toLowerCase()
          .includes(filters.assignee.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory &&
        matchesAssignee
      );
    });
  };

  const filteredTickets = getFilteredTickets();

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="loading-spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      {/* Page Title */}
      <div className="tickets-page-header">
        <div className="tickets-page-title-section">
          <h1 className="tickets-page-title">Support Tickets</h1>
          <p className="tickets-page-subtitle">
            Manage and track all support requests and incidents
          </p>
        </div>
        <div className="tickets-page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/tickets/create")}
          >
            <FaPlus />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="tickets-toolbar">
        <div className="tickets-search">
          <div className="search-input-container">
            <FaSearch />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="search-input"
            />
          </div>
        </div>

        <div className="tickets-filters">
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="RAISED">Raised</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="RESOLVED">Resolved</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="software">Software</option>
            <option value="hardware">Hardware</option>
            <option value="network">Network</option>
            <option value="email">Email</option>
            <option value="printer">Printer</option>
            <option value="access">Access</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="tickets-view-toggle">
          <button
            className={`view-toggle-btn ${
              viewMode === "tiles" ? "active" : ""
            }`}
            onClick={() => setViewMode("tiles")}
          >
            Tiles
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="tickets-results-info">
        <div className="results-count">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>

        {selectedTickets.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedTickets.length} selected</span>
            <button className="btn btn-sm btn-secondary">Assign</button>
            <button className="btn btn-sm btn-secondary">Update Status</button>
            <button className="btn btn-sm btn-secondary">Export</button>
          </div>
        )}
      </div>

      {/* Tickets Grid/List */}
      <div className={`tickets-container ${viewMode}`}>
        {viewMode === "tiles" ? (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => {
              const slaStatus = getSLAStatus(ticket.slaDeadline);

              return (
                <div
                  key={ticket.id}
                  className={`ticket-tile ${
                    selectedTickets.includes(ticket.id) ? "selected" : ""
                  }`}
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <div className="ticket-tile-header">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectTicket(ticket.id);
                      }}
                      className="ticket-checkbox"
                    />
                    <span className="ticket-id">{ticket.id}</span>
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
                      <div
                        className={`sla-indicator ${slaStatus.status}`}
                      ></div>
                      <span>{slaStatus.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="tickets-list">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedTickets.length === tickets.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Created</th>
                  <th>SLA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => {
                  const slaStatus = getSLAStatus(ticket.slaDeadline);

                  return (
                    <tr key={ticket.id} className="tickets-table-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => handleSelectTicket(ticket.id)}
                        />
                      </td>
                      <td className="ticket-id-cell">{ticket.id}</td>
                      <td className="ticket-title-cell">
                        <div>
                          <h4>{ticket.title}</h4>
                          <p>{ticket.description.substring(0, 80)}...</p>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`table-status ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {getStatusIcon(ticket.status)}
                          <span>{ticket.status.replace("_", " ")}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`table-priority ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td>
                        <div className="table-assignee">
                          <div className="assignee-avatar">
                            {getInitials(ticket.assignedTo || "Unknown")}
                          </div>
                          <span>{ticket.assignedTo}</span>
                        </div>
                      </td>
                      <td>{formatTimeAgo(ticket.createdAt)}</td>
                      <td>
                        <div className={`table-sla ${slaStatus.status}`}>
                          <div className="sla-dot"></div>
                          <span>{slaStatus.text}</span>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTicketClick(ticket.id);
                            }}
                          >
                            <FaEye />
                          </button>
                          <button className="action-btn">
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && !loading && (
        <div className="tickets-empty-state">
          <div className="empty-state-icon">
            <FaTicketAlt />
          </div>
          <h3>No tickets found</h3>
          <p>Try adjusting your search criteria or create a new ticket.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tickets/create")}
          >
            <FaPlus />
            <span>Create First Ticket</span>
          </button>
        </div>
      )}
    </div>
  );
};
