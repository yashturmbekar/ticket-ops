import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import type { Ticket, TicketStatus, Priority } from "../types";
import "../styles/tickets.css";

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: "T-001",
        title: "Computer won't start",
        description:
          "My computer won't turn on this morning. I've tried unplugging and plugging it back in.",
        status: "open" as TicketStatus,
        priority: "high" as Priority,
        category: "hardware",
        createdBy: "john.doe@company.com",
        assignedTo: "Tech Support",
        createdAt: new Date("2024-01-15T09:00:00Z"),
        updatedAt: new Date("2024-01-15T09:00:00Z"),
        slaDeadline: new Date("2024-01-16T09:00:00Z"),
        tags: ["hardware", "urgent"],
        attachments: [],
        comments: [],
      },
      {
        id: "T-002",
        title: "Password reset request",
        description: "Need to reset password for email account",
        status: "in_progress" as TicketStatus,
        priority: "medium" as Priority,
        category: "software",
        createdBy: "jane.smith@company.com",
        assignedTo: "IT Support",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T11:00:00Z"),
        slaDeadline: new Date("2024-01-16T10:30:00Z"),
        tags: ["account", "password"],
        attachments: [],
        comments: [],
      },
      {
        id: "T-003",
        title: "Network connectivity issues",
        description: "Intermittent connection drops throughout the day",
        status: "open" as TicketStatus,
        priority: "high" as Priority,
        category: "network",
        createdBy: "mike.wilson@company.com",
        assignedTo: "Network Team",
        createdAt: new Date("2024-01-15T14:00:00Z"),
        updatedAt: new Date("2024-01-15T14:00:00Z"),
        slaDeadline: new Date("2024-01-16T14:00:00Z"),
        tags: ["network", "connectivity"],
        attachments: [],
        comments: [],
      },
      {
        id: "T-004",
        title: "Software installation request",
        description: "Need Adobe Creative Suite installed on workstation",
        status: "resolved" as TicketStatus,
        priority: "low" as Priority,
        category: "software",
        createdBy: "designer@company.com",
        assignedTo: "IT Support",
        createdAt: new Date("2024-01-14T16:00:00Z"),
        updatedAt: new Date("2024-01-15T09:00:00Z"),
        slaDeadline: new Date("2024-01-17T16:00:00Z"),
        tags: ["software", "installation"],
        attachments: [],
        comments: [],
      },
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setLoading(false);
    }, 500);
  }, []);

  // Filter tickets
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.priority === priorityFilter
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case "open":
        return "info";
      case "in_progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="compact-header">
        <h1>Tickets ({filteredTickets.length})</h1>
        <div className="compact-actions">
          <button className="compact-btn compact-btn-primary">
            <FaPlus /> New Ticket
          </button>
          <button className="compact-btn">
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="compact-card">
        <div className="search-filters">
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="compact-search"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TicketStatus | "all")
            }
            className="compact-search"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as Priority | "all")
            }
            className="compact-search"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="compact-card">
        <table className="compact-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>SLA Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>
                  <div>
                    <div className="ticket-title">{ticket.title}</div>
                    <div className="ticket-description">
                      {ticket.description.slice(0, 50)}...
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`compact-badge compact-badge-${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`compact-badge compact-badge-${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td>{ticket.category}</td>
                <td>{ticket.assignedTo || "Unassigned"}</td>
                <td>{formatDate(ticket.createdAt)}</td>
                <td>{formatDate(ticket.slaDeadline)}</td>
                <td>
                  <div className="ticket-actions">
                    <button className="compact-btn" title="View">
                      <FaEye />
                    </button>
                    <button className="compact-btn" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="compact-btn" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTickets.length === 0 && (
        <div className="compact-card">
          <p className="no-tickets">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
