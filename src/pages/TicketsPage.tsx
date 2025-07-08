import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { PageLayout } from "../components/common/PageLayout";
import type { Ticket, TicketStatus, Priority } from "../types";
import { TicketStatus as TS, Priority as P, Category } from "../types";
import "../styles/tickets.css";

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: "1",
        title: "Computer won't start",
        description:
          "My computer won't turn on this morning. I've tried unplugging and plugging it back in.",
        status: TS.OPEN,
        priority: P.HIGH,
        category: Category.HARDWARE,
        createdBy: "1",
        assignedTo: "2",
        createdAt: new Date("2024-01-15T09:00:00Z"),
        updatedAt: new Date("2024-01-15T09:00:00Z"),
        slaDeadline: new Date("2024-01-16T09:00:00Z"),
        tags: ["hardware", "urgent"],
        attachments: [],
        comments: [],
        requesterEmail: "john.doe@company.com",
        requesterPhone: "+1-555-0123",
      },
      {
        id: "2",
        title: "Password reset request",
        description: "Need to reset password for email account",
        status: TS.IN_PROGRESS,
        priority: P.MEDIUM,
        category: Category.ACCESS,
        createdBy: "3",
        assignedTo: "4",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T11:00:00Z"),
        slaDeadline: new Date("2024-01-17T10:30:00Z"),
        tags: ["account", "password"],
        attachments: [],
        comments: [],
        requesterEmail: "bob.johnson@company.com",
        requesterPhone: "+1-555-0124",
      },
      {
        id: "3",
        title: "Software installation",
        description: "Need Adobe Creative Suite installed on workstation",
        status: TS.CLOSED,
        priority: P.LOW,
        category: Category.SOFTWARE,
        createdBy: "5",
        assignedTo: "2",
        createdAt: new Date("2024-01-14T14:00:00Z"),
        updatedAt: new Date("2024-01-15T16:00:00Z"),
        slaDeadline: new Date("2024-01-17T14:00:00Z"),
        tags: ["software", "installation"],
        attachments: [],
        comments: [],
        requesterEmail: "sarah.davis@company.com",
        requesterPhone: "+1-555-0125",
      },
      {
        id: "4",
        title: "Network connectivity issues",
        description: "Intermittent network disconnections in conference room",
        status: TS.OPEN,
        priority: P.HIGH,
        category: Category.NETWORK,
        createdBy: "6",
        assignedTo: "7",
        createdAt: new Date("2024-01-15T13:45:00Z"),
        updatedAt: new Date("2024-01-15T13:45:00Z"),
        slaDeadline: new Date("2024-01-16T13:45:00Z"),
        tags: ["network", "connectivity"],
        attachments: [],
        comments: [],
        requesterEmail: "tom.brown@company.com",
        requesterPhone: "+1-555-0126",
      },
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter tickets based on search and filters
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.requesterEmail
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case P.LOW:
        return "priority-low";
      case P.MEDIUM:
        return "priority-medium";
      case P.HIGH:
        return "priority-high";
      case P.CRITICAL:
        return "priority-critical";
      default:
        return "priority-low";
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TS.OPEN:
        return "status-open";
      case TS.IN_PROGRESS:
        return "status-in-progress";
      case TS.CLOSED:
        return "status-closed";
      case TS.RESOLVED:
        return "status-resolved";
      default:
        return "status-open";
    }
  };

  const handleCreateTicket = () => {
    // TODO: Implement create ticket modal
    console.log("Create ticket");
  };

  const handleViewTicket = (ticketId: string) => {
    // TODO: Navigate to ticket details
    console.log("View ticket", ticketId);
  };

  const handleEditTicket = (ticketId: string) => {
    // TODO: Open edit ticket modal
    console.log("Edit ticket", ticketId);
  };

  const handleDeleteTicket = (ticketId: string) => {
    // TODO: Implement delete confirmation
    console.log("Delete ticket", ticketId);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-spinner">Loading tickets...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="tickets-page">
        <div className="page-header">
          <h1>Tickets</h1>
        </div>

        <div className="tickets-header">
          <div className="tickets-actions">
            <Button
              variant="primary"
              icon={<FaPlus />}
              onClick={handleCreateTicket}
            >
              Create Ticket
            </Button>
          </div>

          <div className="tickets-filters">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TicketStatus | "all")
              }
            >
              <option value="all">All Statuses</option>
              <option value={TS.OPEN}>Open</option>
              <option value={TS.IN_PROGRESS}>In Progress</option>
              <option value={TS.RESOLVED}>Resolved</option>
              <option value={TS.CLOSED}>Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as Priority | "all")
              }
            >
              <option value="all">All Priorities</option>
              <option value={P.LOW}>Low</option>
              <option value={P.MEDIUM}>Medium</option>
              <option value={P.HIGH}>High</option>
              <option value={P.CRITICAL}>Critical</option>
            </select>
          </div>
        </div>

        <div className="tickets-stats">
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Open Tickets</h3>
              <p className="stat-number">
                {tickets.filter((t) => t.status === TS.OPEN).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-number">
                {tickets.filter((t) => t.status === TS.IN_PROGRESS).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Resolved</h3>
              <p className="stat-number">
                {tickets.filter((t) => t.status === TS.RESOLVED).length}
              </p>
            </div>
          </Card>
          <Card className="stat-card">
            <div className="stat-content">
              <h3>Total</h3>
              <p className="stat-number">{tickets.length}</p>
            </div>
          </Card>
        </div>

        <Card className="tickets-table">
          <div className="table-header">
            <h3>Tickets ({filteredTickets.length})</h3>
            <Button variant="secondary" icon={<FaFilter />}>
              More Filters
            </Button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Category</th>
                  <th>Requester</th>
                  <th>Assigned To</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>
                      <div className="ticket-title">
                        <span>{ticket.title}</span>
                        <div className="ticket-tags">
                          {ticket.tags.map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`priority-badge ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>{ticket.category}</td>
                    <td>{ticket.requesterEmail}</td>
                    <td>{ticket.assignedTo || "Unassigned"}</td>
                    <td>{ticket.createdAt.toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaEye />}
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaEdit />}
                          onClick={() => handleEditTicket(ticket.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FaTrash />}
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};
